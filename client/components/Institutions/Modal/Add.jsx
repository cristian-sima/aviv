// @flow

type ModalWrapPropTypes = {
  cbAfter?: (institution: any) => void;
};

import React from "react";
import SimpleModal from "../../Modal/SimpleModal";

import Form from "../AddContainer";

const ModalWrap = ({ cbAfter } : ModalWrapPropTypes) => (
  <SimpleModal title="Adaugă instituție">
    <Form cbAfter={cbAfter} />
  </SimpleModal>
);

export default ModalWrap;
