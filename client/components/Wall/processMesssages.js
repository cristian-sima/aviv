// @flow

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
    case "ADD_ITEM_STARTED":
    case "ADD_ITEM_TO_ADVICE":
    case "DELETE_ITEM":
    case "CREATE_VERSION":
    case "CLOSE_ITEM":
    case "ADD_ITEM_AUTHOR":
      dispatch({
        type,
        payload: normalizeItem(payload),
      });
      break;
    case "ADVICE_ITEM":
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
