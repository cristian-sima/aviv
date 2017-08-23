// @flow

import type { Response, Request } from "../types";

export const getInstitutions = ({ db } : Request, res : Response) => {

  const
    institutions = db.collection("institutions");

  institutions.find().toArray((errFind, data) => {
    if (errFind) {
      return res.json({
        Error: "Nu am putut prelua lista",
      });
    }

    return res.json({
      Institutions : data,
      Error        : "",
    });
  });
};

export const addInstitution = ({ db, body : { name } } : Request, res : Response) => {

  const
    institutions = db.collection("institutions");

  const
    min = 5,
    max = 100,
    nr = name.length,
    isNotValid = nr < min || nr > max;

  if (isNotValid) {
    return res.json({
      Error: `Denumirea trebuie să conțină între ${min} și ${max} de caractere`,
    });
  }

  return institutions.insert({ name }, (errFind, { ops }) => {
    if (errFind) {
      return res.json({
        Error: "Nu am putut efectua operațiunea",
      });
    }

    return res.json({
      Institution : ops[0],
      Error       : "",
    });
  });
};
