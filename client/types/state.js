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

type Paginator = {
  +IDs: any;
  +error: string;
  +fetched: bool;
  +fetching: bool;

  +lastID: string;
  +lastDate: number;
  +total: number;
  +from: number;
  +negativeOffset: number;
}

export type ItemsToAdviceState = Paginator;
export type ItemsStartedState = Paginator;
export type ItemsAdvicedState = Paginator;

type ItemsState = {
  +byID: ItemsByIDState;
  +toAdvice: ItemsToAdviceState;
  +started: ItemsStartedState;
  +adviced: ItemsAdvicedState;
}

export type ConfirmationsState = any;

export type VersionsState = any;

export type SuggestionsState = {
  error : ErrorType;
  fetching : bool;

  term: string;

  map: any;
}

export type State = {
  +auth: AuthState;
  +modal : ModalState;
  +confirmations: ConfirmationsState;
  +notifications: any;
  +institutions: InstitutionsState;
  +users: UsersState;
  +items: ItemsState;
  +suggestions: SuggestionsState;
  +versions: VersionsState;
};
