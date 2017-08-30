// @flow

type AdviceResponsePropTypes = {
  value : number;
}

import React from "react";

const AdviceResponse = ({ value } : AdviceResponsePropTypes) => {
  if (value === 0) {
    return (
      <span className="text-success">
        {"Favorabil, fără observații"}
      </span>
    );
  }

  if (value === 1) {
    return (
      <span className="text-warning">
        {"Favorabil, cu observații"}
      </span>
    );
  }

  return (
    <span className="text-danger">
      {"Negativ, cu observații"}
    </span>
  );
};

export default AdviceResponse;
