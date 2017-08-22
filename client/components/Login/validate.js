// @flow

import {
  validateUserName,
  validatePassword,
  validateCaptchaSolution,
  extractErrorsFromCheckers,
} from "utility";

const
  checkers = {
    UserName        : validateUserName,
    Password        : validatePassword,
    CaptchaSolution : validateCaptchaSolution,
  };

const validate = extractErrorsFromCheckers(checkers);

export default validate;
