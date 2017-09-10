// @flow

import type { State, Action } from "types";

import deleteItem from "./deleteItem";

import adviceItemForAdvicer from "./advicer/adviceItem";
import createItemVersionForAdvicer from "./advicer/createItemVersion";
import closeItemForAdvicer from "./advicer/closeItem";
import addItemAdvicer from "./advicer/addItem";

import adviceItemForAuthor from "./author/adviceItem";
import createItemVersionForAuthor from "./author/createItemVersion";
import closeItemForAuthor from "./author/closeItem";
import addItemAuthor from "./author/addItem";

const paginator = (state : State, action : Action) => {
  switch (action.type) {
    case "DELETE_ITEM":
      return deleteItem(state, action);

    case "ADVICE_ITEM_FOR_ADVICER":
      return adviceItemForAdvicer(state, action);

    case "ADVICE_ITEM_FOR_AUTHOR":
      return adviceItemForAuthor(state, action);

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
