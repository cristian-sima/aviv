// @flow

import type { State } from "types";

import performAddIfNewer from "../util/performAddIfNewer";
import getShouldModify from "../util/getShouldModify";

import { noError } from "utility";

const addItem = (state : State, action : any) => {

  const
    { items } = state,
    { started, closed, byID } = items,
    { payload : item } = action;

  const
    isClosed = item.get("isClosed"),
    where = isClosed ? closed : started,
    whereKey = isClosed ? "closed" : "started",
    _id = item.get("_id");

  const
    newWhere = performAddIfNewer(where, item),
    shouldAdd = getShouldModify([newWhere.IDs], _id);

  const newByID = shouldAdd ? byID.set(
    item.get("_id"), (
      item.merge({
        detailsFetched       : false,
        detailsFetching      : false,
        detailsFetchingError : noError,
      })
    )
  ) : byID;

  return {
    ...state,
    items: {
      ...items,
      [whereKey] : newWhere,
      byID       : newByID,
    },
  };
};

export default addItem;
