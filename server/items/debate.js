// @flow

import type { Socket, Database } from "../types";

import { ObjectId } from "mongodb";

export const createVersion = (socket : Socket, db : Database, io : any) => (body : any) => {

  const
    items = db.collection("items"),
    { id } = body,
    _id = ObjectId(id),
    { request : { session : { user : { institutionID } } } } = socket,
    emitFormError = (msg) => (
      socket.emit("CONFIRMATION", {
        status : "FAILED",
        error  : msg,
        id     : "CONFIRM_DEBATE_ITEM",
      })
    ),
    emitGenericError = () => emitFormError("Nu am putut trimite actul în ședința pregătitoare"),
    whereClause = {
      _id,
    },
    informSuccessCreateVersion = (data) => {
      const
        { advicers, authors } = data,
        interested = authors.concat(advicers);

      for (const current of interested) {
        io.to(current).emit("msg", {
          type    : "DEBATE_ITEM",
          payload : data,
        });
      }

      socket.emit("CONFIRMATION", {
        status  : "SUCCESS",
        message : "Am efectuat modificarea",
        id      : "CONFIRM_DEBATE_ITEM",
      });
    };

  return items.findOne(whereClause, (errFindItem, data) => {
    if (errFindItem || data === null) {
      return emitGenericError();
    }

    const
      notYours = !data.authors.includes(institutionID),
      notCompleted = data.responses.length !== data.advicers.length;

    if (notYours) {
      return emitFormError("Acest act normativ nu-ți aparține");
    }

    if (notCompleted) {
      return emitFormError("Acest act nu a primit încă toate avizele pentru această versiune");
    }

    const
      setVersionClause = {
        "$set": {
          isDebating: true,
        },
      };

    return items.findAndModify(
      whereClause,
      [],
      setVersionClause,
      { "new": true },
      (errUpdateCurrentVersion, { value }) => {
        if (errUpdateCurrentVersion) {
          return emitGenericError();
        }

        return informSuccessCreateVersion(value);
      }
    );
  });
};

export default createVersion;
