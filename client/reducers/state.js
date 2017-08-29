// @flow

import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form/immutable";
import { routerReducer } from "react-router-redux";
import { reducer as notifications } from "react-notification-system-redux";
import { reducer as uiReducer } from "redux-ui";
import reduceReducers from "reduce-reducers";

import auth from "./auth";
import institutions from "./institutions";
import users from "./users";
import modal from "./modal";
import items from "./items";
import paginator from "./paginator";

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
  paginator,
);

export default rootReducer;
