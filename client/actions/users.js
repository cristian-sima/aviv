// @flow

import type { Action } from "types";

export const resetPassword = (payload : {
  id: string;
  temporaryPassword: string;
}) : Action => ({
  type: "RESET_PASSWORD",
  payload,
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
