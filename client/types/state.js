// @flow

import type { ErrorType } from "./";

export type ModalState = any;

export type AuthState = {
  +captchas: any;

  +isConnected : bool;
  +account : any;

  +isSigningOff : bool;
  +signOffError : ErrorType;
  +confirmSignOff : bool;

  +isReconnecting : bool;
  +reconnectError : ErrorType;

  +connectingLive: bool;

  +showButtons: bool;
}

export type UsersState = {
  +fetched : bool;
  +fetching : bool;
  +errorFetching : ErrorType;

  +isUpdating : bool;
  +errorUpdate : ErrorType;

  +data: any;
}

export type InstitutionsState = {
  +fetched : bool;
  +fetching : bool;
  +errorFetching : ErrorType;

  +data: any;
}

export type ItemsByIDState = any;

export type ItemsToAdviceState = {
  +IDs: any;
  +error: string;
  +fetched: bool;
  +fetching: bool;

  +lastFetchedNumber: number;
  +total: number;
};

type ItemsState = {
  +byID: ItemsByIDState;
  +toAdvice: ItemsToAdviceState;
}

export type State = {
  +auth: AuthState;
  +modal : ModalState;
  +notifications: any;
  +institutions: InstitutionsState;
  +users: UsersState;
  +items: ItemsState;
};
