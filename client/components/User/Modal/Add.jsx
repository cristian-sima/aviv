// @flow

type ModalWrapPropTypes = {
  institutionID: string;
  cbAfter?: (user: any) => void;
};

import React from "react";
import SimpleModal from "../../Modal/SimpleModal";

import Form from "../AddContainer";

const ModalWrap = ({ cbAfter, institutionID } : ModalWrapPropTypes) => (
  <SimpleModal title="Cont nou">
    <Form cbAfter={cbAfter} institutionID={institutionID} />
  </SimpleModal>
);

export default ModalWrap;
