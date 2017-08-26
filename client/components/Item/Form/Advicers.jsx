// @flow

type AdvicersArrayPropTypes = {
  fields: any;
}

import React from "react";

import BadgeNumber from "./BadgeNumber";
import InstitutionList from "./InstitutionList";
import SelectInstitution from "./SelectInstitution";

const AdvicersArray = ({ fields } : AdvicersArrayPropTypes) => (

  <div className="form-group row">
    <label
      className="col-md-2 col-xl-4 text-md-right form-control-label"
      htmlFor={"authors"}>
      {"Avizatori"}
      <BadgeNumber value={fields.length} />
    </label>
    <div className="col-md-10 col-xl-8">
      <InstitutionList
        fields={fields}
        remove={fields.push}
      />
      <SelectInstitution
        add={fields.push}
      />
    </div>
  </div>
);

export default AdvicersArray;
