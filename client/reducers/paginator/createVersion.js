// @flow


import type { State } from "types";

import * as Immutable from "immutable";

import performDelete from "./util/performDelete";
import performAddIfNewer from "./util/performAddIfNewer";
import getShouldModify from "./util/getShouldModify";

const createVersion = (state :State, action : any) => {

  const
    { items } = state,
    { toAdvice, adviced, byID } = items,
    { payload : item } = action;

  const
    _id = item.get("_id"),
    newToAdvice = performAddIfNewer(toAdvice, item),
    newAdviced = performDelete(adviced, byID, item);

  const
    shouldAdd = getShouldModify([newToAdvice.IDs], _id);

  const newByID = byID.has(_id) ? (
    byID.update(item.get("_id"), (current) => {
      if (typeof current === "undefined") {
        return current;
      }

      return current.merge({
        version   : item.get("version"),
        responses : Immutable.List(),
      });
    })
  ) : (
    shouldAdd ? byID.set(item.get("_id"), item) : byID
  );

  return {
    ...state,
    items: {
      ...items,
      adviced  : newAdviced,
      toAdvice : newToAdvice,
      byID     : newByID,
    },
  };
};

export default createVersion;
