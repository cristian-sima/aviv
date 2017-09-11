// @flow

import type { Response, Request } from "../types";
import { ObjectId } from "mongodb";

import { rowsPerLoad } from "../utility";

export const getItems = (req : Request, res : Response, whereGeneral : any) => {
  const
    { db, query } = req,
    { lastID } = query;

  const
    canNotGetTheList = () => res.json({
      Error: "Nu am putut prelua lista",
    }),
    searchGeneral = (
      typeof lastID === "undefined" ||
    lastID === ""
    ),
    whereClause = searchGeneral ? whereGeneral : {
      ...whereGeneral,
      _id: { $lt: ObjectId(lastID) },
    },
    sortType = { _id: -1 };

  return db.
    collection("items").
    find(whereClause).
    limit(rowsPerLoad).
    sort(sortType).
    toArray((errFind, data) => {
      if (errFind) {
        return canNotGetTheList();
      }

      return db.
        collection("items").
        find(whereGeneral).
        count((errCount, Total) => {
          if (errFind) {
            return canNotGetTheList();
          }

          const things = (data.length > 0) ? ((function inside () {
            const lastItem = data[data.length - 1];

            return {
              LastID   : lastItem._id,
              LastDate : lastItem.date,
            };
          })()) : {
            LastID   : "",
            LastDate : "",
          };

          return res.json({
            ...things,
            Items: data,

            Total,
            Error: "",
          });
        });
    });
};

export const getItemsStarted = (req : Request, res : Response) => {
  const { user : { institutionID } } = req;

  const
    where = {
      authors: {
        "$in": [institutionID],
      },
      isClosed: false,
    };

  return getItems(req, res, where);
};

export const getItemsToAdvice = (req : Request, res : Response) => {
  const { user : { institutionID } } = req;

  const
    where = {
      advicers: {
        "$in": [institutionID],
      },
      responses: {
        "$nin": [institutionID],
      },
    };

  return getItems(req, res, where);
};

export const getItemsAdviced = (req : Request, res : Response) => {
  const { user : { institutionID } } = req;

  const
    where = {
      "$or": [
        {
          allAdvices: {
            "$in": [institutionID],
          },
          isClosed: true,
        },
        {
          responses: {
            "$in": [institutionID],
          },
          isClosed: false,
        },
      ],
    };

  return getItems(req, res, where);
};

export const getItemsClosed = (req : Request, res : Response) => {
  const { user : { institutionID } } = req;

  const
    where = {
      authors: {
        "$in": [institutionID],
      },
      isClosed: true,
    };

  return getItems(req, res, where);
};

export const getItemDetails = (req : Request, res : Response) => {
  const
    { db, params } = req,
    { user : { institutionID } } = req,
    { itemID } = params;

  const
    id = ObjectId(itemID),
    whereClause = {
      "_id" : id,
      "$or" : [
        {
          "allAdvices": {
            "$in": [institutionID],
          },
        },
        {
          "advicers": {
            "$in": [institutionID],
          },
        },
        {
          "authors": {
            "$in": [institutionID],
          },
        },
      ],
    },
    whereVersionClause = {
      itemID,
    },
    canNotGetData = () => res.json({
      Error: "Nu am putut datele",
    });

  db.
    collection("items").
    findOne(whereClause, (errFindItem, Item) => {
      if (errFindItem || Item === null) {
        return canNotGetData();
      }

      return db.
        collection("versions").
        find(whereVersionClause).
        toArray((errFindVersions, Versions) => {
          if (errFindVersions) {
            return canNotGetData();
          }

          return res.json({
            Item,
            Versions,
            Error: "",
          });
        });
    });
};
