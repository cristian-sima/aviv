// @flow

import type { Dispatch } from "types";

type AdviceItemFormContainerPropTypes = {
  emit: (name : string, msg : any) => void;
  emitAddItem: (item : any) => void;
};

import { connect } from "react-redux";
import { reduxForm, startSubmit } from "redux-form/immutable";
import React from "react";

import Form from "./Form";

import validate from "./validate";

import { ADVICE_ITEM } from "utility/forms";

const
  mapDispatchToProps = (dispatch : Dispatch, { emit }) => ({
    emitAddItem (data) {
      dispatch(startSubmit(ADVICE_ITEM));
      setTimeout(() => {
        emit("ADD_ITEM", data);
      });
    },
  });

const AddForm = reduxForm({
  form: ADVICE_ITEM,
  validate,
})(Form);

class AdviceItemFormContainer extends React.Component {

  props: AdviceItemFormContainerPropTypes;

  handleSubmit: (formData : any) => any;

  constructor () {
    super();

    this.handleSubmit = (formData : any) => {
      const { emitAddItem } = this.props;

      emitAddItem(formData.toJS());
    };
  }

  render () {
    return (
      <AddForm
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default connect(null, mapDispatchToProps)(AdviceItemFormContainer);
