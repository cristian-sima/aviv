// @flow

import type { Action, ModalState, State } from "types";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

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
  (data, id) => data.get(id)
);

export default reducer;
