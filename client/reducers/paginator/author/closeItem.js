// @flow

import type { State } from "types";

import performDelete from "../util/performDelete";
import performAddIfNewer from "../util/performAddIfNewer";
import getShouldModify from "../util/getShouldModify";

const closeItem = (state :State, action : any) => {

  const
    { items } = state,
    { closed, started, byID } = items,
    { payload : item } = action;

  const
    _id = item.get("_id"),
    newClosed = performAddIfNewer(closed, item),
    newStarted = performDelete(started, byID, _id);

  const shouldAdd = getShouldModify([newClosed.IDs], _id);

  const newByID = byID.has(_id) ? (
    byID.update(item.get("_id"), (current) => {
      if (typeof current === "undefined") {
        return current;
      }

      return current.merge({
        "isClosed"   : true,
        "isDebating" : false,
      });
    })
  ) : (
    shouldAdd ? byID.set(item.get("_id"), item) : byID
  );

  return {
    ...state,
    items: {
      ...items,
      started : newStarted,
      closed  : newClosed,
      byID    : newByID,
    },
  };
};

export default closeItem;
