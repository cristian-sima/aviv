// @flow
/* eslint-disable handle-callback-err */
/* eslint-disable react/forbid-component-props, react/default-props-match-prop-types */

import type { Dispatch, State } from "types";

type onConfirmMethodsTypes = {
  endPerforming: (cb : any) => void;
};

type ConfirmPropTypes = {
  cancelButtonLabel: ?string;
  confirmButtonLabel: ?string;
  message: any;
  errMessage: string;
  focusButton: boolean;
  title?: string;
  confirmButtonColor?: "primary" | "secondary" | "danger" | "success" | "link" | "info" | "warning";
  isPerforming: boolean,

  onConfirm: (methods : onConfirmMethodsTypes) => () => void;
  action: () => void;
  closeModal: () => void;
  registerConfirmation: () => void;
  isResponseValid: (response : any) => {
    valid: boolean;
    error: string;
  };
};

import React from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

import {
  hideModal,
  registerConfirmation as registerConfirmationAction,
} from "actions";

import { getIsConfirming } from "reducers";

const
  mapStateToProps = (state : State, { id }) => ({
    isPerforming: getIsConfirming(state, id),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { id }) => ({
    closeModal () {
      dispatch(hideModal());
    },
    registerConfirmation () {
      dispatch(registerConfirmationAction(id));
    },
  });

class Confirm extends React.Component<ConfirmPropTypes> {

  /* eslint-disable max-statements */

  static defaultProps = {
    title              : "Confirmare",
    cancelButtonLabel  : "Renunță",
    confirmButtonColor : "danger",
    confirmButtonLabel : "Șterge",
    focusButton        : true,

    isResponseValid: (response : any) => ({
      valid : response.Error === "",
      error : response,
    }),
  }

  props: ConfirmPropTypes;

  field: any;

  handleConfirmation: () => void;
  handleConfirmButton: (node : any) => void;
  focusConfirmButton: () => number;

  constructor (props : ConfirmPropTypes) {

    super(props);

    this.handleConfirmButton = (node : any) => {
      this.field = node;
    };

    this.focusConfirmButton = () => setTimeout(() => {
      const { focusButton } = this.props;

      if (focusButton) {
        setTimeout(() => {
          const { field } = this;

          if (field && field !== null) {
            field.focus();
          }
        });
      }
    });

    this.handleConfirmation = () => {
      const { registerConfirmation, action } = this.props;

      registerConfirmation();

      setTimeout(() => {
        action();
      });
    };
  }

  componentDidMount () {
    this.focusConfirmButton();
  }

  shouldComponentUpdate (nextProps : ConfirmPropTypes) {
    return (
      this.props.isPerforming !== nextProps.isPerforming ||
      this.props.cancelButtonLabel !== nextProps.cancelButtonLabel ||
      this.props.confirmButtonLabel !== nextProps.confirmButtonLabel ||
      this.props.focusButton !== nextProps.focusButton ||
      this.props.title !== nextProps.title ||
      this.props.confirmButtonColor !== nextProps.confirmButtonColor
    );
  }

  render () {

    const {
      isPerforming,
      cancelButtonLabel,
      confirmButtonLabel,
      message,
      title,
      confirmButtonColor,
      closeModal,
    } = this.props;

    return (
      <Modal isOpen toggle={closeModal} zIndex="1061">
        <ModalHeader toggle={closeModal}>
          {title}
        </ModalHeader>
        <ModalBody>
          {message}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeModal}>
            {cancelButtonLabel}
          </Button>
          {" "}
          <button
            className={`btn ${confirmButtonColor ? `btn-${confirmButtonColor}` : ""}`}
            disabled={isPerforming}
            onClick={this.handleConfirmation}
            ref={this.handleConfirmButton}
            type="button">
            {
              isPerforming ? (
                <span>
                  <i className="fa fa-refresh fa-spin fa-fw" />
                  {" Așteaptă"}
                </span>
              ) : confirmButtonLabel
            }
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);
