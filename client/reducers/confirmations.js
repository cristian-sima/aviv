// @flow

import type { Action, State, ConfirmationsState } from "types";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

const initialState = Immutable.List();

const
  registerConfirmation = (state : ConfirmationsState, { payload }) => (
    state.push(payload)
  ),
  unregisterConfirmation = (state : ConfirmationsState, { payload }) => (
    state.remove(state.findIndex((current) => current === payload))
  );

const reducer = (state : ConfirmationsState = initialState, action : Action) => {
  switch (action.type) {
    case "REGISTER_CONFIRMATION":
      return registerConfirmation(state, action);

    case "UNREGISTER_CONFIRMATION":
      return unregisterConfirmation(state, action);

    default:
      return state;
  }
};

const data = (state : State) => state.confirmations;

export const getIsConfirming = createSelector(
  data,
  (state, id) => id,
  (list, id) => list.includes(id),
);

export default reducer;
