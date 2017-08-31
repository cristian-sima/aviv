// @flow

type Msg = {
  status: string;
  form: string;
  error: string;
  message: string;
};

import { stopSubmit, reset } from "redux-form/immutable";

import {
  notify,
} from "actions";

const processForm = (dispatch : any, { status, form, error, message } : Msg) => {
  switch (status) {
    case "FAILED":
      dispatch(
        stopSubmit(form, {
          "_error": error,
        })
      );
      break;
    case "SUCCESS":
      setTimeout(() => {
        dispatch(notify(message));
        setTimeout(() => {
          dispatch(reset(form));
          setTimeout(() => {
            dispatch(stopSubmit(form));
          });
        });
      });
      break;
    default:
  }
};

export default processForm;
