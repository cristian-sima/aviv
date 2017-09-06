// @flow

import type { Action, ModalState, State } from "types";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

import { getCurrentAccount } from "./auth";
import { getItem, getAreFetchedItemDetails } from "./items";

const initialState = Immutable.Map();

const
  fetchItemFulFilled = (state : ModalState, { payload : { item, versions } }) => (
    state.set(item.get("_id"), versions.entities)
  );

const reducer = (state : ModalState = initialState, action : Action) => {
  switch (action.type) {

    case "FETCH_ITEM_DETAILS_FULFILLED":
      return fetchItemFulFilled(state, action);

    default:
      return state;
  }
};

const getData = (state : State) => state.versions;

export const getItemVersions = createSelector(
  getData,
  (state, id) => id,
  (data, id) => (data.has(id) && data.get(id).toList()) || Immutable.List()
);

export const getHistory = createSelector(
  getItemVersions,
  getItem,
  (list, item) => {
    const currentVersions = item.get("version");

    return (
      list.
        filter((current) => current.get("version") !== currentVersions).
        groupBy((current) => current.get("version")).
        sortBy((current, key) => -key)
    );
  }
);

export const getCurrentItemAdvice = createSelector(
  getAreFetchedItemDetails,
  getData,
  getCurrentAccount,
  getItem,
  (areDetailsFetched, versions, account, item) => {

    if (!areDetailsFetched) {
      return null;
    }

    const
      id = item.get("_id"),
      version = item.get("version"),
      institutionID = account.get("institutionID"),
      versionsForItem = versions.get(id);

    if (typeof versionsForItem === "undefined") {
      return null;
    }

    return (
      versionsForItem.find((current) => {
        if (typeof current === "undefined") {
          return current;
        }

        return (
          current.get("version") === version &&
          current.get("institutionID") === institutionID
        );
      })
    );
  }
);

export default reducer;
