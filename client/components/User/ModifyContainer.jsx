// @flow

import type { Dispatch, State } from "types";

type OwnProps = {
  id : number;
};

type ModifyUserPropTypes = {
  id: number;
  data: any;

  cbAfter?: (user : any) => void;
  modifyUserLocally: (user : any) => void,
};

import { connect } from "react-redux";
import { SubmissionError, reduxForm } from "redux-form/immutable";
import * as Immutable from "immutable";
import React from "react";

import {
  notify,
  modifyUser as modifyUserAction,
} from "actions";

import { modifyUser as modifyUserRequest } from "request";

import { getUser } from "reducers";

import { LargeErrorMessage } from "../Messages";
import Form, { validate } from "./Form";

import { USER_FORM } from "utility/forms";

const
  mapStateToProps = (state : State, { id } : OwnProps) => ({
    data: getUser(state, String(id)),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    modifyUserLocally (user) {
      dispatch(modifyUserAction(user));
      dispatch(notify("Datele contului au fost modificate"));
    },
  });

const ConnectedForm = reduxForm({
  buttonLabel : "Modifică",
  form        : USER_FORM,
  title       : "Modifică datele",
  validate,
})(Form);


class ModifyUser extends React.Component<ModifyUserPropTypes> {

  props: ModifyUserPropTypes;

  handleSubmit: (formData : any) => Promise<*>;

  constructor () {
    super();

    this.handleSubmit = (formData : any) => {

      const { modifyUserLocally } = this.props;

      return modifyUserRequest(formData.toJS()).
        then((response) => {
          if (response.Error === "") {
            const { cbAfter } = this.props;
            const user = Immutable.Map(response.User);

            modifyUserLocally(user);

            if (typeof cbAfter === "function") {
              cbAfter(user);
            }
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

    const { data } = this.props;

    if (typeof data === "undefined") {
      return (
        <LargeErrorMessage
          itemNotFound
          message="Acest cont de utilizator nu există"
        />
      );
    }

    return (
      <ConnectedForm
        initialValues={data}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyUser);
