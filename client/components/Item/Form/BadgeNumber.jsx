// @flow

type BadgeNumberPropTypes = {
  value: number;
}

import React from "react";

const BadgeNumber = ({ value } : BadgeNumberPropTypes) => (
  <span className="badge badge-pill badge-info ml-1">
    { value === 0 ? null : value }
  </span>
);

export default BadgeNumber;
