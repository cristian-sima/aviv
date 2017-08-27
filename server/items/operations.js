// @flow

import type { Response, Request } from "../types";
import { ObjectId } from "mongodb";

import { rowsPerLoad } from "../utility";

export const getItemsToAdvice = (req : Request, res : Response) => {
  const
    { db, user, query } = req,
    { institutionID } = user,
    { lastID } = query;

  const
    whereGeneral = {
      advicers: {
        "$in": [institutionID],
      },
    },
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

  db.
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

          const LastID = (data.length > 0) ? (
            data[data.length - 1]._id
          ) : "";

          return res.json({
            Items: data,

            LastID,
            Total,
            Error: "",
          });
        });
    });
};

export const getItemDetails = (req : Request, res : Response) => {
  const
    { db, params } = req,
    // { institutionID } = user,
    { itemID } = params;

  const
    id = ObjectId(itemID),
    whereClause = {
      "_id": id,
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
      if (errFindItem) {
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
