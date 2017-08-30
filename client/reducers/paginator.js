// @flow

import type { State, Action } from "types";

import * as Immutable from "immutable";

import { noError, noID, nothingFetched } from "utility";

const getTheLastItem = (ids, data) => {
  const
    sortedByTime = ids.
      map((current) => data.get(current)).
      sortBy((current) => -current.get("date"));

  return sortedByTime.get(sortedByTime.size - 2);
};

const performDelete = (state, data, { payload : item }) => {
  const { lastID, total, IDs } = state;

  if (total === nothingFetched) {
    return state;
  }

  const
    id = item.get("_id"),
    findAndRemoveCurrent = () => (
      IDs.remove(
        IDs.findIndex((current) => current === id)
      )
    );

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
      lastID : getTheLastItem(IDs, data).get("_id"),
      IDs    : findAndRemoveCurrent(),
      total  : total - 1,
    };
  }

  if (IDs.includes(id)) {
    return {
      ...state,
      IDs   : findAndRemoveCurrent(),
      total : total - 1,
    };
  }

  return state;
};

// const addItemIfNeeded = (state, data, { payload : item }) => {
//   const { lastID, total, IDs } = state;
//
//   if (total === nothingFetched) {
//     return state;
//   }
//
//   const
//     id = item.get("_id"),
//     currentDate = item.get("date"),
//     lastDate = IDs.getIn([
//       lastID,
//       "date",
//     ]);
//
//   if (currentDate > lastDate) {
//     return {
//       ...state,
//       IDs   : IDs.push(id),
//       total : total + 1,
//     };
//   }
//
//   return state;
// };

const shouldStore = (lists : Array<any>, id) => {
  for (const list of lists) {
    if (list.includes(id)) {
      return true;
    }
  }

  return false;
};

const deleteItem = (state : State, action : any) => ({
  ...state,
  items: {
    ...state.items,
    byID     : state.items.byID.remove(action.payload.get("_id")),
    toAdvice : performDelete(state.items.toAdvice, state.items.byID, action),
    started  : performDelete(state.items.started, state.items.byID, action),
  },
});

const adviceItem = (state :State, action : any) => {

  const
    { items } = state,
    { toAdvice, byID } = items;

  const newToAdvice = performDelete(toAdvice, byID, action);

  return {
    ...state,
    items: {
      ...items,
      byID     : shouldStore([newToAdvice], action.payload.get("_id")),
      toAdvice : newToAdvice,
    },
  };
};

const paginator = (state : State, action : Action) => {
  switch (action.type) {
    case "DELETE_ITEM":
      return deleteItem(state, action);
    case "ADVICE_ITEM":
      return adviceItem(state, action);

    default:
      return state;
  }
};

export default paginator;
