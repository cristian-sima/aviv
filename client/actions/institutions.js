// @flow

import type { Action } from "types";

import {
  fetchInstitutions as fetchInstitutionsRequest,
} from "request";

export const fetchInstitutions = () : Action => ({
  type    : "FETCH_INSTITUTIONS",
  payload : fetchInstitutionsRequest(),
});
