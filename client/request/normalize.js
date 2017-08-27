// @flow
import type { Response, Reject, Resolve } from "types";

import * as Immutable from "immutable";

// entities ---> Object { "1": Immutable.Map(), ... ]) }F
// result ---> List([ "1", "2", "3" ])
export const normalizeArray = (raw : Array<any>) => (
  raw.reduce((previous, current) => {
    const stringID = String(current._id);

    previous.entities = previous.entities.set(stringID, Immutable.Map(current));

    previous.result = previous.result.push(stringID);

    return previous;
  }, {
    entities : Immutable.Map(),
    result   : Immutable.List(),
  })
);

export const withPromiseCallback = (resolve : Resolve, reject : Reject) => (
  (error : Error, response : Response) => {
    if (error) {
      reject({ error: error.message });
    } else {
      resolve(response.body);
    }
  }
);

export const normalizeItem = (raw : any) => Immutable.Map(raw).merge({
  authors  : Immutable.List(raw.authors),
  advicers : Immutable.List(raw.advicers),
});

export const normalizeArrayOfItems = (items : any) => (
  items.reduce((previous, current) => {
    const stringID = String(current._id);

    previous.entities = previous.entities.set(stringID, normalizeItem(current));

    previous.result = previous.result.push(stringID);

    return previous;
  }, {
    entities : Immutable.Map(),
    result   : Immutable.List(),
  })
);

const normalizeItemDetails = ({ Item, Versions }) => ({
  Item     : normalizeItem(Item),
  Versions : normalizeArray(Versions),
});

export const checkForErrorsThenNormalizeItemDetails = (resolve : any, reject : any) => (
  (error : any, response : any) => {

    console.log("error", error);

    if (error) {
      reject({ error });
    } else {
      const { body } = response,
        { Error : ServerError } = body;

      if (typeof ServerError !== "undefined" && ServerError !== "") {
        reject({
          error: ServerError,
        });
      } else {
        resolve(
          normalizeItemDetails(body)
        );
      }
    }
  }
);
