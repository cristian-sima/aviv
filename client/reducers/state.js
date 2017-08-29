// @flow

import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form/immutable";
import { routerReducer } from "react-router-redux";
import { reducer as notifications } from "react-notification-system-redux";
import { reducer as uiReducer } from "redux-ui";

import auth from "./auth";
import institutions from "./institutions";
import users from "./users";
import modal from "./modal";
import items from "./items";

import reduceReducers from "reduce-reducers";

// try to keep them in alphabetic order
const rootReducer = reduceReducers(
  combineReducers({
    auth,
    institutions,
    users,
    modal,
    items,

    notifications,
    form   : formReducer,
    ui     : uiReducer,
    router : routerReducer,
  }),
  (state, action) => {
    switch (action.type) {
      case "ADD_ITEM_TO_ADVICE":
        console.log("state", state);
        console.log("action", action);
        return state;
      default:
        return state;
    }
  }
);

export default rootReducer;
