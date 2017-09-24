// @flow

type FormPropTypes = {
  buttonLabel: string;
  error?: string;
  pristine: boolean;
  submitting: boolean;

  handleRegisterRef?: (node: any) => void;
  handleSubmit: (formData : any) => Promise<*>;
};

import { Field } from "redux-form/immutable";
import React from "react";

import FocusTemplate from "../../Inputs/FocusTemplate";
import InputTemplate from "../../Inputs/InputTemplate";

export { validate } from "./validate";

import { toUpper, toLower, toTitle } from "utility";

class Form extends React.Component<FormPropTypes> {

  props: FormPropTypes;

  field: any;

  focusNameInput: () => void;
  handleSubmitForm: (data : any) => void;
  handleRegisterRef: (node : any) => void;

  constructor (props : FormPropTypes) {
    super(props);

    this.handleSubmitForm = (data : any) => {
      const { handleSubmit } = this.props;

      const result = handleSubmit(data);

      if (typeof result.then !== "undefined") {
        result.then(() => {
          this.focusNameInput();
        });
      }
    };

    this.handleRegisterRef = (node : any) => {
      this.field = node;
    };

    this.focusNameInput = () => {
      setTimeout(() => {
        const { field } = this;

        if (field && field !== null) {
          field.focus();
        }
      });
    };
  }

  componentDidMount () {
    setTimeout(() => {
      if (typeof this.field !== "undefined") {
        this.field.focus();
      }
    });
  }

  render () {
    const {
      buttonLabel,
      error,
      pristine,
      submitting,
    } = this.props;

    const errMessage = (
      <div className="alert alert-danger">
        {error}
      </div>
    );

    const getButtonContent = () => {
      if (submitting) {
        return (
          <span>
            <i className="fa fa-refresh fa-spin fa-fw" />
            {" Așteaptă"}
          </span>
        );
      }

      return buttonLabel;
    };

    return (
      <form autoComplete="off" onSubmit={this.handleSubmitForm}>
        {error && errMessage}
        <Field
          component={FocusTemplate}
          label="Nume și prenume"
          name="name"
          normalize={toTitle}
          onRegisterRef={this.handleRegisterRef}
          placeholder="ex. Popescu Ion"
          withRef
        />
        <Field
          component={InputTemplate}
          label="Utilizator"
          name="username"
          normalize={toUpper}
          placeholder="ex. MAI01"
        />
        <hr />
        <Field
          component={InputTemplate}
          label="Email"
          name="email"
          normalize={toLower}
          placeholder="ex. popescu_ion@mai.ro"
        />
        <Field
          component={InputTemplate}
          label="Telefon"
          name="phone"
          placeholder="ex. 025.2585.777"
        />
        <div className="text-center">
          <button
            aria-label={buttonLabel}
            className="btn btn-primary"
            disabled={pristine || submitting}
            type="submit">
            {getButtonContent()}
          </button>
        </div>
      </form>
    );
  }
}

export default Form;
