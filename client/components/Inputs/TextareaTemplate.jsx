// @flow

type TextareaTemplatePropTypes = {
  autoFocus?: boolean;
  input: any;
  label: string;
  placeholder: string;
  type: string;
  meta: {
    touched: boolean;
    error?: any;
    submitting: boolean;
  };
  cols: number;
  rows: number;
  left?: string;
  right?: string;

  onRegisterRef?: (callback : (node : any) => void) => void;
};

import React from "react";

import classnames from "classnames";

const InputTemplate = ({
  input,
  type,
  label,
  onRegisterRef,
  autoFocus,
  placeholder,
  left,
  right,
  rows,
  cols,
  meta: { submitting, touched, error },
} : TextareaTemplatePropTypes) => {

  const isInvalid = touched && error;

  return (
    <div className="form-group row">
      <label
        className={`${left ? left : "col-md-4"} text-md-right form-control-label`}
        htmlFor={input.name}>
        {label}
      </label>
      <div className={right ? right : "col-md-8"}>
        <textarea
          {...input}
          aria-label={label}
          autoFocus={autoFocus}
          className={classnames("form-control", { "is-invalid": isInvalid })}
          cols={cols}
          disabled={submitting}
          id={input.name}
          placeholder={placeholder}
          ref={onRegisterRef ? onRegisterRef : null}
          rows={rows}
          type={type}>
          {input.value}
        </textarea>
        <div className="invalid-feedback">
          {
            isInvalid && <span>{error}</span>
          }
        </div>
      </div>
    </div>
  );
};

export default InputTemplate;
