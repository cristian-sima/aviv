// @flow

import type { CheckerResponse } from "../types";

import {
  validateFullName,
  validateUserName,
  validateEmail,
  validatePhone,
} from "../validate";

import { extractErrorsFromCheckers } from "../utility";

export const isValidUser = (data : any) : CheckerResponse => extractErrorsFromCheckers({
  name     : validateFullName,
  username : validateUserName,
  email    : validateEmail,
  phone    : validatePhone,
}, data);
