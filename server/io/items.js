// @flow

import type { Socket, Database } from "../types";

import { ObjectId } from "mongodb";

import { isValidItem } from "./validate";
import { isGoodAdviceResponse } from "./util";

export const addItem = (socket : Socket, db : Database, io : any) => (body : any) => {
  const
    institutions = db.collection("institutions"),
    items = db.collection("items"),
    { name, authors, advicers } = body,
    institutionsInvolved = authors.concat(advicers),
    response = isValidItem({
      name,
    }),
    emitFormError = (msg) => (
      socket.emit("FORM", {
        status : "FAILED",
        error  : msg,
        form   : "ITEM_FORM",
      })
    );

  // check data

  if (response.notValid) {
    return (
      socket.emit("FORM", {
        status : "FAILED",
        error  : response.error,
        form   : "ITEM_FORM",
      })
    );
  }

  if (authors.length === 0) {
    return (
      emitFormError("Trebuie furnizat cel puțin un autor")
    );
  }

  if (advicers.length === 0) {
    return emitFormError("Trebuie furnizat cel puțin un avizator");
  }

  const whereClauseFind = {
    "_id": {
      "$in": institutionsInvolved,
    },
  };

  const rawItem = {
    name,
    version : 1,
    date    : new Date(),

    authors,
    advicers,
    responses: [],
  };

  return institutions.find(whereClauseFind, (errFind) => {

    if (errFind) {
      return emitFormError("Aceste instituții nu există");
    }

    return items.insert(rawItem, (errInsertItem, { ops }) => {
      if (errInsertItem) {
        return emitFormError("Nu am putut introduce actul normativ");
      }

      for (const key in authors) {
        if (Object.prototype.hasOwnProperty.call(authors, key)) {
          const current = authors[key];

          io.to(current).emit("msg", {
            type    : "ADD_ITEM_STARTED",
            payload : ops[0],
          });
        }
      }

      for (const key in advicers) {
        if (Object.prototype.hasOwnProperty.call(advicers, key)) {
          const current = advicers[key];

          io.to(current).emit("msg", {
            type    : "ADD_ITEM_TO_ADVICE",
            payload : ops[0],
          });
        }
      }

      return socket.emit("FORM", {
        status  : "SUCCESS",
        message : "Actul normativ a fost adăugat",
        form    : "ITEM_FORM",
      });
    });
  });
};

export const deleteItem = (socket : Socket, db : Database, io : any) => (body : any) => {

  const
    items = db.collection("items"),
    { id } = body,
    _id = ObjectId(id),
    { request : { session : { user : { institutionID } } } } = socket,
    emitFormError = (msg) => (
      socket.emit("CONFIRMATION", {
        status : "FAILED",
        error  : msg,
        id     : "CONFIRM_DELETE_ITEM",
      })
    ),
    emitGenericError = () => emitFormError("Nu am putut retrage actul normativ"),
    whereClause = {
      _id,
    },
    informSuccessDelete = (data) => {
      socket.emit("CONFIRMATION", {
        status  : "SUCCESS",
        message : "Actul normativ a fost retras",
        id      : "CONFIRM_DELETE_ITEM",
      });

      const
        { advicers, authors } = data,
        interested = authors.concat(advicers);

      for (const key in interested) {
        if (Object.prototype.hasOwnProperty.call(interested, key)) {
          const current = interested[key];

          io.to(current).emit("msg", {
            type    : "DELETE_ITEM",
            payload : data,
          });
        }
      }
    };

  return items.findOne(whereClause, (errFindItem, data) => {
    if (errFindItem || data === null) {
      return emitGenericError();
    }

    if (!data.authors.includes(institutionID)) {
      return emitFormError("Acest act normativ nu-ți aparține");
    }

    const
      whereVersionsClause = {
        itemID: id,
      },
      versions = db.collection("versions");

    // remove versions and item
    return versions.remove(whereVersionsClause, (errDeleteVersions) => {
      if (errDeleteVersions) {
        return emitGenericError();
      }

      return items.remove(whereClause, (errDeleteItem) => {
        if (errDeleteItem) {
          return emitGenericError();
        }

        return informSuccessDelete(data);
      });
    });
  });
};

export const adviceItem = (socket : Socket, db : Database, io : any) => (body : any) => {

  const
    items = db.collection("items"),
    { id, response : rawResponse } = body,
    { request : { session : { user } } } = socket,
    { institutionID, _id : userObjectID, name: userName } = user,
    userID = userObjectID.toString(),
    response = Number(rawResponse),
    emitFormError = (msg) => (
      socket.emit("FORM", {
        status : "FAILED",
        error  : msg,
        form   : "ADVICE_ITEM",
      })
    ),
    emitGenericError = () => emitFormError("Nu am putut aviza acest act normativ");

  const
    _id = ObjectId(id),
    whereClause = {
      _id,
    };

  const
    broadcast = (data, version) => {
      socket.emit("FORM", {
        status  : "SUCCESS",
        message : "Actul normativ a fost avizat",
        form    : "ADVICE_ITEM",
      });
    },
    changeAdvice = () => emitFormError("Proiectul a mai fost avizat"),
    createAdvice = (data, institution) => {
      const setQuery = {
        "$push": {
          responses: institutionID,
        },
      };

      const { name : institutionName } = institution;

      return items.update(whereClause, setQuery, (errUpdateItem) => {
        if (errUpdateItem) {
          return emitGenericError();
        }

        const { version } = data;

        const
          versions = db.collection("versions"),
          versionToInsert = {
            itemID : id,
            date   : new Date(),
            version,
            response,

            institutionName,
            institutionID,

            userID,
            userName,
          };

        return versions.insert(versionToInsert, (errInsertVersion) => {
          if (errInsertVersion) {
            return emitGenericError();
          }

          return broadcast(data);
        });
      });
    };

  if (!isGoodAdviceResponse(response)) {
    return emitFormError("Răspunsul nu este în formatul acceptat");
  }

  return items.findOne(whereClause, (errFindItem, data) => {
    if (errFindItem || data === null) {
      return emitFormError("Acest act normativ nu există");
    }

    const
      { advicers, responses } = data,
      isAdvicer = advicers.includes(institutionID);

    if (!isAdvicer) {
      return emitFormError("Nu ești avizator pentru acest act normativ");
    }

    const
      whereInstitutionClause = {
        _id: ObjectId(institutionID),
      },
      institutions = db.collection("institutions");

    return institutions.findOne(whereInstitutionClause, (errFindInstitution, institution) => {
      if (errFindItem || data === null) {
        return emitGenericError();
      }

      const hadAdviced = responses.includes(institutionID);

      if (hadAdviced) {
        return changeAdvice();
      }

      return createAdvice(data, institution);
    });
  });
};
