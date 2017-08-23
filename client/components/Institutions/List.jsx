// @flow

import type { Dispatch, State } from "types";

type ListPropTypes = {
  institutions: any;
  hasFetchingError: boolean;
  isFetching: boolean;
  shouldFetchInstitutions: boolean;
  info: any;
  isResetingPassword: boolean;

  showModifyModal: (id : number) => void;
  deleteInstitution: (id : number) => void;
  fetchInstitutions: () => void;
  showCreateInstitutionModal: () => void;
  resetPassword: (id : string) => () => void;
};

import { connect } from "react-redux";
import React from "react";

import { LargeErrorMessage, LoadingMessage } from "../Messages";
import Row from "./Row";

import {
  fetchInstitutions as fetchInstitutionsAction,
  resetPassword as resetPasswordAction,
} from "actions";

import {
  getInstitutionsHasError,
  getInstitutionsAreFetching,
  getInstitutionsShouldFetch,
  getInstitutions,
  getIsResetingPassword,
} from "reducers";

const
  mapStateToProps = (state : State) => ({
    isResetingPassword: getIsResetingPassword(state),

    institutions            : getInstitutions(state),
    isFetching              : getInstitutionsAreFetching(state),
    hasFetchingError        : getInstitutionsHasError(state),
    shouldFetchInstitutions : getInstitutionsShouldFetch(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    fetchInstitutions () {
      dispatch(fetchInstitutionsAction());
    },
    resetPassword: (id : string) => () => {
      dispatch(resetPasswordAction(id));
    },
  });

class List extends React.Component {

  props: ListPropTypes;

  componentDidMount () {
    const { shouldFetchInstitutions, fetchInstitutions } = this.props;

    if (shouldFetchInstitutions) {
      fetchInstitutions();
    }
  }

  shouldComponentUpdate (nextProps : ListPropTypes) {
    return (
      nextProps.isResetingPassword !== this.props.isResetingPassword ||
      nextProps.shouldFetchInstitutions !== this.props.shouldFetchInstitutions ||
      nextProps.hasFetchingError !== this.props.hasFetchingError ||
      nextProps.isFetching !== this.props.isFetching ||
      nextProps.institutions !== this.props.institutions
    );
  }

  render () {
    const {
      institutions,
      fetchInstitutions,
      hasFetchingError,
      isFetching,
      resetPassword,
      isResetingPassword,
    } = this.props;

    if (isFetching) {
      return <LoadingMessage message="Preiau instituțiile..." />;
    }

    if (hasFetchingError) {
      return (
        <LargeErrorMessage
          message="Nu am putut prelua instituțiile"
          onRetry={fetchInstitutions}
        />
      );
    }

    if (institutions.size === 0) {
      return (
        <div className="text-center h4">
          {"Nu există instituții"}
        </div>
      );
    }

    return (
      <div className="container">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>
                  {"Nume și prenume"}
                </th>
                <th className="text-center">
                  {"Marca"}
                </th>
                <th className="text-center">
                  {"Grup"}
                </th>
                <th className="text-center">
                  {"Parolă temporară"}
                </th>
                <th className="text-center">
                  {"Resetează parola"}
                </th>
              </tr>
            </thead>
            <tbody>
              {
                institutions.map((institution) => (
                  <Row
                    data={institution}
                    isResetingPassword={isResetingPassword}
                    key={institution.get("_id")}
                    resetPassword={resetPassword}
                  />
                )
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
