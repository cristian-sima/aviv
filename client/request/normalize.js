// @flow
import type { Response, Reject, Resolve } from "types";

import * as Immutable from "immutable";

/*
 * entities ---> Object { "1": Immutable.Map(), ... ]) }F
 * result ---> List([ "1", "2", "3" ])
 */
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

export const normalizeItem = (raw : any) => raw ? Immutable.Map(raw).merge({
  authors    : Immutable.List(raw.authors),
  date       : new Date(raw.date).getTime(),
  advicers   : Immutable.List(raw.advicers),
  responses  : Immutable.List(raw.responses),
  allAdvices : Immutable.List(raw.allAdvices),
}) : Immutable.Map();

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

export const normalizeItemDetails = ({ Item, Versions } : { Item : any ; Versions : any }) => ({
  item     : normalizeItem(Item),
  versions : normalizeArray(Versions),
});

export const checkForErrorsThenNormalizeItemDetails = (resolve : any, reject : any) => (
  (error : any, response : any) => {
    if (error) {
      return reject({ error });
    }

    const { body } = response,
      { Error : ServerError } = body;

    if (typeof ServerError !== "undefined" && ServerError !== "") {
      return reject({
        error: ServerError,
      });
    }

    return resolve(normalizeItemDetails(body));
  }
);
