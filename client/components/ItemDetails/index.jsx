// @flow

import type { Dispatch, State } from "types";

type OwnProps = {
  match: {
    params: {
      item: string;
    };
  };
}

type ItemPagePropTypes = {
  data: any;
  hasFetchingError: boolean;
  isFetching: boolean;
  shouldFetch: boolean;

  institutions: any;
  isAdvicer: bool;

  showContactsForInstitution: (id : string) => () => void;
  showDeleteItemModal: () => void;
  fetchItemDetails: () => void;
}

import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Page from "./Page";

import { LargeErrorMessage, LoadingMessage } from "../Messages";

import {
  getItem,
  getIsFetchingItemDetails,
  getIsFetchingItemDetailsError,
  getShouldFetchItemDetails,

  getInstitutionsData,
  getIsCurrentAccountAdvicer,
} from "reducers";

import {
  fetchItemDetails as fetchItemDetailsAction,
  showDeleteItemModal as showDeleteItemModalAction,
  showContactsForInstitutionModal as showContactsForInstitutionModalAction,
} from "actions";

const
  mapStateToProps = (state : State, { match : { params : { item } } } : OwnProps) => ({
    data             : getItem(state, item),
    hasFetchingError : getIsFetchingItemDetailsError(state, item),
    isFetching       : getIsFetchingItemDetails(state, item),
    shouldFetch      : getShouldFetchItemDetails(state, item),

    institutions : getInstitutionsData(state),
    isAdvicer    : getIsCurrentAccountAdvicer(state, item),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { match: { params : { item } } } : OwnProps) => ({
    fetchItemDetails () {
      dispatch(fetchItemDetailsAction(item));
    },
    showDeleteItemModal () {
      dispatch(showDeleteItemModalAction(item));
    },
    showContactsForInstitution: (id) => () => {
      dispatch(showContactsForInstitutionModalAction(id));
    },
  });

class ItemPage extends React.Component {
  props: ItemPagePropTypes;

  componentDidMount () {
    const { shouldFetch, fetchItemDetails } = this.props;

    if (shouldFetch) {
      fetchItemDetails();
    }
  }

  shouldComponentUpdate (nextProps : ItemPagePropTypes) {
    return (
      this.props.data !== nextProps.data ||
      this.props.hasFetchingError !== nextProps.hasFetchingError ||
      this.props.isFetching !== nextProps.isFetching ||
      this.props.shouldFetch !== nextProps.shouldFetch
    );
  }

  render () {
    const {
      data,
      isFetching,
      hasFetchingError,
      fetchItemDetails,
    } = this.props;

    if (isFetching) {
      return (
        <LoadingMessage message="Preiau actul normativ..." />
      );
    }

    if (typeof data === "undefined") {
      return (
        <LargeErrorMessage
          itemNotFound
          message="Acest act normativ nu mai există"
          onRetry={fetchItemDetails}
        />
      );
    }

    if (hasFetchingError) {
      return (
        <LargeErrorMessage
          message="Nu am putut prelua actul normativ"
          onRetry={fetchItemDetails}
        />
      );
    }

    return (
      <Page
        {...this.props}
      />
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ItemPage));
