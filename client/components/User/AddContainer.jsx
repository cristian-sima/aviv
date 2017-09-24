// @flow

import type { Dispatch } from "types";

type AddUserPropTypes = {
  institutionID: string;
  addUserLocally: (user : any) => void;
};

import { connect } from "react-redux";
import { SubmissionError, reduxForm, reset } from "redux-form/immutable";
import * as Immutable from "immutable";
import React from "react";

import Form, { validate } from "./Form";

import {
  notify,
  addUser as addUserAction,
} from "actions";

import { addUser as addUserRequest } from "request";

import { USER_FORM } from "utility/forms";

const
  mapDispatchToProps = (dispatch : Dispatch) => ({
    addUserLocally (user : any) {
      dispatch(addUserAction(user));
      dispatch(notify("Contul a fost adăugat"));
      dispatch(reset(USER_FORM));
    },
  });

const AddForm = reduxForm({
  buttonLabel   : "Adaugă",
  form          : USER_FORM,
  initialValues : Immutable.Map({
    "phone": "",
  }),
  title: "Adaugă",
  validate,
})(Form);

class AddUser extends React.Component<AddUserPropTypes> {

  props: AddUserPropTypes;

  handleSubmit: (formData : any) => Promise<*>;

  constructor () {
    super();

    this.handleSubmit = (formData : any) => {

      const
        { addUserLocally, institutionID } = this.props,
        data = {
          ...formData.toJS(),
          institutionID,
        };

      return addUserRequest(data).
        then((response) => {
          if (response.Error === "") {
            addUserLocally(Immutable.Map(response.User));
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
    return (
      <AddForm
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default connect(null, mapDispatchToProps)(AddUser);
