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
  shouldFetchItemsClosed: boolean;
  lastID: string;

  loadData: () => void;
  loadNextPage: () => void;
  updateFrom: (from : number) => void;
  fetchItemsClosedFrom: (lastID : string) => void;
};

type StateProps = {
  offsetFrom: number;
  hasFetchingError: boolean;
  items: any;
  isFetching: boolean;
  lastID: string;
  shouldFetchItemsClosed: boolean;
  shouldFetchLastItemNumber: boolean;
  total: number;
};

type DispatchProps = {
  updateFrom: (from : number) => void;
  fetchItemsClosedFrom: (lastID : string) => void;
};

import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import React from "react";

import List from "./List";

import { LargeErrorMessage, LoadingMessage } from "../Messages";

import {
  getItemsClosedUpToSelector as getItemsClosedUpTo,
  getIsFetchingItemsClosed,
  getIsFetchingItemsClosedError,
  getTotalItemsClosedSelector,
  lastFetchedItemsClosedIDSelector,
  shouldFetchItemsClosedFrom,
  getOffsetFromClosedItems,
  getFromClosedItems,

} from "reducers";

import { rowsPerLoad } from "utility";

import {
  fetchItemsClosedFrom as fetchItemsClosedFromAction,
  modifyFromClosedItems as modifyFromClosedItemsAction,
} from "actions";

const
  mapStateToProps = (state : State) => {

    const
      offsetFrom = getOffsetFromClosedItems(state),
      currentFrom = getFromClosedItems(state);

    return {
      offsetFrom,
      hasFetchingError : getIsFetchingItemsClosedError(state),
      items            : getItemsClosedUpTo(state, currentFrom + rowsPerLoad),
      isFetching       : getIsFetchingItemsClosed(state),
      total            : getTotalItemsClosedSelector(state),
      lastID           : lastFetchedItemsClosedIDSelector(state),

      shouldFetchLastItemNumber : shouldFetchItemsClosedFrom(state, offsetFrom),
      shouldFetchItemsClosed    : shouldFetchItemsClosedFrom(state, offsetFrom + rowsPerLoad),
    };
  },
  mapDispatchToProps = (dispatch : Dispatch) => ({
    fetchItemsClosedFrom: (lastID: string) => dispatch(fetchItemsClosedFromAction(lastID)),
    updateFrom (from) {
      dispatch(modifyFromClosedItemsAction(from));
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
        const { fetchItemsClosedFrom } = dispatchProps;

        if (shouldFetchLastItemNumber) {
          fetchItemsClosedFrom(lastID);
        }
      },

      loadNextPage: () => {
        const { shouldFetchItemsClosed, lastID, offsetFrom } = stateProps;
        const { fetchItemsClosedFrom, updateFrom } = dispatchProps;

        if (shouldFetchItemsClosed) {
          updateFrom(stateProps.items.size);
          fetchItemsClosedFrom(lastID);
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
    const { shouldFetchLastItemNumber, fetchItemsClosedFrom, lastID } = nextProps;

    if (shouldFetchLastItemNumber) {
      fetchItemsClosedFrom(lastID);
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
      this.props.shouldFetchItemsClosed !== nextProps.shouldFetchItemsClosed ||
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
      return <LoadingMessage message="Preiau actele trimise spre SGG..." />;
    }

    if (items.size === 0 && hasFetchingError) {
      return (
        <LargeErrorMessage
          message="Nu am putut prelua actele trimise spre SGG"
          onRetry={loadData}
        />
      );
    }

    if (items.size === 0) {
      return (
        <div className="text-center fancy-text" style={{ marginTop: "8rem" }}>
          {"Nu există acte trimise la SGG"}
          <div className="fancy-text-sm">
            <Link
              to="/started">
              {"Vezi actele inițiate în curs de avizare"}
            </Link>
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
