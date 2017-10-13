// @flow

type ModalWrapPropTypes = {
  institutionID: string;
};

import React from "react";
import SimpleModal from "../../Modal/SimpleModal";

import Form from "../AddContainer";

const ModalWrap = ({ institutionID } : ModalWrapPropTypes) => (
  <SimpleModal title="Cont nou">
    <Form institutionID={institutionID} />
  </SimpleModal>
);

export default ModalWrap;
