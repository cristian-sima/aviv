// @flow

import type { Action, ItemsToAdviceState, State } from "types";

import { createSelector } from "reselect";
import * as Immutable from "immutable";

import { noError, noID, nothingFetched, rowsPerLoad } from "utility";

const newInitialState = () : ItemsToAdviceState => ({
  IDs      : Immutable.List(),
  error    : noError,
  fetched  : false,
  fetching : false,

  lastID : noID,
  total  : nothingFetched,
});

const
  fetchItemsPending = (state : ItemsToAdviceState) => ({
    ...state,
    error    : noError,
    fetching : true,
  }),
  fetchItemsRejected = (state : ItemsToAdviceState, { payload : { error } }) => ({
    ...state,
    error,
    fetching: false,
  }),
  fetchItemsFulfilled = (state : ItemsToAdviceState, { payload }) => ({
    ...state,
    error    : noError,
    fetched  : true,
    lastID   : payload.LastID,
    fetching : false,
    total    : payload.Total,

    IDs: state.IDs.concat(payload.Items.result),
  }),
  addItem = (state : ItemsToAdviceState, { payload }) => {
    const { total } = state;

    if (total === nothingFetched) {
      return state;
    }

    return {
      ...state,
      IDs   : state.IDs.push(payload.get("_id")),
      total : total + 1,
    };
  };

export const toAdvice = (state : ItemsToAdviceState = newInitialState(), action : Action) => {

  switch (action.type) {
    case "FETCH_ITEMS_TO_ADVICE_PENDING":
      return fetchItemsPending(state);

    case "FETCH_ITEMS_TO_ADVICE_REJECTED":
      return fetchItemsRejected(state, action);

    case "FETCH_ITEMS_TO_ADVICE_FULFILLED":
      return fetchItemsFulfilled(state, action);

    case "ADD_ITEM_TO_ADVICE":
      return addItem(state, action);

    case "RECONNECTING_LIVE":
    case "SIGN_OFF_FULFILLED":
      return newInitialState();

    default:
      return state;
  }
};

const
  fetchingSelector = (state : State) => state.items.toAdvice.fetching,
  errorSelector = (state : State) => state.items.toAdvice.error,
  IDsListSelector = (state : State) => state.items.toAdvice.IDs,
  byIDsMapSelector = (state : State) => state.items.byID;

export const
  getTotalItemsToAdviceSelector = (state : State) => state.items.toAdvice.total,
  lastFetchedItemsToAdviceIDSelector = (state : State) => (
    state.items.toAdvice.lastID
  );

const getItems = createSelector(
  IDsListSelector,
  byIDsMapSelector,
  (list, byIDMap) => (
    list.map((id : number) => byIDMap.get(id))
  )
);

export const getIsFetchingItemsToAdvice = createSelector(
  fetchingSelector,
  errorSelector,
  (isFetching, error) => (
    isFetching && error === noError
  )
);

export const getShouldFetchItemsToAdvice = createSelector(
  getIsFetchingItemsToAdvice,
  IDsListSelector,
  getTotalItemsToAdviceSelector,
  (isFetching, list, total) => (
    !isFetching &&
    (
      (total === nothingFetched) ||
      (total > list.size)
    )
  )
);

export const getIsFetchingItemsToAdviceError = createSelector(
  errorSelector,
  (error) => error !== noError
);

export const getCanLoadItemsToAdviceLocally = createSelector(
  IDsListSelector,
  (state, from) => from,
  (list, from) => (
    from + rowsPerLoad <= list.size
  )
);

export const getSortedItemsToAdvice = createSelector(
  getItems,
  (list) => (
    list.sortBy((item) => -new Date(item.get("date")).getTime())
  )
);

export const getItemsToAdviceUpToSelector = createSelector(
  getSortedItemsToAdvice,
  (state, requestedUpTo : number) => requestedUpTo,
  (sortedItems, requestedUpTo: number) => (
    sortedItems.slice(0, requestedUpTo)
  )
);

export const shouldFetchItemsToAdviceFrom = createSelector(
  getCanLoadItemsToAdviceLocally,
  getShouldFetchItemsToAdvice,
  (canLoadLocally, shouldFetch) => (
    !canLoadLocally && shouldFetch
  )
);
