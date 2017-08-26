// @flow

import type { Dispatch, State } from "types";

type AddUserPropTypes = {
  institutionID: string;
  emit: (name : string, msg : any) => void;
  emitAddItem: (item : any) => void;
};

import { connect } from "react-redux";
import { reduxForm, startSubmit, reset } from "redux-form/immutable";
import * as Immutable from "immutable";
import React from "react";

import Form, { validate } from "./Form";

import {
  notify,
  addUser as addUserAction,
} from "actions";

import { getCurrentInstitutionID } from "reducers";

import { ITEM_FORM } from "utility/forms";

const
  mapStateToProps = (state : State) => ({
    institutionID: getCurrentInstitutionID(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { emit }) => ({
    addUserLocally (item : any) {
      dispatch(addUserAction(item));
      dispatch(notify("Contul a fost adăugat"));
      dispatch(reset(ITEM_FORM));
    },
    emitAddItem (data) {
      dispatch(startSubmit(ITEM_FORM));
      setTimeout(() => {
        emit("ADD_ITEM", data);
      });
    },
  });

const AddForm = reduxForm({
  buttonLabel : "Adaugă",
  form        : ITEM_FORM,
  title       : "Inițiază act normativ",
  validate,
})(Form);

class AddUser extends React.Component {

  props: AddUserPropTypes;

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

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
