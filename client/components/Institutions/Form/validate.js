// @flow

import {
  validateInstitutionName,
  extractErrorsFromCheckers,
} from "utility";

const checkers = {
  name: validateInstitutionName,
};

export const validate = extractErrorsFromCheckers(checkers);
