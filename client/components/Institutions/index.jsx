// @flow

import React from "react";
import { withRouter } from "react-router-dom";

import List from "./List";

const Institutions = () => (
  <div>
    <h1>{"Instituții"}</h1>
    <List />
  </div>
);

export default withRouter(Institutions);
