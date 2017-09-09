// @flow

import type { Socket, Database } from "../types";

import { isValidItem } from "./validate";

import { ObjectId } from "mongodb";

import {
  PozitiveWithObservations,
  Negative,
} from "./util";

const difference = (first, second) => (
  first.filter((current) => second.indexOf(current) < 0)
);

export const addItem = (socket : Socket, db : Database, io : any) => (body : any) => {
  const
    institutions = db.collection("institutions"),
    items = db.collection("items"),
    {
      name,
      authors: newAuthors,
      advicers: newAdvicers,
      _id,
    } = body,
    institutionsInvolved = newAuthors.concat(newAdvicers),
    response = isValidItem({
      name,
    }),
    emitFormError = (msg) => (
      socket.emit("FORM", {
        status : "FAILED",
        error  : msg,
        form   : "ITEM_FORM",
      })
    ),
    emitGenericError = () => emitFormError("Nu am putut modifica actul normativ");

  // check data

  if (response.notValid) {
    return emitFormError(response.error);
  }

  if (newAuthors.length === 0) {
    return (
      emitFormError("Trebuie furnizat cel puțin un autor")
    );
  }

  if (newAdvicers.length === 0) {
    return emitFormError("Trebuie furnizat cel puțin un avizator");
  }

  const
    broadcastModify = (institutionID, value) => {
      io.to(institutionID).emit("msg", {
        type    : "MODIFY_ITEM",
        payload : value,
      });
    },
    broadcastDelete = (institutionID, value) => {
      io.to(institutionID).emit("msg", {
        type    : "DELETE_ITEM",
        payload : value,
      });
    },
    broadcastAddNewAuthor = (institutionID, value) => {
      io.to(institutionID).emit("msg", {
        type    : "ADD_ITEM_AUTHOR",
        payload : value,
      });
    },
    broadcastAddNewAdvicer = (institutionID, value) => {
      io.to(institutionID).emit("msg", {
        type    : "ADD_ITEM_ADVICER",
        payload : value,
      });
    };

  const
    whereInstitutionClause = {
      "_id": {
        "$in": institutionsInvolved,
      },
    },
    whereClause = {
      _id: ObjectId(_id),
    },
    informAuthors = (oldData, value) => {
      const {
        authors: oldAuthors,
      } = oldData;

      for (const oldAuthor of oldAuthors) {
        if (newAuthors.includes(oldAuthor)) {
          broadcastModify(oldAuthor, value);
        } else {
          broadcastDelete(oldAuthor, value);
        }
      }

      // inform new authors
      for (const newAuthor of newAuthors) {
        const isNew = !oldAuthors.includes(newAuthor);

        if (isNew) {
          broadcastAddNewAuthor(newAuthor, value);
        }
      }
    },
    informAdvicers = (oldData, value) => {
      const {
        advicers: oldAdvicers,
      } = oldData;

      for (const oldAdvicer of oldAdvicers) {
        if (newAdvicers.includes(oldAdvicer)) {
          broadcastModify(oldAdvicer, value);
        } else {
          broadcastDelete(oldAdvicer, value);
        }
      }

      // inform new advicers
      for (const newAdvicer of newAdvicers) {
        const isNew = !oldAdvicers.includes(newAdvicer);

        if (isNew) {
          broadcastAddNewAdvicer(newAdvicer, value);
        }
      }
    },
    informCurrentAuthor = () => socket.emit("FORM", {
      status  : "SUCCESS",
      message : "Actul normativ a fost modificat",
      form    : "ITEM_FORM",
    }),
    informModify = (oldData, value) => {
      informAuthors(oldData, value);
      informAdvicers(oldData, value);

      return informCurrentAuthor();
    };

  return institutions.find(whereInstitutionClause, (errFind) => {

    if (errFind) {
      return emitFormError("Aceste instituții nu există");
    }

    return items.findOne(whereClause, (errFindItem, oldData) => {
      if (errFindItem) {
        return emitGenericError();
      }

      const {
        advicers: oldAdvicers,
        version,
      } = oldData;

      // get responses to remove
      const
        advicersToRemove = difference(oldAdvicers, newAdvicers),
        versions = db.collection("versions"),
        whereClauseRemove = {
          version,
          itemID        : _id,
          institutionID : {
            "$in": advicersToRemove,
          },
        };

      return versions.remove(whereClauseRemove, (errDeleteVersions) => {
        if (errDeleteVersions) {
          return emitGenericError();
        }

        const whereClauseCount = {
          "itemID" : _id,
          version,
          "$or"    : [
            {
              "response": PozitiveWithObservations,
            },
            {
              "response": Negative,
            },
          ],
        };

        // check if it needsExamination
        return versions.count(whereClauseCount, (errCountVersions, number) => {
          if (errCountVersions) {
            return emitGenericError();
          }

          const needsExamination = number !== 0;

          const setClause = {
            "$set": {
              name,
              authors  : newAuthors,
              advicers : newAdvicers,
              needsExamination,
            },
            "$pull": {
              responses: {
                "$in": advicersToRemove,
              },
              allAdvices: {
                "$in": advicersToRemove,
              },
            },
          };

          return items.findAndModify(
            whereClause,
            [],
            setClause,
            { "new": true },
            (errUpdateCurrentVersion, data) => {
              if (errUpdateCurrentVersion) {
                return emitGenericError();
              }

              const { value } = data;

              return informModify(oldData, value);
            }
          );
        });
      });
    });
  });
};

export default addItem;
