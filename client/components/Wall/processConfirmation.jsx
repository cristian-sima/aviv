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
        default:

      }
      setTimeout(() => {
        dispatch(notify(message));
        setTimeout(() => {
          dispatch(unregisterConfirmationAction(id));
        });
      });
      break;
    default:
  }
};

export default processConfirmation;
