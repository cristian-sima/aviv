// @flow

import type { Action } from "types";

import { fetchSuggestions as fetchSuggestionsRequest } from "request";

export const fetchSuggestions = (search : string) : Action => ({
  type    : "FETCH_SUGGESTIONS",
  payload : fetchSuggestionsRequest(search.trim().toLowerCase()),
});

export const changeSuggestionsCurrentTerm = (newTerm : string) : Action => ({
  type    : "CHANGE_SUGGESTIONS_CURRENT_TERM",
  payload : newTerm,
});
