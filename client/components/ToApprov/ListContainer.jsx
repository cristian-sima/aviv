// @flow
/* eslint-disable max-len */

import type { Dispatch, State } from "types";

type ItemListPropTypes = {
  hasFetchingError: boolean;
  items: any;
  isFetchingItemsToAdvice: boolean;
  currentFrom: number;
  showLoadMoreButton: boolean;
  totalNumberOfItemsToAdvice: number;
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
  isFetchingItemsToAdvice: boolean;
  lastFetchedItemsToAdviceNumber: number;
  shouldFetchItemsToAdvice: boolean;
  shouldFetchLastItemNumber: boolean;
  totalNumberOfItemsToAdvice: number;
};

type DispatchProps = {
  fetchItemsToAdviceFrom: (page : number) => void;
};

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import React from "react";
import ui from "redux-ui";

import AddButton from "./AddButton";
import List from "./List";

import { LargeErrorMessage, LoadingMessage } from "../Messages";

import {
  getItemsToAdviceUpToSelector as getItemsToAdviceUpTo,
  getIsFetchingItemsToAdvice,
  getIsFetchingItemsToAdviceError,
  getTotalItemsToAdviceSelector,
  lastFetchedItemsToAdviceNumberSelector,
  shouldFetchItemsToAdviceFrom,

  getInstitutions,
} from "reducers";

import { rowsPerLoad } from "utility";

import {
  showItemDocumentModal as showItemDocumentModalAction,
  showEmailItemModal as showEmailItemModalAction,
  fetchItemsToAdviceFrom as fetchItemsToAdviceFromAction,
} from "actions";

const
  mapStateToProps = (state : State, { ui : { currentFrom } } : OwnProps) => ({
    hasFetchingError               : getIsFetchingItemsToAdviceError(state),
    items                          : getItemsToAdviceUpTo(state, currentFrom + rowsPerLoad),
    isFetchingItemsToAdvice        : getIsFetchingItemsToAdvice(state),
    totalNumberOfItemsToAdvice     : getTotalItemsToAdviceSelector(state),
    lastFetchedItemsToAdviceNumber : lastFetchedItemsToAdviceNumberSelector(state),

    shouldFetchLastItemNumber : shouldFetchAllItemsToAdviceFrom(state, currentFrom),
    shouldFetchItemsToAdvice  : shouldFetchAllItemsToAdviceFrom(state, currentFrom + rowsPerLoad),

    institutions: getInstitutions(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    fetchItemsToAdviceFrom: (from : number) => dispatch(
      fetchItemsToAdviceFromAction(from)
    ),
    showDocumentModal: (id : number) => () => {
      dispatch(
        showItemDocumentModalAction(id)
      );
    },
    showEmailItem: (id : number) => () => {
      dispatch(
        showEmailItemModalAction(id)
      );
    },
  }),
  mergeProps = (stateProps : StateProps, dispatchProps : DispatchProps, ownProps : OwnProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...{
      currentFrom        : ownProps.ui.currentFrom,
      showLoadMoreButton : (
      // if the number of visible is not equal to the nr of total
        stateProps.items.size !== stateProps.totalNumberOfItemsToAdvice
      ),

      loadItemsToAdvice () {
        const { shouldFetchLastItemNumber, lastFetchedItemsToAdviceNumber } = stateProps;
        const { fetchItemsToAdviceFrom } = dispatchProps;

        if (shouldFetchLastItemNumber) {
          fetchItemsToAdviceFrom(lastFetchedItemsToAdviceNumber + 1);
        }
      },

      loadNextPage: () => {
        const { updateUI, ui : { currentFrom } } = ownProps;
        const { shouldFetchItemsToAdvice, lastFetchedItemsToAdviceNumber } = stateProps;
        const { fetchItemsToAdviceFrom } = dispatchProps;

        const updateUIValue = (newCurrentFrom : number) => updateUI({
          currentFrom: newCurrentFrom,
        });

        if (shouldFetchItemsToAdvice) {
          updateUIValue(lastFetchedItemsToAdviceNumber + 1);
          fetchItemsToAdviceFrom(lastFetchedItemsToAdviceNumber + 1);
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
      this.props.hasFetchingError !== nextProps.hasFetchingError ||
      this.props.items !== nextProps.items ||
      this.props.isFetchingItemsToAdvice !== nextProps.isFetchingItemsToAdvice ||
      this.props.currentFrom !== nextProps.currentFrom ||
      this.props.showLoadMoreButton !== nextProps.showLoadMoreButton ||
      this.props.totalNumberOfItemsToAdvice !== nextProps.totalNumberOfItemsToAdvice
    );
  }

  render () {
    const {
      hasFetchingError,
      items,
      isFetchingItemsToAdvice,
      loadItemsToAdvice,
    } = this.props;

    if (items.size === 0 && isFetchingItemsToAdvice) {
      return <LoadingMessage message="Preiau actele pentru avizat..." />;
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
        <div>
          <div className="text-center fancy-text" style={{ marginTop: "8rem" }}>
            <div>
              {"Nu există acte de avizat"}
            </div>
          </div>
          <div className="text-center mt-2">
            <AddButton message="Inițiază act normativ" />
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
