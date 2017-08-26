// @flow

import { Link } from "react-router-dom";
import React from "react";

const AddButton = () => (
  <Link className="btn btn-success" to="/add-item">
    <i className="fa fa-plus mr-1" />
    {"Inițiază act normativ"}
  </Link>
);

export default AddButton;
