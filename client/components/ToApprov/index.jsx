// @flow
/* eslint-disable max-len */

import type { Dispatch, State } from "types";

type ItemListPropTypes = {
  hasFetchingError: boolean;
  items: any;
  isFetching: boolean;
  currentFrom: number;
  showLoadMoreButton: boolean;
  total: number;
  institutions: any;

  loadItemsToAdvice: () => void;
  loadNextPage: () => void;
};

type OwnProps = {
  ui: {
    currentFrom: number;
  };
  match: {
    params: {
      company: string;
    };
  };
  updateUI: (newState: any) => void;
};

type StateProps = {
  hasFetchingError: boolean;
  items: any;
  isFetching: boolean;
  lastFetchedID: string;
  shouldFetchItemsToAdvice: boolean;
  shouldFetchLastItemNumber: boolean;
  total: number;
};

type DispatchProps = {
  fetchItemsToAdviceFrom: (data : { from : number, lastID: string }) => void;
};

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import React from "react";
import ui from "redux-ui";

import List from "./List";

import { LargeErrorMessage, LoadingMessage } from "../Messages";

import {
  getItemsToAdviceUpToSelector as getItemsToAdviceUpTo,
  getIsFetchingItemsToAdvice,
  getIsFetchingItemsToAdviceError,
  getTotalItemsToAdviceSelector,
  lastFetchedItemsToAdviceIDSelector,
  shouldFetchItemsToAdviceFrom,

  getInstitutionsData,
} from "reducers";

import { rowsPerLoad } from "utility";

import {
  fetchItemsToAdviceFrom as fetchItemsToAdviceFromAction,
} from "actions";

const
  mapStateToProps = (state : State, { ui : { currentFrom } } : OwnProps) => ({
    hasFetchingError : getIsFetchingItemsToAdviceError(state),
    items            : getItemsToAdviceUpTo(state, currentFrom + rowsPerLoad),
    isFetching       : getIsFetchingItemsToAdvice(state),
    total            : getTotalItemsToAdviceSelector(state),
    lastFetchedID    : lastFetchedItemsToAdviceIDSelector(state),

    shouldFetchLastItemNumber : shouldFetchItemsToAdviceFrom(state, currentFrom),
    shouldFetchItemsToAdvice  : shouldFetchItemsToAdviceFrom(state, currentFrom + rowsPerLoad),

    institutions: getInstitutionsData(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    fetchItemsToAdviceFrom: (data : { from : number, lastID: string }) => dispatch(
      fetchItemsToAdviceFromAction(data)
    ),
  }),
  mergeProps = (stateProps : StateProps, dispatchProps : DispatchProps, ownProps : OwnProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...{
      currentFrom        : ownProps.ui.currentFrom,
      showLoadMoreButton : (
      // if the number of visible is not equal to the nr of total
        stateProps.items.size !== stateProps.total
      ),

      loadItemsToAdvice () {
        const { shouldFetchLastItemNumber, lastFetchedID } = stateProps;
        const { fetchItemsToAdviceFrom } = dispatchProps;
        const { ui : { currentFrom } } = ownProps;

        if (shouldFetchLastItemNumber) {
          fetchItemsToAdviceFrom({
            from   : currentFrom,
            lastID : lastFetchedID,
          });
        }
      },

      loadNextPage: () => {
        const { updateUI, ui : { currentFrom } } = ownProps;
        const { shouldFetchItemsToAdvice, lastFetchedID } = stateProps;
        const { fetchItemsToAdviceFrom } = dispatchProps;

        const updateUIValue = (newCurrentFrom : number) => updateUI({
          currentFrom: newCurrentFrom,
        });

        if (shouldFetchItemsToAdvice) {
          updateUIValue(stateProps.items.size);
          fetchItemsToAdviceFrom({
            from   : Number(currentFrom) + rowsPerLoad,
            lastID : lastFetchedID,
          });
        } else {
        // just update it, because it gets the items locally
          updateUIValue(currentFrom + rowsPerLoad);
        }
      },
    },
  });

class ItemList extends React.Component {

  props: ItemListPropTypes;

  componentDidMount () {
    this.props.loadItemsToAdvice();
  }

  shouldComponentUpdate (nextProps : ItemListPropTypes) {
    return (
      this.props.institutions !== nextProps.institutions ||
      this.props.hasFetchingError !== nextProps.hasFetchingError ||
      this.props.items !== nextProps.items ||
      this.props.isFetching !== nextProps.isFetching ||
      this.props.currentFrom !== nextProps.currentFrom ||
      this.props.showLoadMoreButton !== nextProps.showLoadMoreButton ||
      this.props.total !== nextProps.total
    );
  }

  render () {
    const {
      hasFetchingError,
      items,
      isFetching,
      loadItemsToAdvice,
      institutions,
    } = this.props;

    if (items.size === 0 && isFetching) {
      return <LoadingMessage message="Preiau actele pentru avizat..." />;
    }

    if (institutions.size === 0) {
      return <LoadingMessage message="Încă puțin..." />;
    }

    if (items.size === 0 && hasFetchingError) {
      return (
        <LargeErrorMessage
          message="Nu am putut prelua actele pentru avizat"
          onRetry={loadItemsToAdvice}
        />
      );
    }

    if (items.size === 0) {
      return (
        <div className="text-center fancy-text" style={{ marginTop: "8rem" }}>
          {"Nu există acte de avizat"}
        </div>
      );
    }

    return (
      <List
        {...this.props}
      />
    );
  }
}

export default ui({
  state: {
    currentFrom: 0,
  },
})(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(withRouter(ItemList))
);
