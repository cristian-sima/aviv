// @flow

import type { State, Action } from "types";

import deleteItem from "./deleteItem";
import adviceItem from "./adviceItem";
import createItemVersionForAdvicer from "./createItemVersionForAdvicer";
import createItemVersionForAuthor from "./createItemVersionForAuthor";
import closeItemForAdvicer from "./closeItemForAdvicer";
import closeItemForAuthor from "./closeItemForAuthor";
import addItemAuthor from "./addItemAuthor";
import addItemAdvicer from "./addItemAdvicer";

const paginator = (state : State, action : Action) => {
  switch (action.type) {
    case "DELETE_ITEM":
      return deleteItem(state, action);

    case "ADVICE_ITEM":
      return adviceItem(state, action);

    case "CREATE_ITEM_VERSION_FOR_ADVICER":
      return createItemVersionForAdvicer(state, action);

    case "CREATE_ITEM_VERSION_FOR_AUTHOR":
      return createItemVersionForAuthor(state, action);

    case "CLOSE_ITEM_FOR_ADVICER":
      return closeItemForAdvicer(state, action);

    case "CLOSE_ITEM_FOR_AUTHOR":
      return closeItemForAuthor(state, action);

    case "ADD_ITEM_ADVICER":
      return addItemAdvicer(state, action);

    case "ADD_ITEM_AUTHOR":
      return addItemAuthor(state, action);

    default:
      return state;
  }
};

export default paginator;
