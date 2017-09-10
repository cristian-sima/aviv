// @flow

import type { State } from "types";

import performAddIfNewer from "../util/performAddIfNewer";
import getShouldModify from "../util/getShouldModify";

import { noError } from "utility";

const addItem = (state : State, action : any) => {

  const
    { items, auth : { account } } = state,
    { toAdvice, adviced, byID } = items,
    { payload : item } = action;

  const
    institutionID = account.get("institutionID"),
    responses = item.get("responses"),
    isAdviced = responses.includes(institutionID),
    where = isAdviced ? adviced : toAdvice,
    whereKey = isAdviced ? "adviced" : "toAdvice",
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
