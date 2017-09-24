// @flow

import type { Dispatch, State } from "types";

type AddItemContainerPropTypes = {
  institutionID: string;
  emit: (name : string, msg : any) => void;
  emitAddItem: (item : any) => void;
};

import { connect } from "react-redux";
import { reduxForm, startSubmit } from "redux-form/immutable";
import * as Immutable from "immutable";
import React from "react";

import Form, { validate } from "./Form";

import { getCurrentInstitutionID } from "reducers";

import { ITEM_ADD_FORM } from "utility/forms";

const
  mapStateToProps = (state : State) => ({
    institutionID: getCurrentInstitutionID(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { emit }) => ({
    emitAddItem (data) {
      dispatch(startSubmit(ITEM_ADD_FORM));
      setTimeout(() => {
        emit("ADD_ITEM", data);
      });
    },
  });

const AddForm = reduxForm({
  buttonLabel      : "Adaugă",
  form             : ITEM_ADD_FORM,
  destroyOnUnmount : false,
  title            : "Inițiază act normativ",
  validate,
})(Form);

class AddItemContainer extends React.Component<AddItemContainerPropTypes> {

  props: AddItemContainerPropTypes;

  handleSubmit: (formData : any) => any;

  constructor () {
    super();

    this.handleSubmit = (formData : any) => {
      const { emitAddItem } = this.props;

      emitAddItem(formData.toJS());
    };
  }

  render () {
    const { institutionID } = this.props;

    const initialValues = Immutable.Map({
      "name"     : "",
      "advicers" : Immutable.List([]),
      "authors"  : Immutable.List([institutionID]),
    });

    return (
      <AddForm
        initialValues={initialValues}
        institutionID={institutionID}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddItemContainer);
