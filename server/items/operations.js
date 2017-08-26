// @flow

import type { Response, Request } from "../types";

import { rowsPerLoad } from "utility";

export const getItemsToAdvice = ({ db, user } : Request, res : Response) => {
  const
    { institutionID } = user;

  db.
    collection("items").
    find({
      authors: {
        "$in": institutionID,
      },
    }).
    sort({
      date: 0,
    }).
    limit(rowsPerLoad).
    toArray((errFind, data) => {
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
