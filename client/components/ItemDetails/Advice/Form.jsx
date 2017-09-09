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

import { Field } from "redux-form/immutable";
import React from "react";

import LabelTemplate from "./LabelTemplate";
import { toUpper } from "utility";
import InputTemplate from "../../Inputs/InputTemplate";

const Form = (props : FormPropTypes) => {
  const {
    buttonLabel,
    error,
    pristine,
    submitting,
    handleSubmit,
  } = props;

  const errMessage = (
    <div className="alert alert-danger">
      {error}
    </div>
  );

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <div className="container">
        {error && errMessage}
        <Field
          component={InputTemplate}
          label="Nr. aviz"
          name="registerNumber"
          normalize={toUpper}
          placeholder="ex. 25/MB/1650"
          right="col-md-8"
          type="text"
        />
        <div className="row">
          <div className="col-sm-8 col-md-6 col-lg-4 col-xl-6 offset-md-2">
            <Field
              component={LabelTemplate}
              htmlFor="advice-form-response-1"
              label="Favorabil, fără observații"
              name="response"
              type="radio"
              value="0"
            />
            <Field
              component={LabelTemplate}
              htmlFor="advice-form-response-2"
              label="Favorabil, cu observații și propuneri"
              name="response"
              type="radio"
              value="1"
            />
            <Field
              component={LabelTemplate}
              htmlFor="advice-form-response-3"
              label="Negativ"
              name="response"
              type="radio"
              value="2"
            />
          </div>
          <div className="col-sm-2 mt-4 text-center text-md-left">
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
                ) : "Trimite aviz"
              }
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;
