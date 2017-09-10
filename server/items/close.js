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
        id     : "CONFIRM_CLOSE_ITEM",
      })
    ),
    emitGenericError = () => emitFormError("Nu am putut trimite actul la SGG"),
    whereClause = {
      _id,
    },
    informSuccessCreateVersion = (data) => {
      const { advicers, authors } = data;

      for (const advicer of advicers) {
        io.to(advicer).emit("msg", {
          type    : "CLOSE_ITEM_FOR_ADVICER",
          payload : data,
        });
      }

      for (const author of authors) {
        io.to(author).emit("msg", {
          type    : "CLOSE_ITEM_FOR_AUTHOR",
          payload : data,
        });
      }

      socket.emit("CONFIRMATION", {
        status  : "SUCCESS",
        message : "Actul a fost trimis la SGG",
        id      : "CONFIRM_CLOSE_ITEM",
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
          isClosed: true,
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
