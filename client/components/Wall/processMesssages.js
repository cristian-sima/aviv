// @flow

type Message = {
  type: string;
  payload: any;
}

import { normalizeItem, normalizeItemDetails } from "../../request/normalize";

const processMesssages = (dispatch : any, msg : Message) => {
  const { type, payload } = msg;

  switch (msg.type) {
    case "ADD_ITEM_STARTED":
    case "ADD_ITEM_TO_ADVICE":
    case "DELETE_ITEM":
      dispatch({
        type,
        payload: normalizeItem(payload),
      });
      break;
    case "ADVICE_ITEM":
      console.log("payload", payload);
      dispatch({
        type,
        payload: normalizeItemDetails(payload),
      });
      break;
    default:
      dispatch(msg);
  }
};

export default processMesssages;
