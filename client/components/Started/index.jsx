// @flow
/* eslint-disable max-len */

import type { Dispatch, State } from "types";

type ItemListPropTypes = {
  hasFetchingError: boolean;
  items: any;
  isFetching: boolean;
  offsetFrom: number;
  showLoadMoreButton: boolean;
  total: number;
  currentFrom: number;
  shouldFetchLastItemNumber: boolean;
  shouldFetchItemsStarted: boolean;
  lastID: string;

  loadData: () => void;
  loadNextPage: () => void;
  updateFrom: (from : number) => void;
  fetchItemsStartedFrom: (lastID : string) => void;
};

type StateProps = {
  offsetFrom: number;
  hasFetchingError: boolean;
  items: any;
  isFetching: boolean;
  lastID: string;
  shouldFetchItemsStarted: boolean;
  shouldFetchLastItemNumber: boolean;
  total: number;
};

type DispatchProps = {
  updateFrom: (from : number) => void;
  fetchItemsStartedFrom: (lastID : string) => void;
};

import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import React from "react";

import List from "./List";

import { LargeErrorMessage, LoadingMessage } from "../Messages";

import {
  getItemsStartedUpToSelector as getItemsStartedUpTo,
  getIsFetchingItemsStarted,
  getIsFetchingItemsStartedError,
  getTotalItemsStartedSelector,
  lastFetchedItemsStartedIDSelector,
  shouldFetchItemsStartedFrom,
  getOffsetFromStartedItems,
  getFromStartedItems,

} from "reducers";

import { rowsPerLoad } from "utility";

import {
  fetchItemsStartedFrom as fetchItemsStartedFromAction,
  modifyFromStartedItems as modifyFromStartedItemsAction,
} from "actions";

const
  mapStateToProps = (state : State) => {

    const
      offsetFrom = getOffsetFromStartedItems(state),
      currentFrom = getFromStartedItems(state);

    return {
      offsetFrom,
      hasFetchingError : getIsFetchingItemsStartedError(state),
      items            : getItemsStartedUpTo(state, currentFrom + rowsPerLoad),
      isFetching       : getIsFetchingItemsStarted(state),
      total            : getTotalItemsStartedSelector(state),
      lastID           : lastFetchedItemsStartedIDSelector(state),

      shouldFetchLastItemNumber : shouldFetchItemsStartedFrom(state, offsetFrom),
      shouldFetchItemsStarted   : shouldFetchItemsStartedFrom(state, offsetFrom + rowsPerLoad),
    };
  },
  mapDispatchToProps = (dispatch : Dispatch) => ({
    fetchItemsStartedFrom: (lastID: string) => dispatch(fetchItemsStartedFromAction(lastID)),
    updateFrom (from) {
      dispatch(modifyFromStartedItemsAction(from));
    },
  }),
  mergeProps = (stateProps : StateProps, dispatchProps : DispatchProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...{
      offsetFrom         : stateProps.offsetFrom,
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
        const { shouldFetchItemsStarted, lastID, offsetFrom } = stateProps;
        const { fetchItemsStartedFrom, updateFrom } = dispatchProps;

        if (shouldFetchItemsStarted) {
          updateFrom(stateProps.items.size);
          fetchItemsStartedFrom(lastID);
        } else {
          // just update it, because it gets the items locally
          updateFrom(offsetFrom + rowsPerLoad);
        }
      },
    },
  });

class ItemList extends React.Component {

  props: ItemListPropTypes;

  componentDidMount () {
    this.props.loadData();
  }

  componentWillReceiveProps (nextProps) {
    const { shouldFetchLastItemNumber, fetchItemsStartedFrom, lastID } = nextProps;

    if (shouldFetchLastItemNumber) {
      fetchItemsStartedFrom(lastID);
    }
  }

  shouldComponentUpdate (nextProps : ItemListPropTypes) {
    return (
      this.props.hasFetchingError !== nextProps.hasFetchingError ||
      this.props.items !== nextProps.items ||
      this.props.isFetching !== nextProps.isFetching ||
      this.props.offsetFrom !== nextProps.offsetFrom ||
      this.props.showLoadMoreButton !== nextProps.showLoadMoreButton ||
      this.props.shouldFetchLastItemNumber !== nextProps.shouldFetchLastItemNumber ||
      this.props.shouldFetchItemsStarted !== nextProps.shouldFetchItemsStarted ||
      this.props.lastID !== nextProps.lastID ||
      this.props.total !== nextProps.total
    );
  }

  componentWillUnmount () {
    const { updateFrom } = this.props;

    updateFrom(0);
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(withRouter(ItemList));
