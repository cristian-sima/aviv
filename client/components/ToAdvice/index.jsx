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
  shouldFetchItemsToAdvice: boolean;
  institutions: any;
  lastID: string;

  loadData: () => void;
  loadNextPage: () => void;
  updateFrom: (from : number) => void;
  fetchItemsToAdviceFrom: (lastID : string) => void;
};

type StateProps = {
  offsetFrom: number;
  hasFetchingError: boolean;
  items: any;
  isFetching: boolean;
  lastID: string;
  shouldFetchItemsToAdvice: boolean;
  shouldFetchLastItemNumber: boolean;
  total: number;
};

type DispatchProps = {
  updateFrom: (from : number) => void;
  fetchItemsToAdviceFrom: (lastID : string) => void;
};

import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import React from "react";

import List from "./List";

import { LargeErrorMessage, LoadingMessage } from "../Messages";

import {
  getItemsToAdviceUpToSelector as getItemsToAdviceUpTo,
  getIsFetchingItemsToAdvice,
  getIsFetchingItemsToAdviceError,
  getTotalItemsToAdviceSelector,
  lastFetchedItemsToAdviceIDSelector,
  shouldFetchItemsToAdviceFrom,
  getOffsetFromToAdviceItems,
  getFromToAdviceItems,

  getInstitutionsData,
} from "reducers";

import { rowsPerLoad } from "utility";

import {
  fetchItemsToAdviceFrom as fetchItemsToAdviceFromAction,
  modifyFromToAdviceItems as modifyFromToAdviceItemsAction,
} from "actions";

const
  mapStateToProps = (state : State) => {

    const
      offsetFrom = getOffsetFromToAdviceItems(state),
      currentFrom = getFromToAdviceItems(state);

    return {
      offsetFrom,
      hasFetchingError : getIsFetchingItemsToAdviceError(state),
      items            : getItemsToAdviceUpTo(state, currentFrom + rowsPerLoad),
      isFetching       : getIsFetchingItemsToAdvice(state),
      total            : getTotalItemsToAdviceSelector(state),
      lastID           : lastFetchedItemsToAdviceIDSelector(state),

      shouldFetchLastItemNumber : shouldFetchItemsToAdviceFrom(state, offsetFrom),
      shouldFetchItemsToAdvice  : shouldFetchItemsToAdviceFrom(state, offsetFrom + rowsPerLoad),

      institutions: getInstitutionsData(state),
    };
  },
  mapDispatchToProps = (dispatch : Dispatch) => ({
    fetchItemsToAdviceFrom: (lastID: string) => dispatch(fetchItemsToAdviceFromAction(lastID)),
    updateFrom (from) {
      dispatch(modifyFromToAdviceItemsAction(from));
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
        const { fetchItemsToAdviceFrom } = dispatchProps;

        if (shouldFetchLastItemNumber) {
          fetchItemsToAdviceFrom(lastID);
        }
      },

      loadNextPage: () => {
        const { shouldFetchItemsToAdvice, lastID, offsetFrom } = stateProps;
        const { fetchItemsToAdviceFrom, updateFrom } = dispatchProps;

        if (shouldFetchItemsToAdvice) {
          updateFrom(stateProps.items.size);
          fetchItemsToAdviceFrom(lastID);
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
    const { shouldFetchLastItemNumber, fetchItemsToAdviceFrom, lastID } = nextProps;

    if (shouldFetchLastItemNumber) {
      fetchItemsToAdviceFrom(lastID);
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
      this.props.shouldFetchItemsToAdvice !== nextProps.shouldFetchItemsToAdvice ||
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
      return <LoadingMessage message="Preiau actele pentru avizat..." />;
    }

    if (items.size === 0 && hasFetchingError) {
      return (
        <LargeErrorMessage
          message="Nu am putut prelua actele pentru avizat"
          onRetry={loadData}
        />
      );
    }

    if (items.size === 0) {
      return (
        <div className="text-center" style={{ marginTop: "8rem" }}>
          <span className="fancy-text">
            {"Nu există acte pentru avizat"}
          </span>
          <div className="fancy-text-sm">
            <Link
              to="/adviced">
              {"Vezi actele avizate"}
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
