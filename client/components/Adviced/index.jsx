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
  shouldFetchItems: boolean;
  institutions: any;
  shouldFetchItemsAdviced: boolean;
  lastID: string;

  loadData: () => void;
  loadNextPage: () => void;
  updateFrom: (from : number) => void;
  fetchItemsAdvicedFrom: (lastID : string) => void;
};

type StateProps = {
  offsetFrom: number;
  hasFetchingError: boolean;
  items: any;
  isFetching: boolean;
  lastID: string;
  shouldFetchItemsAdviced: boolean;
  shouldFetchLastItemNumber: boolean;
  total: number;
};

type DispatchProps = {
  updateFrom: (from : number) => void;
  fetchItemsAdvicedFrom: (lastID : string) => void;
};

import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import React from "react";

import List from "./List";

import { LargeErrorMessage, LoadingMessage } from "../Messages";

import {
  getItemsAdvicedUpToSelector as getItemsAdvicedUpTo,
  getIsFetchingItemsAdviced,
  getIsFetchingItemsAdvicedError,
  getTotalItemsAdvicedSelector,
  lastFetchedItemsAdvicedIDSelector,
  shouldFetchItemsAdvicedFrom,
  getOffsetFromAdvicedItems,
  getFromAdvicedItems,

  getInstitutionsData,
} from "reducers";

import { rowsPerLoad } from "utility";

import {
  fetchItemsAdvicedFrom as fetchItemsAdvicedFromAction,
  modifyFromAdvicedItems as modifyFromAdvicedItemsAction,
} from "actions";

const
  mapStateToProps = (state : State) => {

    const
      offsetFrom = getOffsetFromAdvicedItems(state),
      currentFrom = getFromAdvicedItems(state);

    return {
      offsetFrom,
      hasFetchingError : getIsFetchingItemsAdvicedError(state),
      items            : getItemsAdvicedUpTo(state, currentFrom + rowsPerLoad),
      isFetching       : getIsFetchingItemsAdviced(state),
      total            : getTotalItemsAdvicedSelector(state),
      lastID           : lastFetchedItemsAdvicedIDSelector(state),

      shouldFetchLastItemNumber : shouldFetchItemsAdvicedFrom(state, offsetFrom),
      shouldFetchItemsAdviced   : shouldFetchItemsAdvicedFrom(state, offsetFrom + rowsPerLoad),

      institutions: getInstitutionsData(state),
    };
  },
  mapDispatchToProps = (dispatch : Dispatch) => ({
    fetchItemsAdvicedFrom: (lastID: string) => dispatch(fetchItemsAdvicedFromAction(lastID)),
    updateFrom (from) {
      dispatch(modifyFromAdvicedItemsAction(from));
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
        const { fetchItemsAdvicedFrom } = dispatchProps;

        if (shouldFetchLastItemNumber) {
          fetchItemsAdvicedFrom(lastID);
        }
      },

      loadNextPage: () => {
        const { shouldFetchItemsAdviced, lastID, offsetFrom } = stateProps;
        const { fetchItemsAdvicedFrom, updateFrom } = dispatchProps;

        if (shouldFetchItemsAdviced) {
          updateFrom(stateProps.items.size);
          fetchItemsAdvicedFrom(lastID);
        } else {
          // just update it, because it gets the items locally
          updateFrom(offsetFrom + rowsPerLoad);
        }
      },
    },
  });

class ItemList extends React.Component<ItemListPropTypes> {

  props: ItemListPropTypes;

  componentDidMount () {
    this.props.loadData();
  }

  componentWillReceiveProps (nextProps) {
    const { shouldFetchLastItemNumber, fetchItemsAdvicedFrom, lastID } = nextProps;

    if (shouldFetchLastItemNumber) {
      fetchItemsAdvicedFrom(lastID);
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
      this.props.shouldFetchItemsAdviced !== nextProps.shouldFetchItemsAdviced ||
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
      return <LoadingMessage message="Preiau actele avizate..." />;
    }

    if (items.size === 0 && hasFetchingError) {
      return (
        <LargeErrorMessage
          message="Nu am putut prelua actele avizate"
          onRetry={loadData}
        />
      );
    }

    if (items.size === 0) {
      return (
        <div className="text-center" style={{ marginTop: "8rem" }}>
          <span className="fancy-text">{"Nu ai avizat niciun act"}</span>
          <div className="fancy-text-sm">
            <Link
              to="/">
              {"Vezi actele spre avizare"}
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
