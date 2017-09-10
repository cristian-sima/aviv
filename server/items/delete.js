// @flow

import type { Socket, Database } from "../types";

import { ObjectId } from "mongodb";

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
      const
        { advicers, authors } = data,
        interested = authors.concat(advicers);

      for (const current of interested) {
        io.to(current).emit("msg", {
          type    : "DELETE_ITEM",
          payload : data,
        });
      }

      socket.emit("CONFIRMATION", {
        status  : "SUCCESS",
        message : "Actul normativ a fost retras",
        id      : "CONFIRM_DELETE_ITEM",
      });
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

export default deleteItem;
