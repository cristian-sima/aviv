// @flow

import type { PaginatorState } from "types";

import * as Immutable from "immutable";

import { noError, noID, nothingFetched } from "utility";

const getTheLastItem = (ids, data) => {
  const
    sortedByTime = ids.
      map((current) => data.get(current)).
      sortBy((current) => -current.get("date"));

  return sortedByTime.get(sortedByTime.size - 2);
};

const performDelete = (state : PaginatorState, data : any, id : string) => {
  const { lastID, lastDate, total, IDs, negativeOffset } = state;

  if (total === nothingFetched) {
    return state;
  }

  const
    findAndRemoveCurrent = () => (
      IDs.remove(IDs.findIndex((current) => current === id))
    );

  if (lastID === id) {
    // there are more on the server
    // but nothing here

    if (IDs.size === 0) {
      return state;
    }

    if (IDs.size === 1 && total !== 1) {
      return {
        ...state,
        IDs      : Immutable.List(),
        error    : noError,
        fetched  : false,
        fetching : false,

        lastID         : noID,
        lastDate       : nothingFetched,
        from           : 0,
        negativeOffset : 0,
        total          : nothingFetched,
      };
    }

    // get the last one before latest
    const lastItem = getTheLastItem(IDs, data);

    const isLast = total === 1;

    return {
      ...state,
      lastID         : isLast ? noID : lastItem.get("_id"),
      lastDate       : isLast ? nothingFetched : lastItem.get("date"),
      IDs            : findAndRemoveCurrent(),
      total          : total - 1,
      negativeOffset : negativeOffset - 1,
    };
  }

  if (IDs.includes(id)) {
    const clearElement = total === 1;

    return {
      ...state,
      IDs            : findAndRemoveCurrent(),
      total          : total - 1,
      negativeOffset : negativeOffset - 1,
      lastID         : clearElement ? noID : lastID,
      lastDate       : clearElement ? nothingFetched : lastDate,
    };
  }

  return state;
};

export default performDelete;
