// @flow

import type { State } from "types";

type SelectInstitutionPropTypes = {
  add: (id : string) => void;
  institutions: any;
};

import { getFormValues } from "redux-form/immutable";
import React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { getInstitutions } from "reducers";


import { ITEM_FORM } from "utility/forms";

const
  getValues = getFormValues(ITEM_FORM),
  getAuthors = createSelector(
    getValues,
    (form) => form.get("authors")
  ),
  getAdvicers = createSelector(
    getValues,
    (form) => form.get("advicers")
  ),
  getRestOfInstitutions = createSelector(
    getAuthors,
    getAdvicers,
    getInstitutions,
    (authors, advicers, institutions) => (
      institutions.filter((institution) => {
        const id = institution.get("_id");

        return (
          !authors.includes(id) && !advicers.includes(id)
        );
      }
      )
    )
  );

const
  mapStateToPropsSelectInstitution = (state : State) => ({
    institutions: getRestOfInstitutions(state),
  });

class SelectInstitution extends React.Component {
  props: SelectInstitutionPropTypes;

  addInstitution: () => void;
  handleChange: (event : any) => void;

  constructor (props) {
    super(props);

    this.addInstitution = (event : any) => {
      const
        { add } = this.props,
        { target : { value } } = event;

      add(value);
    };
  }

  shouldComponentUpdate (nextProps : SelectInstitutionPropTypes) {
    return (
      this.props.institutions !== nextProps.institutions
    );
  }

  render () {
    const { institutions } = this.props;

    if (institutions.size === 0) {
      return null;
    }

    return (
      <div className="form-group">
        <select
          className="custom-select form-control"
          onChange={this.addInstitution} value="">
          <option value="">{"Selectează instituția"}</option>
          {
            institutions.map((institution) => {
              const
                id = institution.get("_id"),
                name = institution.get("name");

              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })
          }
        </select>
      </div>
    );
  }
}

export default connect(mapStateToPropsSelectInstitution)(SelectInstitution);
