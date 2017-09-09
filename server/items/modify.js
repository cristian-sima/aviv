// @flow

import type { Socket, Database } from "../types";

import { isValidItem } from "./validate";

import { ObjectId } from "mongodb";

export const addItem = (socket : Socket, db : Database, io : any) => (body : any) => {
  const
    institutions = db.collection("institutions"),
    items = db.collection("items"),
    { name, authors, advicers, _id } = body,
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
    ),
    emitGenericError = () => emitFormError("Nu am putut modifica actul normativ");

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

  const
    whereInstitutionClause = {
      "_id": {
        "$in": institutionsInvolved,
      },
    },
    whereClause = {
      _id: ObjectId(_id),
    },
    setClause = {
      "$set": {
        name,
        authors,
        advicers,
      },
    },
    informModify = (value) => emitFormError("Funcționează");

  return institutions.find(whereInstitutionClause, (errFind) => {

    if (errFind) {
      return emitFormError("Aceste instituții nu există");
    }

    return items.findAndModify(
      whereClause,
      [],
      setClause,
      { "new": true },
      (errUpdateCurrentVersion, { value }) => {
        if (errUpdateCurrentVersion) {
          return emitGenericError();
        }

        return informModify(value);
      }
    );
  });
};

export default addItem;
