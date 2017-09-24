// @flow
/* eslint-disable react/jsx-no-bind, react/require-optimization */

import type { Dispatch, State } from "types";

type ListPropTypes = {
  hasFetchingError: boolean;
  isFetching: boolean;
  shouldFetchInstitutions: boolean;
  institutions: any;
  areFetched: boolean;

  fetchInstitutions: () => void;
};

import { connect } from "react-redux";
import React from "react";
import { withRouter } from "react-router-dom";

import Wall from "./Wall";

import { LargeErrorMessage, LoadingMessage } from "../Messages";

import {
  fetchInstitutions as fetchInstitutionsAction,
} from "actions";

import {
  getInstitutionsHasError,
  getInstitutionsAreFetching,
  getInstitutionsShouldFetch,
  getInstitutionsData,
  getInstitutionsAreFetched,
} from "reducers";

const
  mapStateToProps = (state : State) => ({
    isFetching              : getInstitutionsAreFetching(state),
    hasFetchingError        : getInstitutionsHasError(state),
    shouldFetchInstitutions : getInstitutionsShouldFetch(state),
    areFetched              : getInstitutionsAreFetched(state),

    institutions: getInstitutionsData(state),

  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    fetchInstitutions () {
      setTimeout(() => {
        dispatch(fetchInstitutionsAction());
      });
    },
  });

class List extends React.Component<ListPropTypes> {

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
      institutions,
    } = this.props;

    if (isFetching || typeof institutions === "undefined") {
      return <LoadingMessage message="Preiau datele..." />;
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
      <Wall />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(List));
