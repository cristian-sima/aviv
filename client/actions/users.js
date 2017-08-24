// @flow

import type { Action } from "types";

import {
  resetPassword as resetPasswordRequest,
} from "request";

export const resetPassword = (id : string) : Action => ({
  type    : "RESET_PASSWORD",
  payload : resetPasswordRequest(id),
  meta    : {
    id,
  },
});

export const addUser = (user : any) : Action => ({
  type    : "ADD_USER",
  payload : user,
});

export const modifyUser = (user : any) : Action => ({
  type    : "MODIFY_USER",
  payload : user,
});

export const deleteUser = (id : string) : Action => ({
  type    : "DELETE_USER",
  payload : id,
});
