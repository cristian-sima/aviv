// @flow

import type { Dispatch, State, Emit } from "types";

type OwnProps = {
  match: {
    params: {
      item: string;
    };
  };
  emit: Emit;
}

type ItemPagePropTypes = {
  data: any;
  hasFetchingError: boolean;
  isFetching: boolean;
  shouldFetch: boolean;
  versions: any;

  institutions: any;
  isAdvicer: bool;
  emit: Emit;

  showContactsForInstitution: (id : string) => () => void;
  showDeleteItemModal: () => void;
  confirmDeleteItem: () => void;
  showHistoryModal: () => void;
  confirmCreateVersion: () => void;
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
  getItemVersions,
} from "reducers";

import {
  fetchItemDetails as fetchItemDetailsAction,
  showContactsForInstitutionModal as showContactsForInstitutionModalAction,
  deleteItemModal as deleteItemModalAction,
  createVersionModal as createVersionModalAction,
  showHistoryModal as showHistoryModalAction,
} from "actions";

const
  mapStateToProps = (state : State, { match : { params : { item } } } : OwnProps) => ({
    data             : getItem(state, item),
    hasFetchingError : getIsFetchingItemDetailsError(state, item),
    isFetching       : getIsFetchingItemDetails(state, item),
    shouldFetch      : getShouldFetchItemDetails(state, item),

    institutions : getInstitutionsData(state),
    isAdvicer    : getIsCurrentAccountAdvicer(state, item),

    versions: getItemVersions(state, item),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { emit, match: { params : { item } } } : OwnProps) => ({
    fetchItemDetails () {
      dispatch(fetchItemDetailsAction(item));
    },
    showContactsForInstitution: (id) => () => {
      dispatch(showContactsForInstitutionModalAction(id));
    },
    confirmDeleteItem () {
      dispatch(deleteItemModalAction(item, emit));
    },
    showHistoryModal () {
      dispatch(showHistoryModalAction(item));
    },
    confirmCreateVersion () {
      dispatch(createVersionModalAction(item, emit));
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
      this.props.shouldFetch !== nextProps.shouldFetch ||
      this.props.institutions !== nextProps.institutions ||
      this.props.isAdvicer !== nextProps.isAdvicer ||
      this.props.versions !== nextProps.versions
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

    if (typeof data === "undefined" || !data) {
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
