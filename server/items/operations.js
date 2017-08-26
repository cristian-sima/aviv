// @flow

import type { Response, Request } from "../types";

import { rowsPerLoad } from "../utility";

export const getItemsToAdvice = (req : Request, res : Response) => {
  const
    { db, user, query } = req,
    { institutionID } = user,
    { lastID } = query;

  const whereGeneral = {
    authors: {
      "$in": [institutionID],
    },
  };


  const whereClause = lastID === "" ? whereGeneral : {
    ...whereGeneral,
    _id: { $lt: lastID },
  };

  db.
    collection("items").
    find(whereClause).
    skip(rowsPerLoad).
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

          return res.json({
            Items: data,

            Total,
            Error: "",
          });
        });
    });
};
