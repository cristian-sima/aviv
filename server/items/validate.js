// @flow

import type { CheckerResponse } from "../types";

import {
  validateItemName,
  validateRegisterNumber,
} from "../../client/common/validate";

import { extractErrorsFromCheckers } from "../utility";

export const isValidItem = (data : any) : CheckerResponse => extractErrorsFromCheckers({
  name: validateItemName,
}, data);

export const isValidAdvice = (data : any) : CheckerResponse => extractErrorsFromCheckers({
  registerNumber: validateRegisterNumber,
}, data);
