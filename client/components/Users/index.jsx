// @flow

import React from "react";
import { withRouter } from "react-router-dom";

import List from "./List";

const Users = () => (
  <div>
    <h1>{"Utilizatori"}</h1>
    <List />
  </div>
);

export default withRouter(Users);
