// @flow

type Msg = {
  status: string;
  id: string;
  error: string;
  message: string;
};

import {
  notify,
  notifyError,
  unregisterConfirmation as unregisterConfirmationAction,
} from "actions";


const processConfirmation = (dispatch : any, { status, id, error, message } : Msg) => {
  switch (status) {
    case "FAILED":
      dispatch(unregisterConfirmationAction(id));
      setTimeout(() => {
        dispatch(notifyError(error));
      });
      break;
    case "SUCCESS":
      setTimeout(() => {
        dispatch(notify(message));
      });
      switch (id) {
        case "DELETE_ITEM":
          document.location.replace("/started");
          break;
        default:

      }
      break;
    default:
  }
};

export default processConfirmation;
