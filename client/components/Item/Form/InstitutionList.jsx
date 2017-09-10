// @flow
/* eslint-disable react/jsx-no-bind, max-len */

import type { State } from "types";

type InstitutionListPropTypes = {
  fields: any;
  institutions: any;
  hideInstitutionID: string;
};

import React from "react";
import { connect } from "react-redux";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import { getInstitutionsData } from "reducers";

const
  mapStateToPropsList = (state : State) => ({
    institutions: getInstitutionsData(state),
  });

const InstitutionList = ({ fields, institutions, hideInstitutionID } : InstitutionListPropTypes) => (
  <div>
    {
      fields.length === 0 ? null : (
        <ul className={fields.size > 0 ? "mb-2 list-group" : "list-group"}>
          <ReactCSSTransitionGroup
            transitionEnterTimeout={100}
            transitionLeaveTimeout={10}
            transitionName="item-row">
            {
              fields.map((field, index) => {
                const
                  id = String(fields.get(index)),
                  institution = institutions.get(id),
                  name = institution && institution.get("name"),
                  hide = id === hideInstitutionID;

                if (hide) {
                  return null;
                }

                return (
                  <li className="list-group-item mb-1" key={index}>
                    { name }
                    <span className="mx-1">
                      { "-" }
                    </span>
                    <span
                      className="text-muted cursor-pointer"
                      onClick={() => fields.remove(index)}>
                      {"Șterge"}
                    </span>
                  </li>
                );
              })
            }
          </ReactCSSTransitionGroup>
        </ul>
      )
    }
  </div>
);

export default connect(mapStateToPropsList)(InstitutionList);
