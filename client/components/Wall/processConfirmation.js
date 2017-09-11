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
  hideModal as hideModalAction,
} from "actions";

import { history } from "../../store/store";

const processConfirmation = (dispatch : any, { status, id, error, message } : Msg) => {
  switch (status) {
    case "FAILED":
      dispatch(unregisterConfirmationAction(id));
      setTimeout(() => {
        dispatch(notifyError(error));
      });
      break;
    case "SUCCESS":
      switch (id) {
        case "CONFIRM_DELETE_ITEM":
          history.push("/started");
          break;
        case "CONFIRM_CREATE_VERSION":
        case "CONFIRM_CLOSE_ITEM":
        case "CONFIRM_DEBATE_ITEM":
          setTimeout(() => {
            dispatch(hideModalAction());
          });
          break;
        default:

      }
      setTimeout(() => {
        dispatch(unregisterConfirmationAction(id));
        setTimeout(() => {
          dispatch(notify(message));
        });
      });
      break;
    default:
  }
};

export default processConfirmation;
