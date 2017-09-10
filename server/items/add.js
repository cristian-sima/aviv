// @flow

import type { Socket, Database } from "../types";

import { isValidItem } from "./validate";

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
        form   : "ITEM_ADD_FORM",
      })
    );

  // check data

  if (response.notValid) {
    return emitFormError(response.error);
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

    isClosed         : false,
    needsExamination : false,

    authors,
    advicers,
    allAdvices : [],
    responses  : [],
  };

  return institutions.find(whereClauseFind, (errFind) => {

    if (errFind) {
      return emitFormError("Aceste instituții nu există");
    }

    return items.insert(rawItem, (errInsertItem, { ops }) => {
      if (errInsertItem) {
        return emitFormError("Nu am putut introduce actul normativ");
      }

      for (const author of authors) {
        io.to(author).emit("msg", {
          type    : "ADD_ITEM_STARTED",
          payload : ops[0],
        });
      }

      for (const advicer of advicers) {
        io.to(advicer).emit("msg", {
          type    : "ADD_ITEM_TO_ADVICE",
          payload : ops[0],
        });
      }

      return socket.emit("FORM", {
        status  : "SUCCESS",
        message : "Actul normativ a fost adăugat",
        form    : "ITEM_ADD_FORM",
      });
    });
  });
};

export default addItem;
