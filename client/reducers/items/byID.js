// @flow

import type { ItemsByIDState } from "types";

import { noError } from "utility";

import * as Immutable from "immutable";

const initialState = Immutable.Map();

const
  mergeWith = (state : ItemsByIDState, { payload }) => (
    state.mergeWith((previous, next) => {
      if (typeof previous === "undefined") {
        return next;
      }

      return previous;
    }, payload.Items.entities)
  ),
  fetchItemPending = (state : ItemsByIDState, { meta }) => {
    const itemID = (meta) ? String(meta.id) : "";

    if (state.has(itemID)) {
      return state.update(
        itemID,
        (item) => item.set("detailsFetching", true)
      );
    }

    const result = state.set(itemID, Immutable.Map({
      detailsFetching      : true,
      detailsFetched       : false,
      detailsFetchingError : noError,
    }));

    return result;
  },
  fetchItemRejected = (state : ItemsByIDState, { payload : { error }, meta }) => {
    const itemID = (meta) ? String(meta.id) : "";

    return state.update(
      itemID,
      (item) => item.merge({
        detailsFetching      : false,
        detailsFetchingError : error,
        detailsFetched       : false,
      })
    );
  },
  fetchItemFulFilled = (state : ItemsByIDState, { payload : { item } }) => {
    const
      current = item.merge({
        detailsFetching      : false,
        detailsFetchingError : noError,
        detailsFetched       : true,
      }),
      id = String(item.get("_id"));

    return state.set(id, current);
  },
  addOrModifyItem = (state : ItemsByIDState, { payload }) => (
    state.set(
      String(payload.get("_id")),
      payload.merge({
        detailsFetched       : true,
        detailsFetching      : false,
        detailsFetchingError : noError,
      })
    )
  ),
  createVersion = (state : ItemsByIDState, { payload }) => (
    state.update(payload.get("_id"), (current) => {
      if (typeof current === "undefined") {
        return current;
      }

      return current.merge({
        version   : payload.get("version") + 1,
        responses : Immutable.List(),
      });
    })
  );

export const byIDItems = (state : ItemsByIDState = initialState, action : any) => {
  switch (action.type) {
    case "FETCH_ITEMS_TO_ADVICE_FULFILLED":
    case "FETCH_ITEMS_STARTED_FULFILLED":
    case "FETCH_ITEMS_ADVICED_FULFILLED":
      return mergeWith(state, action);

    case "FETCH_ITEM_DETAILS_PENDING": {
      return fetchItemPending(state, action);
    }
    case "FETCH_ITEM_DETAILS_REJECTED":
      return fetchItemRejected(state, action);

    case "FETCH_ITEM_DETAILS_FULFILLED":
      return fetchItemFulFilled(state, action);

    case "ADD_ITEM_STARTED":
    case "ADD_ITEM_TO_ADVICE":
      return addOrModifyItem(state, action);

    case "CREATE_VERSION":
      return createVersion(state, action);

    case "RECONNECTING_LIVE":
    case "SIGN_OFF_FULFILLED":
      return state.clear();

    default:
      return state;
  }
};
