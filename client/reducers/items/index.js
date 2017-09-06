// @flow

import { combineReducers } from "redux";

import { adviced } from "./adviced";
import { byIDItems as byID } from "./byID";
import { closed } from "./closed";
import { started } from "./started";
import { toAdvice } from "./toAdvice";

export * from "./adviced";
export * from "./byID";
export * from "./closed";
export * from "./item";
export * from "./started";
export * from "./toAdvice";

export default combineReducers({
  adviced,
  byID,
  closed,
  started,
  toAdvice,
});
