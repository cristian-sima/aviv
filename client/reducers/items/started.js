// @flow

import type { Action, ItemsStartedState, State } from "types";

import { createSelector } from "reselect";
import * as Immutable from "immutable";

import { noError, noID, nothingFetched, rowsPerLoad } from "utility";

const newInitialState = () : ItemsStartedState => ({
  IDs      : Immutable.List(),
  error    : noError,
  fetched  : false,
  fetching : false,

  lastID : noID,
  total  : nothingFetched,
});

const
  fetchItemsPending = (state : ItemsStartedState) => ({
    ...state,
    error    : noError,
    fetching : true,
  }),
  fetchItemsRejected = (state : ItemsStartedState, { payload : { error } }) => ({
    ...state,
    error,
    fetching: false,
  }),
  fetchItemsFulfilled = (state : ItemsStartedState, { payload }) => ({
    ...state,
    error    : noError,
    fetched  : true,
    lastID   : payload.LastID,
    fetching : false,
    total    : payload.Total,

    IDs: state.IDs.concat(payload.Items.result),
  }),
  addItem = (state : ItemsStartedState, { payload }) => {
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

export const started = (state : ItemsStartedState = newInitialState(), action : Action) => {

  switch (action.type) {
    case "FETCH_ITEMS_STARTED_PENDING":
      return fetchItemsPending(state);

    case "FETCH_ITEMS_STARTED_REJECTED":
      return fetchItemsRejected(state, action);

    case "FETCH_ITEMS_STARTED_FULFILLED":
      return fetchItemsFulfilled(state, action);

    case "ADD_ITEM_STARTED":
      return addItem(state, action);

    case "RECONNECTING_LIVE":
    case "SIGN_OFF_FULFILLED":
      return newInitialState();

    default:
      return state;
  }
};

const
  fetchingSelector = (state : State) => state.items.started.fetching,
  errorSelector = (state : State) => state.items.started.error,
  IDsListSelector = (state : State) => state.items.started.IDs,
  byIDsMapSelector = (state : State) => state.items.byID;

export const
  getTotalItemsStartedSelector = (state : State) => state.items.started.total,
  lastFetchedItemsStartedIDSelector = (state : State) => (
    state.items.started.lastID
  );

const getItems = createSelector(
  IDsListSelector,
  byIDsMapSelector,
  (list, byIDMap) => (
    list.map((id : number) => byIDMap.get(id))
  )
);

export const getIsFetchingItemsStarted = createSelector(
  fetchingSelector,
  errorSelector,
  (isFetching, error) => (
    isFetching && error === noError
  )
);

export const getShouldFetchItemsStarted = createSelector(
  getIsFetchingItemsStarted,
  IDsListSelector,
  getTotalItemsStartedSelector,
  (isFetching, list, total) => (
    !isFetching &&
    (
      (total === nothingFetched) ||
      (total > list.size)
    )
  )
);

export const getIsFetchingItemsStartedError = createSelector(
  errorSelector,
  (error) => error !== noError
);

export const getCanLoadItemsStartedLocally = createSelector(
  IDsListSelector,
  (state, from) => from,
  (list, from) => (
    from + rowsPerLoad <= list.size
  )
);

export const getSortedItemsStarted = createSelector(
  getItems,
  (list) => (
    list.sortBy((item) => -new Date(item.get("date")).getTime())
  )
);

export const getItemsStartedUpToSelector = createSelector(
  getSortedItemsStarted,
  (state, requestedUpTo : number) => requestedUpTo,
  (sortedItems, requestedUpTo: number) => (
    sortedItems.slice(0, requestedUpTo)
  )
);

export const shouldFetchItemsStartedFrom = createSelector(
  getCanLoadItemsStartedLocally,
  getShouldFetchItemsStarted,
  (canLoadLocally, shouldFetch) => (
    !canLoadLocally && shouldFetch
  )
);
