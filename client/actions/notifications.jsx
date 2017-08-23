// @flow

import type { Action } from "types";

import Notifications from "react-notification-system-redux";

const createNotification = (level : string) => (title : any, options : any) : Action => (
  Notifications.show({
    title,
    position    : "tr",
    autoDismiss : 3,
    ...options,
  }, level)
);

export const notify = createNotification("success");
export const notifyWarning = createNotification("warning");
export const notifyError = createNotification("error");

export const deleteNotification = (position : number) : Action => ({
  type    : "DELETE_NOTIFICATION",
  payload : position,
});
