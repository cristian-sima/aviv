// @flow

type LabelPropTypes = {
  input: any;
  label: string;
  htmlFor: string;
  name: string;
  meta: {
    submitting : boolean;
  };
};


import React from "react";

const Label = ({
  input,
  htmlFor,
  label,
  meta: { submitting },
}: LabelPropTypes) => (
  <div>
    <label className="custom-control custom-radio" htmlFor={htmlFor}>
      <input
        {...input}
        className="custom-control-input"
        disabled={submitting}
        id={htmlFor}
        name={input.name}
        type="radio"
      />
      <span className="custom-control-indicator" />
      <span className="custom-control-description">
        {label}
      </span>
    </label>
  </div>
);

export default Label;
