// @flow

import {
  validateUserName,
  validateFullName,
  validateEmail,
  validatePhone,
  extractErrorsFromCheckers,
} from "utility";

const checkers = {
  name     : validateFullName,
  username : validateUserName,
  email    : validateEmail,
  phone    : validatePhone,
};

export const validate = extractErrorsFromCheckers(checkers);
