// @flow

import type { State, Action } from "types";

import * as Immutable from "immutable";

import { noError, noID, nothingFetched } from "utility";

const getTheLastItem = (ids, data) => {
  const
    sortedByTime = ids.map((current) => (
      data.get(current)
    )).sortBy((current) => (
      -(new Date(current.get("date"))).getTime()
    ));

  return sortedByTime.get(sortedByTime.size - 2);
};

const deleteItem = (state, data, { payload : item }) => {
  const { lastID, total, IDs } = state;

  const id = item.get("_id");

  if (lastID === id) {
    // there are more on the server
    // but nothing here
    if (IDs.size === 1 && total !== 1) {
      return {
        ...state,
        IDs      : Immutable.List(),
        error    : noError,
        fetched  : false,
        fetching : false,

        lastID : noID,
        total  : nothingFetched,
      };
    }

    // get the last one before latest
    return {
      ...state,
      lastID : getTheLastItem(IDs, data).get("id"),
      IDs    : IDs.remove(id),
      total  : total - 1,
    };
  }

  return {
    ...state,
    IDs   : IDs.remove(id),
    total : total - 1,
  };
};

const paginator = (state : State, action : Action) => {
  switch (action.type) {
    case "DELETE_ITEM":
      return {
        ...state,
        items: {
          toAdvice: deleteItem(state.items.toAdvice, state.items.byID, action),
        },
      };
    default:
      return state;
  }
};

export default paginator;
