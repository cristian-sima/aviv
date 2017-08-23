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

export { validate } from "./validate";


class Form extends React.Component {

  props: FormPropTypes;

  nameField: any;

  handleSubmitForm: () => void;
  focusNameInput: () => void;
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
      this.nameField = node;
    };

    this.focusNameInput = () => {
      setTimeout(() => {
        const { nameField } = this;

        if (nameField && nameField !== null) {
          nameField.focus();
        }
      });
    };
  }

  componentDidMount () {
    setTimeout(() => {
      if (typeof this.nameField !== "undefined") {
        this.nameField.focus();
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

    return (
      <form autoComplete="off" onSubmit={this.handleSubmitForm}>
        {
          error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )
        }
        <Field
          component={FocusTemplate}
          label="Denumire"
          name="name"
          onRegisterRef={this.handleRegisterRef}
          placeholder="ex. Ministerul de Interne"
          type="text"
          withRef
        />
        <div className="text-center">
          <button
            aria-label={buttonLabel}
            className="btn btn-primary"
            disabled={pristine || submitting}
            type="submit">
            {
              submitting ? (
                <span>
                  <i className="fa fa-refresh fa-spin fa-fw" />
                  {" Așteaptă"}
                </span>
              ) : buttonLabel
            }
          </button>
        </div>
      </form>
    );
  }
}

export default Form;
