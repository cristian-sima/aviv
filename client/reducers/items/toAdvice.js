// @flow

import type { Action, ItemsToAdviceState, State } from "types";

type SimpleSelector = (state : State, itemID : string) => any

import { createSelector } from "reselect";
import * as Immutable from "immutable";

import { noError, noID, nothingFetched, rowsPerLoad } from "utility";

const newInitialState = () : ItemsToAdviceState => ({
  IDs      : Immutable.List(),
  error    : noError,
  fetched  : false,
  fetching : false,

  lastFetchedID : noID,
  total         : nothingFetched,
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
    error         : noError,
    fetched       : true,
    lastFetchedID : payload.LastFetchedID,
    fetching      : false,
    total         : payload.Total,

    IDs: state.IDs.concat(payload.Items.result),
  }),
  addItem = (state : ItemsToAdviceState, { payload }) => {
    const { lastFetchedID, total } = state;

    if (lastFetchedID === noID) {
      return state;
    }

    const itemID = String(payload.get("_id"));

    return {
      ...state,
      IDs   : state.IDs.push(itemID),
      total : total + 1,
    };
  },
  deleteItem = (state : ItemsToAdviceState, { payload : { item } }) => {
    const { total } = state;

    const getTotal = () => {
        if (total === nothingFetched) {
          return nothingFetched;
        }

        return total - 1;
      },
      itemID = String(item.get("_id"));

    return {
      ...state,
      IDs: state.IDs.delete(
        state.IDs.indexOf(itemID)
      ),
      total: getTotal(),
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

    case "DELETE_ITEM":
      return deleteItem(state, action);

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
    state.items.toAdvice.lastFetchedID
  );

export const getItem = (state : State, id : string) => (
  byIDsMapSelector(state).get(id)
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
  (state, from: number) => from,
  (isFetching, list, total, from) => (
    !isFetching &&
    (from + rowsPerLoad - 1 > list.size) &&
    (
      (total === nothingFetched) ||
      (total > from)
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

export const getSortedItems = createSelector(
  getItems,
  (list) => (
    list.sortBy((item) => -new Date(item.get("date")).getTime())
  )
);

export const getItemsToAdviceUpToSelector = createSelector(
  getSortedItems,
  (state, requestedUpTo : number) => requestedUpTo,
  (sortedItems, requestedUpTo: number) => (
    sortedItems.slice(0, requestedUpTo)
  )
);

export const getIsFetchingItemDetailsError : SimpleSelector = createSelector(
  byIDsMapSelector,
  (state, id : string) => id,
  (byIDsMap, itemID) => {
    const ok = byIDsMap.has(itemID);

    if (!ok) {
      return false;
    }

    const item = byIDsMap.get(itemID),
      error = item.get("detailsFetchingError");

    return typeof error !== "undefined" && error !== noError;
  }
);

export const getIsFetchingItemDetails : SimpleSelector = createSelector(
  byIDsMapSelector,
  (state, itemID : string) => itemID,
  (byIDsMap, itemID) => {

    const ok = byIDsMap.has(itemID);

    if (!ok) {
      return true;
    }

    const item = byIDsMap.get(itemID);

    return item.get("detailsFetching") === true;
  }
);

export const getShouldFetchItemDetails : SimpleSelector = createSelector(
  byIDsMapSelector,
  (state, itemID : string) => itemID,
  (byIDsMap, itemID) => {
    const hasItem = byIDsMap.has(itemID);

    if (!hasItem) {
      return true;
    }

    const item = byIDsMap.get(itemID);

    return (
      !item.get("detailsFetching") &&
      !item.get("detailsFetched")
    );
  }
);

export const getAreFetchedItemDetails : SimpleSelector = createSelector(
  byIDsMapSelector,
  (state, itemID : string) => itemID,
  (byIDsMap, itemID) => {
    const hasItem = byIDsMap.has(itemID);

    if (!hasItem) {
      return false;
    }

    const item = byIDsMap.get(itemID);

    return (
      item.get("detailsFetched")
    );
  }
);

export const shouldFetchItemsToAdviceFrom = createSelector(
  getCanLoadItemsToAdviceLocally,
  getShouldFetchItemsToAdvice,
  (canLoadLocally, shouldFetch) => (
    !canLoadLocally && shouldFetch
  )
);
