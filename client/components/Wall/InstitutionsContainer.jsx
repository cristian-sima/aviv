// @flow

import type { Dispatch, State } from "types";

type ListPropTypes = {
  hasFetchingError: boolean;
  isFetching: boolean;
  shouldFetchInstitutions: boolean;
  isMasterAccount: boolean;

  emit: (name : string, msg : any) => void;
  fetchInstitutions: () => void;
};

import { connect } from "react-redux";
import React from "react";
import { withRouter, Route } from "react-router-dom";

import { LargeErrorMessage, LoadingMessage } from "../Messages";

import Institutions from "../Institutions";
import ToApprov from "../ToApprov";
import AddItem from "../Item/AddContainer";

import {
  fetchInstitutions as fetchInstitutionsAction,
} from "actions";

import {
  getInstitutionsHasError,
  getInstitutionsAreFetching,
  getInstitutionsShouldFetch,
  getIsMasterAccount,
} from "reducers";

const
  mapStateToProps = (state : State) => ({
    isFetching              : getInstitutionsAreFetching(state),
    hasFetchingError        : getInstitutionsHasError(state),
    shouldFetchInstitutions : getInstitutionsShouldFetch(state),

    isMasterAccount: getIsMasterAccount(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    fetchInstitutions () {
      setTimeout(() => {
        dispatch(fetchInstitutionsAction());
      });
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

  render () {
    const {
      fetchInstitutions,
      hasFetchingError,
      isFetching,
      emit,
      isMasterAccount,
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

    return (
      <div className="container mt-2">
        {
          isMasterAccount ? (
            <div>
              <Route component={() => (<Institutions emit={emit} />)} exact path="/institutions" />
            </div>
          ) : (
            <div>
              <Route component={() => (<AddItem emit={emit} />)} exact path="/add-item" />
              <Route component={() => (<ToApprov emit={emit} />)} exact path="/to-approv" />
            </div>
          )
        }
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(List));
