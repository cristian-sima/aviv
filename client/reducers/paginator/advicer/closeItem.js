// @flow

import type { State } from "types";

import getShouldModify from "../util/getShouldModify";

const closeItem = (state :State, action : any) => {

  const
    { items } = state,
    { adviced, byID } = items,
    { payload : item } = action;

  const _id = item.get("_id");

  const shouldAdd = getShouldModify([adviced.IDs], _id);

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
      byID: newByID,
    },
  };
};

export default closeItem;
