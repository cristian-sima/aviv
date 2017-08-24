// @flow

import type { Dispatch, State } from "types";

type FormPropTypes = {
  error? : string;
  CaptchaID?: string;
  pristine : boolean;
  submitting : boolean;
  isConnected: boolean;
  location: string;

  handleSubmit: (onSubmit : (formData : any) => Promise<*>) => void;
  showCaptcha: (newCaptcha : string) => void;
  showLostPasswordModal: () => void;
  hideCaptcha: () => void;
  startFormSubmit: () => void;
  stopFormSubmit: (errors : any) => void;
  connectAccount: (account : any) => void;
}

import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Field, reduxForm, SubmissionError,
  change as changeAction,
  startSubmit as startFormSubmitAction,
  stopSubmit as stopFormSubmitAction,
} from "redux-form/immutable";
import React from "react";

import Captcha from "../Inputs/Captcha";
import FocusTemplate from "../Inputs/FocusTemplate";

import { toUpper } from "utility";

import { getAuthCaptcha, getIsAccountConnected } from "reducers";

import validate from "./validate";

import {
  hideCaptcha as hideCaptchaAction,
  showCaptcha as showCaptchaAction,
  connectAccount as connectAccountAction,
  showLostPasswordModal as showLostPasswordModalAction,
} from "actions";

import { performLogin as performLoginRequest } from "request";

const captchaName = "login";

const formID = "AUTH_LOGIN_FORM";

const
  mapStateToProps = (state : State) => ({
    CaptchaID   : getAuthCaptcha(state, captchaName),
    isConnected : getIsAccountConnected(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    showCaptcha: (newCaptcha : string) => {
      dispatch(changeAction(formID, "CaptchaSolution", ""));
      dispatch(showCaptchaAction({
        name : captchaName,
        id   : newCaptcha,
      }));
    },
    startFormSubmit: () => {
      dispatch(startFormSubmitAction(formID));
    },
    stopFormSubmit: (err) => {
      dispatch(stopFormSubmitAction(formID, err));
    },
    hideCaptcha: () => {
      dispatch(hideCaptchaAction(captchaName));
    },
    connectAccount: (account) => {
      setTimeout(() => {
        dispatch(connectAccountAction(account));
      });
    },
    showLostPasswordModal () {
      dispatch(showLostPasswordModalAction());
    },
  });

const
  mapStateToPropsCaptcha = (state : any) => ({
    id: getAuthCaptcha(state, captchaName),
  }),
  CaptchaBox = connect(mapStateToPropsCaptcha)(Captcha);

const returnProblem = (error : any) => {
  if (error) {
    if (error instanceof SubmissionError) {
      throw error;
    }

    throw new SubmissionError({
      _error: "Am pierdut conexiunea cu server-ul",
    });
  }
};

class Login extends React.Component {

  props: FormPropTypes;

  passwordField: HTMLInputElement;

  handleSubmit: (formData : any) => Promise<*>;
  focusPassword: () => void;
  handleRegisterRef: () => void;

  constructor () {
    super();

    this.focusPassword = () => {
      setTimeout(() => {
        const { passwordField } = this;

        if (passwordField && passwordField !== null) {
          passwordField.focus();
        }
      });
    };

    this.handleRegisterRef = (node : any) => {
      this.passwordField = node;
    };

    this.handleSubmit = (formData : any) => {
      const {
          CaptchaID,
          showCaptcha,
          hideCaptcha,
          connectAccount,
        } = this.props,
        data = {
          ...formData.toJS(),
          CaptchaID,
        };

      return performLoginRequest(data).
        then((response) => {
          if (response.Error === "") {
            connectAccount(response.account);
          } else {
            if (response.Captcha) {
              showCaptcha(response.Captcha);
            } else {
              hideCaptcha();
            }
            throw new SubmissionError({
              _error: response.Error,
            });
          }
        }).
        catch(returnProblem);
    };

  }

  render () {

    const {
      error,
      pristine,
      submitting,
      handleSubmit,
      isConnected,
      showLostPasswordModal,
    } = this.props;

    if (isConnected) {
      return (
        <Redirect to="/user-list" />
      );
    }

    return (
      <div className="container ">
        <div className="
          mt-3 mt-md-5
          col-lg-6 offset-lg-4
          col-md-8 offset-md-2
          col-xl-5 offset-xl-4">
          <form className="mt-3 mt-md-4" onSubmit={handleSubmit(this.handleSubmit)}>
            {error ? (
              <div className="alert alert-danger">
                {error}
              </div>
            ) : null}
            <Field
              autoFocus
              component={FocusTemplate}
              label="Utilizator"
              name="UserName"
              normalize={toUpper}
              onRegisterRef={this.handleRegisterRef}
              placeholder="ex. MAI01"
              type="text"
            />
            <Field
              component={FocusTemplate}
              label="Parola"
              name="Password"
              onRegisterRef={this.handleRegisterRef}
              placeholder="Tastează parola ta"
              type="password"
            />
            <Field
              component={CaptchaBox}
              name="CaptchaSolution"
            />
            <div className="text-center">
              <button
                aria-label="Conectează-mă"
                className="btn btn-primary btn-block"
                disabled={pristine || submitting}
                type="submit">
                <i className="fa fa-key" />
                {" Autentifică-te"}
              </button>
            </div>
            <hr />
            <button className="btn btn-link" onClick={showLostPasswordModal} type="button">
              {"Am pierdut parola contului"}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const myForm = reduxForm({
  form: formID,
  validate,
})(Login);

export default connect(mapStateToProps, mapDispatchToProps)(myForm);
