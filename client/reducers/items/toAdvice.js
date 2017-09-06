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
  addItem = (state : PaginatorState, { payload }) => {
    const { total, IDs, negativeOffset } = state;

    const
      newIDs = IDs.push(payload.get("_id")),
      newTotal = total + 1,
      newNegativeOffset = negativeOffset + 1;

    if (total === nothingFetched) {
      return state;
    }

    if (total === 0) {
      const
        lastID = payload.get("_id"),
        lastDate = payload.get("date");

      return {
        ...state,
        lastID,
        lastDate,
        negativeOffset : newNegativeOffset,
        IDs            : newIDs,
        total          : newTotal,
      };
    }

    return {
      ...state,
      negativeOffset : newNegativeOffset,
      total          : newTotal,
      IDs            : newIDs,
    };
  },
  modifyFromToAdviceItems = (state : PaginatorState, { payload : from }) => ({
    ...state,
    from,
  });

export const toAdvice = (state : PaginatorState = newInitialState(), action : Action) => {

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

    case "MODIFY_FROM_TO_ADVICE_ITEMS":
      return modifyFromToAdviceItems(state, action);

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
  getOffsetFromToAdviceItems = (state : State) => (
    state.items.toAdvice.from + state.items.toAdvice.negativeOffset
  ),
  getFromToAdviceItems = (state : State) => (
    state.items.toAdvice.from
  ),
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
    list.sortBy((item) => -item.get("date"))
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
