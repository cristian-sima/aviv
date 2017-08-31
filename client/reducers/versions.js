// @flow

import type { Action, ModalState, State } from "types";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

import { getCurrentAccount } from "./auth";
import { getItem } from "./items";

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

export const getVersionsOfItem = createSelector(
  getData,
  (state, id) => id,
  (data, id) => (data.has(id) && data.get(id).toList()) || Immutable.List()
);

export const getCurrentItemAdvice = createSelector(
  getData,
  getCurrentAccount,
  getItem,
  (versions, account, item) => {

    if (typeof item === "undefined") {
      return item;
    }

    const
      id = item.get("_id"),
      version = item.get("version"),
      institutionID = account.get("institutionID");

    return (
      versions.has(id) &&
      versions.get(id).find((current) => {
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
