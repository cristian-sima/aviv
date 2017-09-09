// @flow

import type { State } from "types";

import performDelete from "./util/performDelete";
import performAddIfNewer from "./util/performAddIfNewer";
import getShouldModify from "./util/getShouldModify";

const closeItem = (state :State, action : any) => {

  const
    { items } = state,
    { closed, started, byID } = items,
    { payload : item } = action;

  const
    _id = item.get("_id"),
    newToAdvice = performAddIfNewer(closed, item),
    newAdviced = performDelete(started, byID, item);


  const
    shouldAdd = getShouldModify([newToAdvice.IDs], _id);

  const newByID = byID.has(_id) ? (
    byID.update(item.get("_id"), (current) => {
      if (typeof current === "undefined") {
        return current;
      }

      return current.set("isClosed", true);
    })
  ) : (
    shouldAdd ? byID.set(item.get("_id"), item) : byID
  );

  return {
    ...state,
    items: {
      ...items,
      started : newAdviced,
      closed  : newToAdvice,
      byID    : newByID,
    },
  };
};

export default closeItem;
