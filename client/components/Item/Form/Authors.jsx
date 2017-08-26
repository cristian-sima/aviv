// @flow

type AuthorsArrayPropTypes = {
  institutionID: string;
  fields: any;
};

import React from "react";

import InstitutionList from "./InstitutionList";
import SelectInstitution from "./SelectInstitution";

const AuthorsArray = ({ fields, institutionID } : AuthorsArrayPropTypes) => (

  <div className="form-group row">
    <label
      className="col-md-2 col-xl-4 text-md-right form-control-label"
      htmlFor={"advicers"}>
      {"Coinițiatori"}
    </label>
    <div className="col-md-10 col-xl-8">
      <div>
        <div className={fields.size > 0 ? "mb-2" : ""}>
          <InstitutionList
            fields={fields}
            hideInstitutionID={institutionID}
            remove={fields.push}
          />
        </div>
        <SelectInstitution
          add={fields.push}
        />
      </div>
    </div>
  </div>
);

export default AuthorsArray;
