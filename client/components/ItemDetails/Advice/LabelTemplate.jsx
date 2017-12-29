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
  <div className="custom-control custom-radio">
    <input
      {...input}
      className="custom-control-input"
      disabled={submitting}
      id={htmlFor}
      name={input.name}
      type="radio"
    />
    <label className="custom-control-label" htmlFor={htmlFor}>
      {label}
    </label>
  </div>
);

export default Label;
