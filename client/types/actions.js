// @flow

import type { ModalActions } from "./modal";

export type Action =
  { type: 'SHOW_CAPTCHA'; payload: { id: string ; name : string }; }
| { type: 'HIDE_CAPTCHA'; payload: string; }
| { type: 'ACCOUNT_CONNECTED'; payload: any; }
| { type: 'CHANGE_PASSWORD'; }
| { type: 'CANCEL_SIGN_OFF'; }
| { type: 'SIGN_OFF'; payload: any; }
| { type: 'RESET_PASSWORD'; payload: any; meta: { id : string }}

| { type: 'RECONNECT'; payload: any; }
| { type: 'CONFIRM_SIGN_OFF'; }
| { type: 'CONNECTING_LIVE'; }
| { type: 'CONNECTED_LIVE'; }


| { type: 'FETCH_USERS'; payload: any; }
| ModalActions
