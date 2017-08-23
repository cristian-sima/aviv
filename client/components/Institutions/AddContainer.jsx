// @flow

import type { Dispatch } from "types";

type AddInstitutionPropTypes = {
  showVat: boolean;
  addInstitutionLocally: (institution : any) => void;
};

import { connect } from "react-redux";
import { SubmissionError, reduxForm, reset } from "redux-form/immutable";
import * as Immutable from "immutable";
import React from "react";

import Form, { validate } from "./Form";

import {
  notify,
  addInstitution as addInstitutionAction,
} from "actions";

import { addInstitution as addInstitutionRequest } from "request";

import { INSTITUTION_FORM } from "utility/forms";

const
  mapDispatchToProps = (dispatch : Dispatch) => ({
    addInstitutionLocally (institution : any) {
      dispatch(addInstitutionAction(institution));
      dispatch(notify("Instituția a fost adăugată"));
      dispatch(reset(INSTITUTION_FORM));
    },
  });

const AddForm = reduxForm({
  buttonLabel : "Adaugă",
  title       : "Adaugă articol",
  form        : INSTITUTION_FORM,
  validate,
})(Form);

class AddInstitution extends React.Component {

  props: AddInstitutionPropTypes;

  handleSubmit: (formData : any) => Promise<*>;

  constructor () {
    super();

    this.handleSubmit = (formData : any) => {

      const { addInstitutionLocally } = this.props;

      return addInstitutionRequest(formData.toJS()).
        then((response) => {
          if (response.Error === "") {
            addInstitutionLocally(Immutable.Map(response.Institution));
          } else {
            throw new SubmissionError({
              _error: response.Error,
            });
          }
        }).
        catch((error) => {
          if (error) {
            if (error instanceof SubmissionError) {
              throw error;
            }

            throw new SubmissionError({
              _error: "Am pierdut conexiunea cu server-ul",
            });
          }
        });
    };
  }

  render () {
    const { showVat } = this.props;

    return (
      <AddForm
        onSubmit={this.handleSubmit}
        showVat={showVat}
      />
    );
  }
}

export default connect(null, mapDispatchToProps)(AddInstitution);
