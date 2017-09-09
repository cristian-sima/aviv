// @flow

import type { PaginatorState } from "types";

import { nothingFetched } from "utility";

const performAddIfNewer = (state : PaginatorState, data : any, item : any) => {
  const { lastDate, total, IDs, negativeOffset } = state;

  if (total === nothingFetched) {
    return state;
  }

  const
    _id = item.get("_id"),
    currentDate = item.get("date"),
    isRecent = currentDate > lastDate,
    allFetched = state.total === state.IDs.size,
    moreToFetch = !allFetched,
    shouldAdd = allFetched || (isRecent && moreToFetch);

  if (shouldAdd) {
    const saveThis = total === 0;

    return {
      ...state,
      negativeOffset : negativeOffset + 1,
      IDs            : IDs.push(_id),
      total          : total + 1,
      lastDate       : saveThis ? currentDate : state.lastDate,
      lastID         : saveThis ? _id : state.lastID,
    };
  }

  return state;
};

export default performAddIfNewer;
