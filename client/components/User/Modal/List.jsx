// @flow

import type { State } from "types";

type ModalWrapPropTypes = {
  institutionID: string;
  institution: any;
  cbAfter?: (user: any) => void;
};

import React from "react";
import SimpleModal from "../../Modal/SimpleModal";

import ListContainer from "../ListContainer";

import { connect } from "react-redux";

import { getInstitution } from "reducers";

const
  mapStateToProps = (state : State, { institutionID }) => ({
    institution: getInstitution(state, institutionID),
  });


const ModalWrap = ({ cbAfter, institutionID, institution } : ModalWrapPropTypes) => (
  <SimpleModal size="lg" title={institution.get("name")}>
    <ListContainer cbAfter={cbAfter} institutionID={institutionID} />
  </SimpleModal>
);

export default connect(mapStateToProps)(ModalWrap);
