// @flow

import type { Action, State, SuggestionsState } from "types";

import * as Immutable from "immutable";
import { createSelector } from "reselect";
import { noError } from "utility";

const newInitialState = () => ({
  error    : noError,
  fetching : false,

  term: "",

  map: Immutable.Map(),
});

const
  changeSuggestionsCurrentTerm = (state : SuggestionsState, { payload }) => ({
    ...state,
    term: payload,
  }),
  fetchSuggestionsPending = (state : SuggestionsState) => ({
    ...state,
    error    : noError,
    fetching : true,
  }),
  fetchSuggestionsRejected = (state : SuggestionsState, { payload : { error } }) => ({
    ...state,
    fetching: false,
    error,
  }),
  fetchSuggestionsFulfilled = (state : SuggestionsState, { payload : { Term, Suggestions } }) => ({
    ...state,
    fetching: false,

    map: state.map.set(Term, Suggestions),
  });

const reducer = (state : SuggestionsState = newInitialState(), action : Action) => {

  switch (action.type) {
    case "CHANGE_SUGGESTIONS_CURRENT_TERM":
      return changeSuggestionsCurrentTerm(state, action);

    case "FETCH_SUGGESTIONS_PENDING":
      return fetchSuggestionsPending(state);

    case "FETCH_SUGGESTIONS_REJECTED":
      return fetchSuggestionsRejected(state, action);

    case "FETCH_SUGGESTIONS_FULFILLED":
      return fetchSuggestionsFulfilled(state, action);

    case "DELETE_ITEM":
    case "ADD_ITEM_STARTED":
    case "ADD_ITEM_TO_ADVICE":
    case "RECONNECTING_LIVE":
    case "SIGN_OFF_FULFILLED":
      return {
        error    : noError,
        fetching : false,

        map: state.map.clear(),
      };

    default:
      return state;
  }
};

const
  getError = (state : State) => state.suggestions.error,
  getMap = (state : State) => state.suggestions.map,
  getTerm = (state : State) => state.suggestions.term;

export const
  getSuggestionsAreFetching = (state : State) => state.suggestions.fetching;

export const getSuggestionsHaveError = createSelector(
  getError,
  (error : any) => error !== noError
);

const getTermTrimmed = createSelector(
  getTerm,
  (term) => (
    String(term).
      trim().
      toLowerCase()
  )
);

export const getSuggestionsByCurrentTerm = createSelector(
  getMap,
  getTermTrimmed,
  (map, trimTerm) => map.get(trimTerm) || []
);

export default reducer;
