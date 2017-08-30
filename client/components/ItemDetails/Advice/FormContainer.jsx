// @flow

import type { Dispatch, Emit } from "types";

type AdviceItemFormContainerPropTypes = {
  emit: (name : string, msg : any) => void;
  emitAdviceItem: (item : any) => void;
};

type DispatchPropTypes = {
  id: string;
  emit: Emit;
}

import { connect } from "react-redux";
import { reduxForm, startSubmit } from "redux-form/immutable";
import React from "react";

import Form from "./Form";

import { ADVICE_ITEM } from "utility/forms";

const
  mapDispatchToProps = (dispatch : Dispatch, { emit, id } : DispatchPropTypes) => ({
    emitAdviceItem (data) {
      dispatch(startSubmit(ADVICE_ITEM));
      setTimeout(() => {
        emit("ADVICE_ITEM", {
          ...data,
          id,
        });
      });
    },
  });

const AdviceFormContainer = reduxForm({
  form: ADVICE_ITEM,
})(Form);

class AdviceItemFormContainer extends React.Component {

  props: AdviceItemFormContainerPropTypes;

  handleSubmit: (formData : any) => any;

  constructor () {
    super();

    this.handleSubmit = (formData : any) => {
      const { emitAdviceItem } = this.props;

      emitAdviceItem(formData.toJS());
    };
  }

  render () {
    return (
      <AdviceFormContainer
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default connect(null, mapDispatchToProps)(AdviceItemFormContainer);
