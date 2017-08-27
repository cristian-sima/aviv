// @flow

import { combineReducers } from "redux";

import { byIDItems as byID } from "./byID";
import { toAdvice } from "./toAdvice";

export * from "./byID";
export * from "./item";
export * from "./toAdvice";

export default combineReducers({
  byID,
  toAdvice,
});
