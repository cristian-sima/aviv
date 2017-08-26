// @flow
/* eslint-disable max-len */

import type { Action } from "types";

import {
  fetchItemsToAdviceFrom as fetchItemsToAdviceFromRequest,
} from "request";

export const fetchItemsToAdviceFrom = (from : number) : Action => ({
  type    : "COMPANY_FETCH_INVOICES",
  payload : fetchItemsToAdviceFromRequest(from),
});
