// @flow

type ListPropTypes = {
  hasFetchingError: boolean;
  items: any;
  isFetching: boolean;
  currentFrom: number;
  showLoadMoreButton: boolean;
  total: number;
  institutions: any;

  loadItemsToAdvice: () => void;
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
import AddButton from "./AddButton";
import { ErrorMessage, LoadingSmallMessage } from "../Messages";

const getInvoiceForm = (value : number) : string => {
  if (value === 1) {
    return "un act normativ";
  }

  return `${numberToLocaleForm(value)} acte normative`;
};

const Info = ({ shown, total } : InfoPropTypes) => (
  <div className="text-muted">
    {
      shown === total ? `Există spre avizat ${getInvoiceForm(total)}` : (
        `Afișez ${shown === total ? "toate actele - " : `${shown} din`} ${getInvoiceForm(total)}`
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
    institutions,
  } = props;

  return (
    <div>
      <div className="container">
        <div className="row mt-3 mr-1">
          <div className="col-6">
            <h2>{"Acte pentru avizat"}</h2>
          </div>
          <div className="col-6 text-right">
            <AddButton />
          </div>
        </div>
        <div className="mt-1">
          <Info
            shown={items.size}
            total={total}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>
                  {"Publicat la"}
                </th>
                <th className="text-center">
                  {"Titlu"}
                </th>
                <th className="text-center">
                  {"Inițiatori"}
                </th>
              </tr>
            </thead>
            <ReactCSSTransitionGroup
              component="tbody"
              transitionEnterTimeout={700}
              transitionLeaveTimeout={10}
              transitionName="item-row">
              {
                items.map((item) => (
                  <Row
                    data={item}
                    institutions={institutions}
                    key={item.get("_id")}
                  />
                )
                )
              }
            </ReactCSSTransitionGroup>
          </table>
        </div>
        <div className="my-2">
          {
            (isFetching) ? (
              <LoadingSmallMessage message="Încarc actele pentru avizat..." />
            ) : null
          }
          {
            (hasFetchingError) ? (
              <ErrorMessage
                message="Nu am putut prelua actele pentru avizat"
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
    </div>
  );
};

export default List;
