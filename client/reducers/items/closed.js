// @flow

import type { Action, PaginatorState, State } from "types";

import { createSelector } from "reselect";
import * as Immutable from "immutable";

import { noError, noID, nothingFetched, rowsPerLoad } from "utility";

const newInitialState = () : PaginatorState => ({
  IDs      : Immutable.List(),
  error    : noError,
  fetched  : false,
  fetching : false,

  lastID   : noID,
  lastDate : nothingFetched,
  total    : nothingFetched,

  from           : 0,
  negativeOffset : 0,
});

const
  fetchItemsPending = (state : PaginatorState) => ({
    ...state,
    error    : noError,
    fetching : true,
  }),
  fetchItemsRejected = (state : PaginatorState, { payload : { error } }) => ({
    ...state,
    error,
    fetching: false,
  }),
  fetchItemsFulfilled = (state : PaginatorState, { payload }) => ({
    ...state,
    error    : noError,
    fetched  : true,
    lastID   : payload.LastID ? payload.LastID : noID,
    lastDate : payload.LastDate ? payload.LastDate : nothingFetched,
    fetching : false,
    total    : payload.Total,

    IDs: state.IDs.concat(payload.Items.result),
  }),
  modifyFromClosedItems = (state : PaginatorState, { payload : from }) => ({
    ...state,
    from,
  });

export const closed = (state : PaginatorState = newInitialState(), action : Action) => {

  switch (action.type) {
    case "FETCH_ITEMS_CLOSED_PENDING":
      return fetchItemsPending(state);

    case "FETCH_ITEMS_CLOSED_REJECTED":
      return fetchItemsRejected(state, action);

    case "FETCH_ITEMS_CLOSED_FULFILLED":
      return fetchItemsFulfilled(state, action);

    case "RECONNECTING_LIVE":
    case "SIGN_OFF_FULFILLED":
      return newInitialState();

    case "MODIFY_FROM_CLOSED_ITEMS":
      return modifyFromClosedItems(state, action);

    default:
      return state;
  }
};

const
  fetchingSelector = (state : State) => state.items.closed.fetching,
  errorSelector = (state : State) => state.items.closed.error,
  IDsListSelector = (state : State) => state.items.closed.IDs,
  byIDsMapSelector = (state : State) => state.items.byID;

export const
  getOffsetFromClosedItems = (state : State) => (
    state.items.closed.from + state.items.closed.negativeOffset
  ),
  getFromClosedItems = (state : State) => (
    state.items.closed.from
  ),
  getTotalItemsClosedSelector = (state : State) => state.items.closed.total,
  lastFetchedItemsClosedIDSelector = (state : State) => (
    state.items.closed.lastID
  );

const getItems = createSelector(
  IDsListSelector,
  byIDsMapSelector,
  (list, byIDMap) => (
    list.map((id : number) => byIDMap.get(id))
  )
);

export const getIsFetchingItemsClosed = createSelector(
  fetchingSelector,
  errorSelector,
  (isFetching, error) => (
    isFetching && error === noError
  )
);

export const getShouldFetchItemsClosed = createSelector(
  getIsFetchingItemsClosed,
  IDsListSelector,
  getTotalItemsClosedSelector,
  (isFetching, list, total) => (
    !isFetching &&
    (
      (total === nothingFetched) ||
      (total > list.size)
    )
  )
);

export const getIsFetchingItemsClosedError = createSelector(
  errorSelector,
  (error) => error !== noError
);

export const getCanLoadItemsClosedLocally = createSelector(
  IDsListSelector,
  (state, from) => from,
  (list, from) => (
    from + rowsPerLoad <= list.size
  )
);

export const getSortedItemsClosed = createSelector(
  getItems,
  (list) => (
    list.sortBy((item) => -item.get("date"))
  )
);

export const getItemsClosedUpToSelector = createSelector(
  getSortedItemsClosed,
  (state, requestedUpTo : number) => requestedUpTo,
  (sortedItems, requestedUpTo: number) => (
    sortedItems.slice(0, requestedUpTo)
  )
);

export const shouldFetchItemsClosedFrom = createSelector(
  getCanLoadItemsClosedLocally,
  getShouldFetchItemsClosed,
  (canLoadLocally, shouldFetch) => (
    !canLoadLocally && shouldFetch
  )
);
