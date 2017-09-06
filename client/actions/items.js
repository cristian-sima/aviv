// @flow
/* eslint-disable max-len */

import type { Action } from "types";

import {
  fetchItemsToAdviceFrom as fetchItemsToAdviceFromRequest,
  fetchItemsAdvicedFrom as fetchItemsAdvicedFromRequest,
  fetchItemsStartedFrom as fetchItemsStartedFromRequest,
  fetchItemsClosedFrom as fetchItemsClosedFromRequest,
  fetchItemDetails as fetchItemDetailsRequest,
} from "../request";

export const fetchItemsToAdviceFrom = (lastID: string) : Action => ({
  type    : "FETCH_ITEMS_TO_ADVICE",
  payload : fetchItemsToAdviceFromRequest(lastID),
});

export const modifyFromToAdviceItems = (payload : number) : Action => ({
  type: "MODIFY_FROM_TO_ADVICE_ITEMS",
  payload,
});

export const fetchItemsAdvicedFrom = (lastID: string) : Action => ({
  type    : "FETCH_ITEMS_ADVICED",
  payload : fetchItemsAdvicedFromRequest(lastID),
});

export const modifyFromAdvicedItems = (payload : number) : Action => ({
  type: "MODIFY_FROM_ADVICED_ITEMS",
  payload,
});

export const fetchItemsStartedFrom = (lastID: string) : Action => ({
  type    : "FETCH_ITEMS_STARTED",
  payload : fetchItemsStartedFromRequest(lastID),
});

export const modifyFromStartedItems = (payload : number) : Action => ({
  type: "MODIFY_FROM_STARTED_ITEMS",
  payload,
});

export const fetchItemsClosedFrom = (lastID: string) : Action => ({
  type    : "FETCH_ITEMS_CLOSED",
  payload : fetchItemsClosedFromRequest(lastID),
});

export const modifyFromClosedItems = (payload : number) : Action => ({
  type: "MODIFY_FROM_CLOSED_ITEMS",
  payload,
});

export const fetchItemDetails = (id: string) : Action => ({
  type    : "FETCH_ITEM_DETAILS",
  payload : fetchItemDetailsRequest(id),
  meta    : {
    id,
  },
});
