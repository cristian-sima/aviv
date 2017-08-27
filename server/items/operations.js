// @flow

import type { Response, Request } from "../types";
import { ObjectId } from "mongodb";

import { rowsPerLoad } from "../utility";

export const getItemsToAdvice = (req : Request, res : Response) => {
  const
    { db, user, query } = req,
    { institutionID } = user,
    { lastID, from } = query;

  console.log("-----");
  console.log("institutionID", institutionID);
  console.log("lastID", lastID);
  console.log("from", from);

  const whereGeneral = {
    advicers: {
      "$in": [institutionID],
    },
  };

  const searchGeneral = (
    typeof lastID === "undefined" ||
    lastID === ""
  );

  const whereClause = searchGeneral ? whereGeneral : {
    ...whereGeneral,
    _id: { $lt: ObjectId(lastID) },
  };

  console.log("whereClause", whereClause);

  db.
    collection("items").
    find(whereClause).
    // skip(Number(from)).
    limit(rowsPerLoad).
    sort({ _id: -1 }).
    toArray((errFind, data) => {
      if (errFind) {
        return res.json({
          Error: "Nu am putut prelua lista",
        });
      }

      return db.
        collection("items").
        find(whereGeneral).
        count((errCount, Total) => {
          if (errFind) {
            return res.json({
              Error: "Nu am putut prelua lista",
            });
          }

          const LastFetchedID = (data.length > 0) ? data[data.length - 1]._id : "";

          return res.json({
            Items: data,
            LastFetchedID,

            Total,
            Error: "",
          });
        });
    });
};
