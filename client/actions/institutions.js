// @flow

import type { Action } from "types";

import {
  fetchInstitutions as fetchInstitutionsRequest,
} from "../request";

export const fetchInstitutions = () : Action => ({
  type    : "FETCH_INSTITUTIONS",
  payload : fetchInstitutionsRequest(),
});

export const addInstitution = (institution : any) : Action => ({
  type    : "ADD_INSTITUTION",
  payload : institution,
});

export const modifyInstitution = (institution : any) : Action => ({
  type    : "MODIFY_INSTITUTION",
  payload : institution,
});

export const deleteInstitution = (id : string) : Action => ({
  type    : "DELETE_INSTITUTION",
  payload : id,
});
