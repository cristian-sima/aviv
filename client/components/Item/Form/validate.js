// @flow

import {
  validateItemName,
  extractErrorsFromCheckers,
} from "utility";

const checkers = {
  name: validateItemName,
};

export const validate = extractErrorsFromCheckers(checkers);
