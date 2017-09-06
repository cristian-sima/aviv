// @flow

import {
  validateRegisterNumber,
  extractErrorsFromCheckers,
} from "utility";

const checkers = {
  registerNumber: validateRegisterNumber,
};

const validate = extractErrorsFromCheckers(checkers);

export default validate;
