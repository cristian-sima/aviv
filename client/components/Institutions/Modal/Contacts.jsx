// @flow

import type { State } from "types";

type ModalWrapPropTypes = {
  institution: any;
  users: any;
};

import React from "react";
import SimpleModal from "../../Modal/SimpleModal";

import List from "../Contacts/List";

import { connect } from "react-redux";

import {
  getInstitution,
  getUsersByInstitution,
} from "reducers";

const
  mapStateToProps = (state : State, { id }) => ({
    users       : getUsersByInstitution(state, id),
    institution : getInstitution(state, id),
  });


const ModalWrap = ({ users, institution } : ModalWrapPropTypes) => (
  <SimpleModal size="lg" title={institution && institution.get("name")}>
    <List users={users} />
  </SimpleModal>
);

export default connect(mapStateToProps)(ModalWrap);
