// @flow

import {
  validateItemName,
  extractErrorsFromCheckers,
} from "utility";

const checkers = {
  name: validateItemName,
};

const validate = extractErrorsFromCheckers(checkers);

export default validate;
