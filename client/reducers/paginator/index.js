// @flow

import type { State, Action } from "types";

import deleteItem from "./deleteItem";
import adviceItem from "./adviceItem";
import createVersion from "./createVersion";
import closeItem from "./closeItem";

const paginator = (state : State, action : Action) => {
  switch (action.type) {
    case "DELETE_ITEM":
      return deleteItem(state, action);

    case "ADVICE_ITEM":
      return adviceItem(state, action);

    case "CREATE_VERSION":
      return createVersion(state, action);

    case "CLOSE_ITEM":
      return closeItem(state, action);

    default:
      return state;
  }
};

export default paginator;
