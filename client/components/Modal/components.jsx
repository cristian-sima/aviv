// @flow

import type { ModalActionType } from "types";

import React from "react";

import LostPassword from "../Login/Modal/LostPassword";

const getComponent = (type : ModalActionType) : any => {
  switch (type) {

    case "LOST_PASSWORD":
      return LostPassword;

    default:
      return (
        <div>
          {`Please define a modal component for the type [${type}] in Modal/components.jsx`}
        </div>
      );
  }
};

export default getComponent;
