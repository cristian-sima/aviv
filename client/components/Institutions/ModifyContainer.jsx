// @flow

import type { Dispatch, State } from "types";

type OwnProps = {
  id : number;
};

type ModifyInstitutionPropTypes = {
  id: number;
  data: any;
  hasFetchingError: boolean;
  isFetchingInstitutions: boolean;
  showVat: boolean;
  shouldFetchInstitutions: boolean;

  cbAfter?: (institution : any) => void;
  fetchInstitutions: () => void;
  modifyInstitutionLocally: (institution : any) => void,
};

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { SubmissionError, reduxForm } from "redux-form/immutable";
import * as Immutable from "immutable";
import React from "react";

import {
  notify,
  fetchInstitutions as fetchInstitutionsAction,
  modifyInstitution as modifyInstitutionAction,
} from "actions";

import { modifyInstitution as modifyInstitutionRequest } from "request";

import {
  getInstitution,
  getInstitutionsHasError,
  getInstitutionsAreFetching,
  getInstitutionsShouldFetch,
} from "reducers";

import { LargeErrorMessage, LoadingMessage } from "../Messages";
import Form, { validate } from "./Form";

import { INSTITUTION_FORM } from "utility/forms";

const
  mapStateToProps = (state : State, { id } : OwnProps) => ({
    data                    : getInstitution(state, String(id)),
    hasFetchingError        : getInstitutionsHasError(state),
    isFetchingInstitutions  : getInstitutionsAreFetching(state),
    shouldFetchInstitutions : getInstitutionsShouldFetch(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    ...bindActionCreators({
      fetchInstitutions: fetchInstitutionsAction,
    }, dispatch),
    modifyInstitutionLocally (institution) {
      dispatch(modifyInstitutionAction(institution));
      dispatch(notify("Instituție modificată"));
    },
  });

const ConnectedForm = reduxForm({
  buttonLabel : "Modifică",
  form        : INSTITUTION_FORM,
  title       : "Modifică datele",
  validate,
})(Form);


class ModifyInstitution extends React.Component<ModifyInstitutionPropTypes> {

  props: ModifyInstitutionPropTypes;

  handleSubmit: (formData : any) => Promise<*>;

  constructor () {
    super();

    this.handleSubmit = (formData : any) => {

      const { modifyInstitutionLocally } = this.props;

      return modifyInstitutionRequest(formData.toJS()).
        then((response) => {
          if (response.Error === "") {
            const { cbAfter } = this.props;
            const institution = Immutable.Map(response.Institution);

            modifyInstitutionLocally(institution);

            if (typeof cbAfter === "function") {
              cbAfter(institution);
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

  componentDidMount () {

    const { shouldFetchInstitutions, fetchInstitutions } = this.props;

    if (shouldFetchInstitutions) {
      fetchInstitutions();
    }
  }

  render () {

    const {
      data,
      isFetchingInstitutions,
      hasFetchingError,
      fetchInstitutions,
      showVat,
    } = this.props;

    if (isFetchingInstitutions) {
      return (
        <LoadingMessage message="Preiau articolele..." />
      );
    }

    if (hasFetchingError) {
      return (
        <LargeErrorMessage
          message="Nu am putut prelua articolele"
          onRetry={fetchInstitutions}
        />
      );
    }

    if (typeof data === "undefined") {
      return (
        <LargeErrorMessage
          itemNotFound
          message="Acest articol nu există"
          onRetry={fetchInstitutions}
        />
      );
    }

    return (
      <ConnectedForm
        initialValues={data}
        onSubmit={this.handleSubmit}
        showVat={showVat}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyInstitution);
