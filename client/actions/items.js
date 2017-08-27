// @flow
/* eslint-disable max-len */

import type { Action } from "types";

import {
  fetchItemsToAdviceFrom as fetchItemsToAdviceFromRequest,
  fetchItemDetails as fetchItemDetailsRequest,
} from "../request";

export const fetchItemsToAdviceFrom = (lastID: string) : Action => ({
  type    : "FETCH_ITEMS_TO_ADVICE",
  payload : fetchItemsToAdviceFromRequest(lastID),
});

export const fetchItemDetails = (id: string) : Action => ({
  type    : "FETCH_ITEM_DETAILS",
  payload : fetchItemDetailsRequest(id),
  meta    : {
    id,
  },
});
