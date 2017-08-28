// @flow

import { combineReducers } from "redux";

import { byIDItems as byID } from "./byID";
import { toAdvice } from "./toAdvice";
import { started } from "./started";

export * from "./byID";
export * from "./item";
export * from "./toAdvice";
export * from "./started";

export default combineReducers({
  byID,
  toAdvice,
  started,
});
