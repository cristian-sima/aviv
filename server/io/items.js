// @flow

import type { Socket, Database } from "../types";

import { isValidItem } from "./validate";

export const addItem = (socket : Socket, db : Database, io : any) => (body : any) => {
  // const { user } = socket.request.session;

  const
    institutions = db.collection("institutions"),
    items = db.collection("items"),
    { name, authors, advicers } = body,
    institutionsInvolved = authors.concat(advicers),
    response = isValidItem({
      name,
    });

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
  };

  return institutions.find(whereClauseFind, (errFind) => {

    if (errFind) {
      return (
        socket.emit("FORM", {
          status : "FAILED",
          error  : "Aceste instituții nu există",
          form   : "ITEM_FORM",
        })
      );
    }

    return items.insert(rawItem, (errInsertItem, { ops }) => {
      if (errInsertItem) {
        return (
          socket.emit("FORM", {
            status : "FAILED",
            error  : "Nu am putut introduce actul normativ",
            form   : "ITEM_FORM",
          })
        );
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
