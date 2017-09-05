// @flow

import type { Response, Request } from "../types";

const maxRows = 3;

const projectClause = {
  _id  : 1,
  name : 1,
};

export const getSuggestions = (req : Request, res : Response) => {
  const
    { db, query } = req,
    { search } = query;

  const { user : { institutionID } } = req;

  const whereClause = {
    "$or": [
      {
        "authors": {
          "$in": [institutionID],
        },
        "name": {
          "$regex": new RegExp(`.*${search}.*`, "i"),
        },
      },
      {
        "advicers": {
          "$in": [institutionID],
        },
        "name": {
          "$regex": new RegExp(`.*${search}.*`, "i"),
        },
      },
      {
        "allAdvices": {
          "$in": [institutionID],
        },
        "name": {
          "$regex": new RegExp(`.*${search}.*`, "i"),
        },
      },
    ],
  };

  const
    canNotGetTheList = () => res.json({
      Error: "Nu am putut prelua lista",
    });

  return db.
    collection("items").
    find(whereClause, projectClause).
    limit(maxRows).
    toArray((errFind, data) => {
      if (errFind) {
        return canNotGetTheList();
      }

      return res.json({
        Term        : search,
        Suggestions : data,
      });
    });
};
