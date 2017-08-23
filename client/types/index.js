/* eslint-disable no-use-before-define */
// @flow

import type { State } from "./state";
import type { Action } from "./actions";

export type ErrorType = string;

export type Resolve = (data : any) => void;
export type Reject = (arg : { error : string }) => void;

export type Emit = (name : string, data? : any) => void;

export type Response = {
  body: any;
};

export type Notification = {
  key: number;
};

export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
export type GetState = () => State;
export type PromiseAction = Promise<Action>;

export * from "./actions";
export * from "./modal";
export * from "./state";
