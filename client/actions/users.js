// @flow

import type { Action } from "types";

import {
  fetchUsers as fetchUsersRequest,
  resetPassword as resetPasswordRequest,
} from "request";

export const fetchUsers = () : Action => ({
  type    : "FETCH_USERS",
  payload : fetchUsersRequest(),
});

export const resetPassword = (id : string) : Action => ({
  type    : "RESET_PASSWORD",
  payload : resetPasswordRequest(id),
  meta    : {
    id,
  },
});
