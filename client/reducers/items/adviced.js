// @flow

import type { Action, ItemsAdvicedState, State } from "types";

import { createSelector } from "reselect";
import * as Immutable from "immutable";

import { noError, noID, nothingFetched, rowsPerLoad } from "utility";

const newInitialState = () : ItemsAdvicedState => ({
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
  fetchItemsPending = (state : ItemsAdvicedState) => ({
    ...state,
    error    : noError,
    fetching : true,
  }),
  fetchItemsRejected = (state : ItemsAdvicedState, { payload : { error } }) => ({
    ...state,
    error,
    fetching: false,
  }),
  fetchItemsFulfilled = (state : ItemsAdvicedState, { payload }) => ({
    ...state,
    error    : noError,
    fetched  : true,
    lastID   : payload.LastID ? payload.LastID : noID,
    lastDate : payload.LastDate ? payload.LastDate : nothingFetched,
    fetching : false,
    total    : payload.Total,

    IDs: state.IDs.concat(payload.Items.result),
  }),
  modifyFromAdvicedItems = (state : ItemsAdvicedState, { payload : from }) => ({
    ...state,
    from,
  });

export const adviced = (state : ItemsAdvicedState = newInitialState(), action : Action) => {

  switch (action.type) {
    case "FETCH_ITEMS_ADVICED_PENDING":
      return fetchItemsPending(state);

    case "FETCH_ITEMS_ADVICED_REJECTED":
      return fetchItemsRejected(state, action);

    case "FETCH_ITEMS_ADVICED_FULFILLED":
      return fetchItemsFulfilled(state, action);

    case "RECONNECTING_LIVE":
    case "SIGN_OFF_FULFILLED":
      return newInitialState();

    case "MODIFY_FROM_ADVICED_ITEMS":
      return modifyFromAdvicedItems(state, action);

    default:
      return state;
  }
};

const
  fetchingSelector = (state : State) => state.items.adviced.fetching,
  errorSelector = (state : State) => state.items.adviced.error,
  IDsListSelector = (state : State) => state.items.adviced.IDs,
  byIDsMapSelector = (state : State) => state.items.byID;

export const
  getOffsetFromAdvicedItems = (state : State) => (
    state.items.adviced.from + state.items.adviced.negativeOffset
  ),
  getFromAdvicedItems = (state : State) => (
    state.items.adviced.from
  ),
  getTotalItemsAdvicedSelector = (state : State) => state.items.adviced.total,
  lastFetchedItemsAdvicedIDSelector = (state : State) => (
    state.items.adviced.lastID
  );

const getItems = createSelector(
  IDsListSelector,
  byIDsMapSelector,
  (list, byIDMap) => (
    list.map((id : number) => byIDMap.get(id))
  )
);

export const getIsFetchingItemsAdviced = createSelector(
  fetchingSelector,
  errorSelector,
  (isFetching, error) => (
    isFetching && error === noError
  )
);

export const getShouldFetchItemsAdviced = createSelector(
  getIsFetchingItemsAdviced,
  IDsListSelector,
  getTotalItemsAdvicedSelector,
  (isFetching, list, total) => (
    !isFetching &&
    (
      (total === nothingFetched) ||
      (total > list.size)
    )
  )
);

export const getIsFetchingItemsAdvicedError = createSelector(
  errorSelector,
  (error) => error !== noError
);

export const getCanLoadItemsAdvicedLocally = createSelector(
  IDsListSelector,
  (state, from) => from,
  (list, from) => (
    from + rowsPerLoad <= list.size
  )
);

export const getSortedItemsAdviced = createSelector(
  getItems,
  (list) => (
    list.sortBy((item) => -item.get("date"))
  )
);

export const getItemsAdvicedUpToSelector = createSelector(
  getSortedItemsAdviced,
  (state, requestedUpTo : number) => requestedUpTo,
  (sortedItems, requestedUpTo: number) => (
    sortedItems.slice(0, requestedUpTo)
  )
);

export const shouldFetchItemsAdvicedFrom = createSelector(
  getCanLoadItemsAdvicedLocally,
  getShouldFetchItemsAdviced,
  (canLoadLocally, shouldFetch) => (
    !canLoadLocally && shouldFetch
  )
);
