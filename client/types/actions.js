// @flow

import type { ModalActions } from "./modal";

export type Action =
  { type: 'SHOW_CAPTCHA'; payload: { id: string ; name : string }; }
| { type: 'HIDE_CAPTCHA'; payload: string; }
| { type: 'ACCOUNT_CONNECTED'; payload: any; }
| { type: 'CHANGE_PASSWORD'; }
| { type: 'CANCEL_SIGN_OFF'; }
| { type: 'SIGN_OFF'; payload: any; }
| { type: 'RESET_PASSWORD'; payload: { id: string; temporaryPassword: string; }}

| { type: 'RECONNECT'; payload: any; }
| { type: 'CONFIRM_SIGN_OFF'; }
| { type: 'CONNECTING_LIVE'; }
| { type: 'RECONNECTING_LIVE'; }
| { type: 'CONNECTED_LIVE'; }


| { type: 'FETCH_INSTITUTIONS'; payload: any; }
| { type: 'ADD_INSTITUTION'; payload: any; }
| { type: 'MODIFY_INSTITUTION'; payload: any; }
| { type: 'DELETE_INSTITUTION'; payload: string; }

| { type: 'ADD_USER'; payload: any; }
| { type: 'MODIFY_USER'; payload: any; }
| { type: 'DELETE_USER'; payload: string; }

| { type: 'FETCH_ITEMS_TO_ADVICE', payload: any; }
| { type: 'FETCH_ITEMS_STARTED', payload: any; }
| { type: 'FETCH_ITEM_DETAILS', payload: any; meta : { id : string } }

| { type: 'DELETE_NOTIFICATION', payload: number }
| ModalActions
