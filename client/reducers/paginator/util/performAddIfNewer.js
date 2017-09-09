// @flow

import type { PaginatorState } from "types";

import { nothingFetched } from "utility";

const performAddIfNewer = (state : PaginatorState, item : any) => {
  const {
    lastDate,
    total,
    IDs,
    negativeOffset,
    lastID,
  } = state;

  if (total === nothingFetched) {
    return state;
  }

  const
    _id = item.get("_id"),
    currentDate = item.get("date"),
    isRecent = currentDate > lastDate,
    allFetched = total === IDs.size,
    moreToFetch = !allFetched,
    shouldAdd = allFetched || (isRecent && moreToFetch);

  if (shouldAdd) {
    const
      totalIsZero = total === 0,
      isOlder = currentDate < lastDate,
      newLastDate = totalIsZero ? currentDate : (
        isOlder ? currentDate : lastDate
      ),
      newLastID = totalIsZero ? _id : (
        isOlder ? _id : lastID
      );

    return {
      ...state,
      negativeOffset : negativeOffset + 1,
      IDs            : IDs.push(_id),
      total          : total + 1,
      lastDate       : newLastDate,
      lastID         : newLastID,
    };
  }

  return state;
};

export default performAddIfNewer;
