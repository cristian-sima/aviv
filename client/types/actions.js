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

| { type: "END_CONFIRMATION_FAILED"; payload: string }
| { type: "END_SUCCESS_FAILED" }
| { type: "REGISTER_CONFIRMATION"; payload: string }
| { type: "UNREGISTER_CONFIRMATION"; payload: string }


| { type: 'FETCH_INSTITUTIONS'; payload: any; }
| { type: 'ADD_INSTITUTION'; payload: any; }
| { type: 'MODIFY_INSTITUTION'; payload: any; }
| { type: 'DELETE_INSTITUTION'; payload: string; }

| { type: 'ADD_USER'; payload: any; }
| { type: 'MODIFY_USER'; payload: any; }
| { type: 'DELETE_USER'; payload: string; }

| { type: 'FETCH_ITEM_DETAILS', payload: any; meta : { id : string } }

| { type: 'FETCH_ITEMS_TO_ADVICE', payload: any; }
| { type: 'MODIFY_FROM_TO_ADVICE_ITEMS', payload: number; }

| { type: 'FETCH_ITEMS_STARTED', payload: any; }
| { type: 'MODIFY_FROM_STARTED_ITEMS', payload: number; }

| { type: 'FETCH_ITEMS_CLOSED', payload: any; }
| { type: 'MODIFY_FROM_CLOSED_ITEMS', payload: number; }

| { type: 'FETCH_ITEMS_ADVICED', payload: any; }
| { type: 'MODIFY_FROM_ADVICED_ITEMS', payload: number; }

| { type: 'DELETE_NOTIFICATION', payload: number }

| { type: 'FETCH_SUGGESTIONS', payload: any; }
| { type: 'CHANGE_SUGGESTIONS_CURRENT_TERM', payload: string; }

| ModalActions
