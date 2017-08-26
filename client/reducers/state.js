// @flow

import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form/immutable";
import { routerReducer } from "react-router-redux";
import { reducer as notifications } from "react-notification-system-redux";

import auth from "./auth";
import institutions from "./institutions";
import users from "./users";
import modal from "./modal";
import items from "./items";

// try to keep them in alphabetic order
const rootReducer = combineReducers({
  auth,
  institutions,
  users,
  modal,
  items,

  notifications,
  form   : formReducer,
  router : routerReducer,
});

export default rootReducer;
