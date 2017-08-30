// @flow
/* eslint-disable max-len */

import type { Action } from "types";

import {
  fetchItemsToAdviceFrom as fetchItemsToAdviceFromRequest,
  fetchItemsStartedFrom as fetchItemsStartedFromRequest,
  fetchItemDetails as fetchItemDetailsRequest,
} from "../request";

export const fetchItemsToAdviceFrom = (lastID: string) : Action => ({
  type    : "FETCH_ITEMS_TO_ADVICE",
  payload : fetchItemsToAdviceFromRequest(lastID),
});

export const fetchItemsStartedFrom = (lastID: string) : Action => ({
  type    : "FETCH_ITEMS_STARTED",
  payload : fetchItemsStartedFromRequest(lastID),
});

export const fetchItemDetails = (id: string) : Action => ({
  type    : "FETCH_ITEM_DETAILS",
  payload : fetchItemDetailsRequest(id),
  meta    : {
    id,
  },
});

export const modifyFromStartedItems = (payload : number) : Action => ({
  type: "MODIFY_FROM_STARTED_ITEMS",
  payload,
});
