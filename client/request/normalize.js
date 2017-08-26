// @flow

import * as Immutable from "immutable";

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
