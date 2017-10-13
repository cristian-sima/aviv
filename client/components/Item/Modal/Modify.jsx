// @flow

import type { Emit } from "types";

type ModalWrapPropTypes = {
  id: number;

  emit: Emit;
  cbAfter?: (user: any) => void;
};

import React from "react";
import SimpleModal from "../../Modal/SimpleModal";

import Form from "../ModifyContainer";

const ModalWrap = ({ cbAfter, id, emit } : ModalWrapPropTypes) => (
  <SimpleModal size="lg" title="Modifică datele" >
    <Form
      cbAfter={cbAfter}
      emit={emit}
      id={id}
    />
  </SimpleModal>
);

export default ModalWrap;
