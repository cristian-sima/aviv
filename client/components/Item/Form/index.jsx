// @flow

type FormPropTypes = {
  buttonLabel: string;
  error?: string;
  pristine: boolean;
  submitting: boolean;
  title: string;
  advicers: any;
  institutionID: string;

  handleRegisterRef?: (node: any) => void;
  handleSubmit: (formData : any) => Promise<*>;
};

type FormStateTypes = {
  showAuthors: boolean;
};

import { Field, FieldArray } from "redux-form/immutable";
import React from "react";
import { Collapse } from "reactstrap";

import FocusTextarea from "../../Inputs/FocusTextarea";

import AuthorsArray from "./Authors";
import AdvicersArray from "./Advicers";

export { validate } from "./validate";

class Form extends React.Component {

  props: FormPropTypes;
  state: FormStateTypes;

  field: any;

  focusNameInput: () => void;
  toggleAuthors: () => void;
  handleSubmitForm: (data : any) => void;
  handleRegisterRef: (node : any) => void;

  constructor (props : FormPropTypes) {
    super(props);

    this.state = {
      showAuthors: false,
    };

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

    this.toggleAuthors = () => this.setState({
      showAuthors: !this.state.showAuthors,
    });
  }

  componentDidMount () {
    setTimeout(() => {
      const { field } = this;

      if (field !== null && typeof field !== "undefined") {
        field.focus();
      }
    });
  }

  render () {
    const {
      buttonLabel,
      error,
      pristine,
      title,
      submitting,
      institutionID,
    } = this.props;

    const { showAuthors } = this.state;

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
      <div className="container">
        <form autoComplete="off" onSubmit={this.handleSubmitForm}>
          <div className="text-center">
            <h2>{title}</h2>
          </div>
          {error && errMessage}
          <div className="text-right">
            <button
              className="btn btn-link"
              onClick={this.toggleAuthors}
              type="button">
              {
                showAuthors ? "Ascunde coinițiatori" : "Afișează coinițiatori"
              }
            </button>
          </div>
          <Collapse isOpen={showAuthors}>
            <FieldArray
              component={AuthorsArray}
              institutionID={institutionID}
              name="authors"
            />
          </Collapse>
          <Field
            component={FocusTextarea}
            label="Titlu"
            left="col-md-2 col-xl-4"
            name="name"
            onRegisterRef={this.handleRegisterRef}
            right="col-md-10 col-xl-8"
            rows={6}
            withRef
          />
          <FieldArray
            component={AdvicersArray}
            name="advicers"
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
      </div>
    );
  }
}

export default Form;
