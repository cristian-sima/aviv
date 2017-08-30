// @flow

import type { Action } from "types";

export const registerConfirmation = (payload : string) : Action => ({
  type: "REGISTER_CONFIRMATION",
  payload,
});

export const unregisterConfirmation = (payload : string) : Action => ({
  type: "UNREGISTER_CONFIRMATION",
  payload,
});
