// @flow

import React from "react";
import { withRouter } from "react-router-dom";

import List from "./List";

const Institutions = () => (
  <div>
    <div className="row">
      <div className="col">
        <h1>{"Instituții"}</h1>
      </div>
      <div className="col text-right">
        <button className="btn btn-success">
          <i className="fa fa-plus mr-1" />
          {"Instituție nouă"}
        </button>
      </div>
    </div>
    <List />
  </div>
);

export default withRouter(Institutions);
