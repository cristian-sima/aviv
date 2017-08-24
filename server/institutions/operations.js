// @flow

import type { Response, Request } from "../types";

import { ObjectId } from "mongodb";

import { error, selectOnlyUsers } from "../utility";

export const getInstitutions = ({ db } : Request, res : Response) => {

  const findErr = {
    Error: "Nu am putut prelua lista",
  };

  return db.
    collection("institutions").
    find().
    toArray((errInstitutions, institutions) => {
      if (errInstitutions) {
        return res.json(findErr);
      }

      return db.
        collection("users").
        find(selectOnlyUsers, { "password": 0 }).
        toArray((errUsers, users) => {
          if (errUsers) {
            return res.json(findErr);
          }

          return res.json({
            Users        : users,
            Institutions : institutions,
            Error        : "",
          });
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

export const modifyInstitution = (req : Request, res : Response) => {
  const { db, params : { institutionID }, body : { name } } = req;

  const
    institutions = db.collection("institutions"),
    whereQuery = {
      _id: ObjectId(institutionID),
    };

  return institutions.findOne(whereQuery, (errFindUser, data) => {

    if (errFindUser) {
      return error(errFindUser);
    }

    const
      setQuery = {
        "$set": {
          name,
        },
      };

    return institutions.update(whereQuery, setQuery, (errUpdate) => {
      if (errUpdate) {
        return error(errUpdate);
      }

      return res.json({
        Institution: {
          ...data,
          name,
        },
        Error: "",
      });
    });
  });
};

export const deleteInstitution = (req : Request, res : Response) => {
  const { db, params : { institutionID } } = req;

  const
    institutions = db.collection("institutions"),
    whereQuery = {
      _id: ObjectId(institutionID),
    };

  return institutions.remove(whereQuery, (errDelete) => {

    if (errDelete) {
      return error(errDelete);
    }

    return res.json({
      Error: "",
    });
  });
};
