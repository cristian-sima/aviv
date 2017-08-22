// @flow

import type { Dispatch } from "types";

type LostPasswordPropTypes = {
  data: any;
  account: any;
  closeModal: () => void;
};

import React from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import { hideModal } from "actions";

const
  mapDispatchToProps = (dispatch : Dispatch) => ({
    closeModal () {
      dispatch(hideModal());
    },
  });

const LostPassword = ({ closeModal } : LostPasswordPropTypes) => (
  <Modal isOpen toggle={closeModal} zIndex="1061">
    <ModalHeader toggle={closeModal}>
      {"Am pierdut parola"}
    </ModalHeader>
    <ModalBody>
      <div>
        {"În cazul în care nu îți mai poți aminti parola, te rugăm să contactezi:"}
        <div className="mt-4 bd-example">
          <address>
            <strong>{"Departamentul pentru Tehnologia Informației"}</strong>
            <br />
            {"Secretariatul General al Guvernului"}
            <br />
            {"Guvernul României"}
            <br />
            <br />
            {"Telefon: "}<abbr title="Phone">{"314.34.00"}</abbr>
            <br />
            <a href="mailto:#">{"website@gov.ro"}</a>
          </address>
        </div>
      </div>
    </ModalBody>
  </Modal>
);

export default connect(null, mapDispatchToProps)(LostPassword);
