// @flow;

type VatFieldPropTypes = {
  customClass?: any;
  showWarnings: boolean;
  input: any;
  meta: {
    submitting: boolean;
    touched: boolean;
    error?: string;
  };
};

import React from "react";
import classnames from "classnames";

import { vatRates } from "utility";

const
  VatField = ({
    customClass,
    input,
    meta: { submitting, touched, error },
    showWarnings,
  } : VatFieldPropTypes) => (
    <div className={classnames({
      "inline-form-group has-warning": showWarnings && touched && error,
    })}>
      <select
        {...input}
        className={`custom-select form-control ${customClass || ""}`}
        disabled={submitting}>
        <option value="">{"TVA"}</option>
        {
          vatRates.map((rate) => (
            <option key={rate} value={rate}>
              {rate}
            </option>
          ))
        }
      </select>
    </div>
  );

export default VatField;
