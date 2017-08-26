// @flow

type ListPropTypes = {
  hasFetchingError: boolean;
  items: any;
  isFetchingItemsToAdvice: boolean;
  currentFrom: number;
  showLoadMoreButton: boolean;
  totalNumberOfItemsToAdvice: number;
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
      shown === total ? `Există spre avizare ${getInvoiceForm(total)}` : (
        `Afișez ${shown === total ? "toate actele - " : `${shown} din`} ${getInvoiceForm(total)}`
      )
    }
  </div>
);

const List = (props : ListPropTypes) => {
  const {
    items,
    totalNumberOfItemsToAdvice,
    isFetchingItemsToAdvice,
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
            <h2>{"Acte pentru avizare"}</h2>
          </div>
          <div className="col-6 text-right">
            <AddButton />
          </div>
        </div>
        <div className="mt-1">
          <Info
            shown={items.size}
            total={totalNumberOfItemsToAdvice}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th className="text-right">
                  {"Data"}
                </th>
                <th className="text-center">
                  {"Titlu"}
                </th>
                <th className="text-center">
                  {"Inițiator"}
                </th>
              </tr>
            </thead>
            <tbody>
              {
                items.map((item) => (
                  <Row
                    data={item}
                    institutions={institutions}
                    key={item.get("ID")}
                  />
                )
                )
              }
            </tbody>
          </table>
        </div>
        <div className="my-2">
          {
            (isFetchingItemsToAdvice) ? (
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
                disabled={isFetchingItemsToAdvice}
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
