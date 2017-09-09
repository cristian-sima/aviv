// @flow

type ModalWrapPropTypes = {
  id: number;

  cbAfter?: (user: any) => void;
};

import React from "react";
import SimpleModal from "../../Modal/SimpleModal";

import Form from "../ModifyContainer";

const ModalWrap = ({ cbAfter, id } : ModalWrapPropTypes) => (
  <SimpleModal size="lg" title={"Modifică datele"}>
    <Form
      cbAfter={cbAfter}
      id={id}
    />
  </SimpleModal>
);

export default ModalWrap;
