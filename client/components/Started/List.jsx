// @flow

type ListPropTypes = {
  hasFetchingError: boolean;
  items: any;
  isFetching: boolean;
  currentFrom: number;
  showLoadMoreButton: boolean;
  total: number;

  loadNextPage: () => void;
}

type InfoPropTypes = {
  shown: number;
  total: number;
};

import React from "react";

import { numberToLocaleForm } from "utility";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import Row from "./Row";
import { ErrorMessage, LoadingSmallMessage } from "../Messages";

const getDocumentForm = (value : number) : string => {
  if (value === 1) {
    return "un act normativ";
  }

  return `${numberToLocaleForm(value)} acte normative`;
};

const Info = ({ shown, total } : InfoPropTypes) => (
  <div className="text-muted">
    {
      shown === total ? `Ai inițiat ${getDocumentForm(total)}` : (
        `Afișez ${shown === total ? "toate actele - " : `${shown} din`} ${getDocumentForm(total)}`
      )
    }
  </div>
);

const List = (props : ListPropTypes) => {
  const {
    items,
    total,
    isFetching,
    hasFetchingError,
    loadNextPage,
    showLoadMoreButton,
  } = props;

  return (
    <div className="container">
      <h2>{"Acte inițiate"}</h2>
      <div className="mt-1">
        <Info
          shown={items.size}
          total={total}
        />
      </div>
      <table className="table table-responsive table-striped table-hover items-to-advice-table">
        <thead>
          <tr>
            <th className="no-wrap">
              {"Publicat la"}
            </th>
            <th className="text-center">
              {"Titlu"}
            </th>
            <th className="text-center">
              {"Status"}
            </th>
          </tr>
        </thead>
        <ReactCSSTransitionGroup
          component="tbody"
          transitionEnterTimeout={0}
          transitionLeaveTimeout={10}
          transitionName="item-row">
          {
            items.map((item) => (
              <Row
                data={item}
                key={item.get("_id")}
              />
            ))
          }
        </ReactCSSTransitionGroup>
      </table>
      <div className="my-2">
        {
          (isFetching) ? (
            <LoadingSmallMessage message="Încarc mai multe acte..." />
          ) : null
        }
        {
          (hasFetchingError) ? (
            <ErrorMessage
              message="Nu am putut prelua actele inițiate"
              onRetry={loadNextPage}
            />
          ) : null
        }
      </div>
      <div className="text-center my-2" >
        {
          showLoadMoreButton ? (
            <button
              className="btn btn-info btn-block"
              disabled={isFetching}
              onClick={loadNextPage}
              type="button">
              {"Încarcă mai multe"}
            </button>
          ) : null
        }
      </div>
    </div>
  );
};

export default List;
