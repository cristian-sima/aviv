// @flow
/* eslint-disable no-fallthrough*/

type Message = {
  type: string;
  payload: any;
}

import { normalizeItem, normalizeItemDetails } from "../../request/normalize";

import {
  hideModal as hideModalAction,
} from "actions";

const processMesssages = (dispatch : any, msg : Message) => {
  const { type, payload } = msg;

  switch (msg.type) {
    case "DELETE_ITEM":
    case "DEBATE_ITEM":

    case "ADD_ITEM_STARTED":
    case "ADD_ITEM_TO_ADVICE":

    case "CREATE_ITEM_VERSION_FOR_ADVICER":
    case "CREATE_ITEM_VERSION_FOR_AUTHOR":

    case "CLOSE_ITEM_FOR_ADVICER":
    case "CLOSE_ITEM_FOR_AUTHOR":

    case "ADD_ITEM_AUTHOR":
    case "ADD_ITEM_ADVICER":
      dispatch({
        type,
        payload: normalizeItem(payload),
      });
      break;
    case "ADVICE_ITEM_FOR_AUTHOR":
    case "ADVICE_ITEM_FOR_ADVICER":
      dispatch({
        type,
        payload: normalizeItemDetails(payload),
      });
      break;
    case "MODIFY_ITEM":
      dispatch({
        type,
        payload: normalizeItem(payload),
      });
      setTimeout(() => {
        dispatch(hideModalAction());
      });
      break;
    default:
      dispatch(msg);
  }
};

export default processMesssages;
