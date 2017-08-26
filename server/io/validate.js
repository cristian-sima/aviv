// @flow

import type { CheckerResponse } from "../types";

import {
  validateItemName,
} from "../../client/common/validate";

import { extractErrorsFromCheckers } from "../utility";

export const isValidItem = (data : any) : CheckerResponse => extractErrorsFromCheckers({
  name: validateItemName,
}, data);
