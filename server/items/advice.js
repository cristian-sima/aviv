// @flow

import type { Socket, Database } from "../types";

import { ObjectId } from "mongodb";

import { isGoodAdviceResponse } from "./util";

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
      const
        { advicers, authors } = data,
        interested = authors.concat(advicers);

      for (const key in interested) {
        if (Object.prototype.hasOwnProperty.call(interested, key)) {
          const current = interested[key];

          io.to(current).emit("msg", {
            type    : "ADVICE_ITEM",
            payload : {
              Item     : data,
              Versions : [version],
            },
          });
        }
      }

      socket.emit("FORM", {
        status  : "SUCCESS",
        message : "Actul normativ a fost avizat",
        form    : "ADVICE_ITEM",
      });
    },
    changeAdvice = (data, institution) => {

      const versions = db.collection("versions");

      const
        { name : institutionName } = institution,
        { version } = data;

      const whereVersionClause = {
        itemID: id,
        institutionID,
        version,
      };

      const setVersionClause = {
        "$set": {
          date: new Date(),
          response,

          institutionName,

          userID,
          userName,
        },
      };

      return versions.findAndModify(
        whereVersionClause,
        [],
        setVersionClause,
        { "new": true },
        (errUpdateCurrentVersion, { value }) => {
          if (errUpdateCurrentVersion) {
            return emitGenericError();
          }

          return broadcast(data, value);
        }
      );
    },
    createAdvice = (data, institution) => {
      const { allAdvices : oldAllAdvices } = data;

      const setQueryAllAdvices = oldAllAdvices.includes(institutionID) ? {} : ({
        allAdvices: institutionID,
      });

      const setQuery = {
        "$push": {
          ...setQueryAllAdvices,
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

        return versions.insertOne(versionToInsert, (errInsertVersion, { ops }) => {
          if (errInsertVersion) {
            return emitGenericError();
          }

          return broadcast(data, ops[0]);
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
        return changeAdvice(data, institution);
      }

      return createAdvice(data, institution);
    });
  });
};

export default adviceItem;
