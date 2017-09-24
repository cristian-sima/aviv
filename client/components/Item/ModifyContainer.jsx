// @flow

import type { Dispatch, State } from "types";

type ModifyUserPropTypes = {
  id: number;
  data: any;
  institutionID: string;

  cbAfter?: (user : any) => void;
  emitModifyItem: (item : any) => void;
};

import { reduxForm, startSubmit } from "redux-form/immutable";
import React from "react";

import Form, { validate } from "./Form";
import { LargeErrorMessage } from "../Messages";
import { connect } from "react-redux";

import { getCurrentInstitutionID, getItem } from "reducers";

import { ITEM_MODIFY_FORM } from "utility/forms";

const
  mapStateToProps = (state : State, { id }) => ({
    data          : getItem(state, id),
    institutionID : getCurrentInstitutionID(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { emit }) => ({
    emitModifyItem (data) {
      dispatch(startSubmit(ITEM_MODIFY_FORM));
      setTimeout(() => {
        emit("MODIFY_ITEM", data);
      });
    },
  });

const ConnectedForm = reduxForm({
  buttonLabel : "Modifică",
  form        : ITEM_MODIFY_FORM,
  validate,
})(Form);


class ModifyUser extends React.Component<ModifyUserPropTypes> {

  props: ModifyUserPropTypes;

  handleSubmit: (formData : any) => any;

  constructor () {
    super();

    this.handleSubmit = (formData : any) => {
      const { emitModifyItem } = this.props;

      emitModifyItem(formData.toJS());
    };
  }

  render () {

    const { data, institutionID } = this.props;

    if (typeof data === "undefined") {
      return (
        <LargeErrorMessage
          itemNotFound
          message="Acest cont de utilizator nu există"
        />
      );
    }

    return (
      <ConnectedForm
        initialValues={data}
        institutionID={institutionID}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyUser);
