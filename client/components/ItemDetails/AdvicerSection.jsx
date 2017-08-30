// @flow

import type { Emit } from "types";

import React from "react";
import { Collapse } from "reactstrap";

type AdvicerSectionStateTypes = {
  isOpen: boolean;
};

type AdvicerSectionPropTypes = {
  isAdviced: boolean;
  emit: Emit;
  id: string;
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

  shouldComponentUpdate (
    nextProps : AdvicerSectionPropTypes,
    nextState : AdvicerSectionStateTypes
  ) {
    return (
      this.props.id !== nextProps.id ||
      this.props.isAdviced !== nextProps.isAdviced ||
      this.state.isOpen !== nextState.isOpen
    );
  }

  render () {
    const { emit, id, isAdviced } = this.props;

    return (
      <div className="my-4">
        {
          isAdviced ? (
            <span className="fancy-text-sm">
              <i className="fa fa-check mr-1" />
              {"Ai avizat acest act normativ" }
              <button
                className="btn-link ml-1"
                onClick={this.toggle}
                type="button">
                {"Modifică avizul"}
              </button>
            </span>
          ) : (
            <h4 className="card-title">
              {"Te rugăm să avizezi acest act normativ"}
            </h4>
          )
        }
        <Collapse isOpen={this.state.isOpen}>
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
