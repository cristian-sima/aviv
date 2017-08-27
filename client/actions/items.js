// @flow
/* eslint-disable max-len */

import type { Action } from "types";

import {
  fetchItemsToAdviceFrom as fetchItemsToAdviceFromRequest,
} from "request";

export const fetchItemsToAdviceFrom = (data : { from : number, lastID: string }) : Action => ({
  type    : "FETCH_ITEMS_TO_ADVICE",
  payload : fetchItemsToAdviceFromRequest(data),
});
