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
