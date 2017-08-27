// @flow

import type { Response, Request } from "../types";

import { rowsPerLoad } from "../utility";

export const getItemsToAdvice = (req : Request, res : Response) => {
  const
    { db, user, query } = req,
    { institutionID } = user,
    { lastID } = query;

  console.log("institutionID", institutionID);

  const whereGeneral = {
    advicers: {
      "$in": [institutionID],
    },
  };

  console.log("typeof lastID", typeof lastID);

  const searchGeneral = (
    typeof lastID === "undefined" ||
    lastID === ""
  );

  const whereClause = searchGeneral ? whereGeneral : {
    ...whereGeneral,
    _id: { $lt: lastID },
  };

  db.
    collection("items").
    find(whereClause).
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
