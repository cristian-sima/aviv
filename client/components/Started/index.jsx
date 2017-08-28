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

  loadData: () => void;
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
  lastID: string;
  shouldFetchItemsStarted: boolean;
  shouldFetchLastItemNumber: boolean;
  total: number;
};

type DispatchProps = {
  fetchItemsStartedFrom: (lastID : string) => void;
};

import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import React from "react";
import ui from "redux-ui";

import List from "./List";

import { LargeErrorMessage, LoadingMessage } from "../Messages";

import {
  getItemsStartedUpToSelector as getItemsStartedUpTo,
  getIsFetchingItemsStarted,
  getIsFetchingItemsStartedError,
  getTotalItemsStartedSelector,
  lastFetchedItemsStartedIDSelector,
  shouldFetchItemsStartedFrom,

} from "reducers";

import { rowsPerLoad } from "utility";

import {
  fetchItemsStartedFrom as fetchItemsStartedFromAction,
} from "actions";

const
  mapStateToProps = (state : State, { ui : { currentFrom } } : OwnProps) => ({
    hasFetchingError : getIsFetchingItemsStartedError(state),
    items            : getItemsStartedUpTo(state, currentFrom + rowsPerLoad),
    isFetching       : getIsFetchingItemsStarted(state),
    total            : getTotalItemsStartedSelector(state),
    lastID           : lastFetchedItemsStartedIDSelector(state),

    shouldFetchLastItemNumber : shouldFetchItemsStartedFrom(state, currentFrom),
    shouldFetchItemsStarted   : shouldFetchItemsStartedFrom(state, currentFrom + rowsPerLoad),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    fetchItemsStartedFrom: (lastID: string) => dispatch(
      fetchItemsStartedFromAction(lastID)
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

      loadData () {
        const { shouldFetchLastItemNumber, lastID } = stateProps;
        const { fetchItemsStartedFrom } = dispatchProps;

        if (shouldFetchLastItemNumber) {
          fetchItemsStartedFrom(lastID);
        }
      },

      loadNextPage: () => {
        const { updateUI, ui : { currentFrom } } = ownProps;
        const { shouldFetchItemsStarted, lastID } = stateProps;
        const { fetchItemsStartedFrom } = dispatchProps;

        const updateUIValue = (newCurrentFrom : number) => updateUI({
          currentFrom: newCurrentFrom,
        });

        if (shouldFetchItemsStarted) {
          updateUIValue(stateProps.items.size);
          fetchItemsStartedFrom(lastID);
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
    this.props.loadData();
  }

  shouldComponentUpdate (nextProps : ItemListPropTypes) {
    return (
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
      loadData,
    } = this.props;

    if (items.size === 0 && isFetching) {
      return <LoadingMessage message="Preiau actele inițiate..." />;
    }

    if (items.size === 0 && hasFetchingError) {
      return (
        <LargeErrorMessage
          message="Nu am putut prelua actele inițiate"
          onRetry={loadData}
        />
      );
    }

    if (items.size === 0) {
      return (
        <div className="text-center fancy-text" style={{ marginTop: "8rem" }}>
          {"Nu ai inițiat acte normative"}
          <div className="mt-2">
            <NavLink
              activeClassName="selected"
              className="btn btn-success"
              to="/add-item">
              <i className="fa fa-plus mr-1" />
              {"Inițiază primul act normativ"}
            </NavLink>
          </div>
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
