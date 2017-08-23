// @flow

import type { Action } from "types";

export const createModal = (modalType : string, modalProps? : any) : Action => ({
  type    : "SHOW_MODAL",
  payload : {
    modalType,
    modalProps,
  },
});

export const hideModal = () : Action => ({
  type: "HIDE_MODAL",
});

export const showLostPasswordModal = () : Action => (
  createModal("LOST_PASSWORD")
);


export const showAddInstitutionFormModal = () : Action => (
  createModal("ADD_INSTITUTION")
);


export const modifyInstitutionModal = ({ id, cbAfter } : {
  id: string,
  cbAfter? : (institution : any) => void,
}) : Action => (
  createModal("MODIFY_INSTITUTION", {
    id,
    cbAfter,
  })
);

export const deleteInstitutionModal = (id : string) : Action => (
  createModal("DELETE_INSTITUTION", {
    id,
  })
);
