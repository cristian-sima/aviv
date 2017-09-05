// @flow

import type { Emit } from "types";

import React from "react";
import moment from "moment";
import { Collapse } from "reactstrap";

import AdviceResponse from "./AdviceResponse";

type AdvicerSectionStateTypes = {
  isOpen: boolean;
};

type AdvicerSectionPropTypes = {
  isAdviced: boolean;
  advice: any;
  id: string;

  emit: Emit;
};

import FormContainer from "./Advice/FormContainer";

class AdvicerSection extends React.Component {
  props: AdvicerSectionPropTypes;
  state: AdvicerSectionStateTypes;

  toggle: () => void;

  constructor (props : AdvicerSectionPropTypes) {
    super(props);

    this.state = {
      isOpen: !props.isAdviced,
    };

    this.toggle = () => this.setState({
      isOpen: !this.state.isOpen,
    });
  }


  componentWillReceiveProps (nextProps : AdvicerSectionPropTypes) {
    const shouldClose = this.state.isOpen && nextProps.isAdviced;
    if (shouldClose) {
      this.setState({
        isOpen: false,
      });
    }
  }

  shouldComponentUpdate (
    nextProps : AdvicerSectionPropTypes,
    nextState : AdvicerSectionStateTypes
  ) {
    return (
      this.props.advice !== nextProps.advice ||
      this.props.id !== nextProps.id ||
      this.props.isAdviced !== nextProps.isAdviced ||

      this.state.isOpen !== nextState.isOpen
    );
  }

  render () {
    const { emit, id, isAdviced, advice } = this.props;

    const showForm = !isAdviced || typeof advice === "undefined" || advice === null;

    return (
      <div className="my-4">
        {
          showForm ? (
            <h4 className="card-title">
              {"Te rugăm să avizezi acest act normativ"}
            </h4>
          ) : (
            <div>
              <span className="fancy-text-sm">
                <i className="fa fa-check mr-1" />
                {"Ai avizat "}
                <AdviceResponse
                  value={advice.get("response")}
                />
                {" la "}
                { moment(advice.get("date")).format("lll") }
              </span>
              <button
                className="btn-link ml-1"
                onClick={this.toggle}
                type="button">
                {"Modifică avizul"}
              </button>
            </div>
          )
        }
        <Collapse isOpen={!isAdviced || this.state.isOpen}>
          <div className="card my-4">
            <div className="card-body">
              <div className="card-text">
                <FormContainer
                  emit={emit}
                  id={id}
                />
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

export default AdvicerSection;
