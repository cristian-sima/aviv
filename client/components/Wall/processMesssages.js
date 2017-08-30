// @flow

type Message = {
  type: string;
  payload: any;
}

import { normalizeItem } from "../../request/normalize";

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
    default:
      dispatch(msg);
  }
};

export default processMesssages;
