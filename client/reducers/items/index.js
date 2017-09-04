// @flow

import { combineReducers } from "redux";

import { byIDItems as byID } from "./byID";
import { toAdvice } from "./toAdvice";
import { adviced } from "./adviced";
import { started } from "./started";

export * from "./byID";
export * from "./item";
export * from "./toAdvice";
export * from "./started";
export * from "./adviced";

export default combineReducers({
  byID,
  toAdvice,
  started,
  adviced,
});
