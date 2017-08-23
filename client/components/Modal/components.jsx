// @flow

import type { ModalActionType } from "types";

import React from "react";

import LostPassword from "../Login/Modal/LostPassword";
import AddInstitution from "../Institutions/Modal/Add";
import ModifyInstitution from "../Institutions/Modal/Modify";
import DeleteInstitution from "../Institutions/Modal/Delete";

const getComponent = (type : ModalActionType) : any => {
  switch (type) {

    case "LOST_PASSWORD":
      return LostPassword;

    case "ADD_INSTITUTION":
      return AddInstitution;

    case "MODIFY_INSTITUTION":
      return ModifyInstitution;

    case "DELETE_INSTITUTION":
      return DeleteInstitution;

    default:
      return (
        <div>
          {`Please define a modal component for the type [${type}] in Modal/components.jsx`}
        </div>
      );
  }
};

export default getComponent;
