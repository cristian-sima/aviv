// @flow


import type { State } from "types";

import * as Immutable from "immutable";

import getShouldModify from "../util/getShouldModify";

const createItemVersion = (state :State, action : any) => {

  const
    { items } = state,
    { started, byID } = items,
    { payload : item } = action;

  const _id = item.get("_id");

  const shouldAdd = getShouldModify([started.IDs], _id);

  const newByID = byID.has(_id) ? (
    byID.update(item.get("_id"), (current) => {
      if (typeof current === "undefined") {
        return current;
      }

      return current.merge({
        version    : item.get("version"),
        responses  : Immutable.List(),
        isDebating : false,
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

export default createItemVersion;
