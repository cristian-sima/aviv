// @flow

type ModalWrapPropTypes = {
  id: number;

  cbAfter?: (institution: any) => void;
};

import React from "react";
import SimpleModal from "../../Modal/SimpleModal";

import Form from "../ModifyContainer";

const ModalWrap = ({ cbAfter, id } : ModalWrapPropTypes) => (
  <SimpleModal title="Modifică instituția">
    <Form
      cbAfter={cbAfter}
      id={id}
    />
  </SimpleModal>
);

export default ModalWrap;
