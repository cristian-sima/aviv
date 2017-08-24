// @flow

import type { Response, Request } from "../types";

import { ObjectId } from "mongodb";

import { selectOnlyUsers, error } from "../utility";

import { isValidUser } from "./validate";
import { generateTemporaryPassword } from "../auth/util";

export const getUsers = ({ db } : Request, res : Response) => {

  const
    users = db.collection("users");

  users.find(selectOnlyUsers).toArray((errFind, data) => {
    if (errFind) {
      return res.json({
        Error: "Nu am putut prelua lista",
      });
    }

    return res.json({
      Users : data,
      Error : "",
    });
  });
};

export const resetPassword = (req : Request, res : Response) => {
  const { db, params : { accountID } } = req;

  const
    users = db.collection("users"),
    whereQuery = {
      _id: ObjectId(accountID),
    };

  return users.findOne(whereQuery, (errFindUser) => {

    if (errFindUser) {
      return error(errFindUser);
    }

    const
      temporaryPassword = generateTemporaryPassword(),
      setQuery = {
        "$set": {
          requireChange : true,
          temporaryPassword,
          password      : "",
        },
      };

    return users.update(whereQuery, setQuery, (errUpdate) => {
      if (errUpdate) {
        return error(errUpdate);
      }

      return res.json({
        temporaryPassword,
      });
    });
  });
};


export const addUser = ({ db, body } : Request, res : Response) => {

  const
    institutions = db.collection("institutions"),
    users = db.collection("users"),
    { name, username, phone, email, institutionID } = body,
    user = {
      name,
      username,
      email,
      phone,
      institutionID,

      requireChange     : true,
      temporaryPassword : generateTemporaryPassword(),
      password          : "",
    },
    response = isValidUser(user);

  if (response.notValid) {
    return res.json({
      Error: response.error,
    });
  }

  return institutions.find({ "_id": institutionID }, (errFind, institution) => {
    if (errFind || institution === null) {
      return res.json({
        Error: "Nu există această instituție",
      });
    }

    return users.insert(user, (errInsert, { ops }) => {
      if (errFind) {
        return res.json({
          Error: "Nu am putut introduce utilizatorul",
        });
      }

      return res.json({
        Error : "",
        User  : ops[0],
      });
    });
  });
};
