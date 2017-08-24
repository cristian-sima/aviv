// @flow

import type { User, CheckerResponse } from "../types";

import {
  validateFullName,
  validateUserName,
  validateEmail,
  validatePhone,
} from "../../client/common/validate";

import { extractErrorsFromCheckers } from "../utility";

export const isValidUser = (data : User) : CheckerResponse => extractErrorsFromCheckers({
  name     : validateFullName,
  username : validateUserName,
  email    : validateEmail,
  phone    : validatePhone,
}, data);
