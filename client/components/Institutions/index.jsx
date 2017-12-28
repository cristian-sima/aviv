// @flow

import type { Dispatch } from "types";

type InstitutionsPropTypes = {
  showAddForm: () => void;
}

import React from "react";
import { withRouter } from "react-router-dom";

import List from "./List";

import {
  showAddInstitutionFormModal as showAddInstitutionFormModalAction,
} from "actions";

import { connect } from "react-redux";

const
  mapDispatchToProps = (dispatch : Dispatch) => ({
    showAddForm () {
      dispatch(showAddInstitutionFormModalAction());
    },
  });

const Institutions = ({ showAddForm } : InstitutionsPropTypes) => (
  <div>
    <div className="row">
      <div className="col">
        <h1>
          {"Instituții"}
        </h1>
      </div>
      <div className="col text-right">
        <button
          className="btn btn-success"
          onClick={showAddForm}>
          <i className="fa fa-plus mr-1" />
          {"Instituție nouă"}
        </button>
      </div>
    </div>
    <List />
  </div>
);

export default connect(null, mapDispatchToProps)(withRouter(Institutions));
