// @flow

import type { State, Dispatch } from "types";

type ModalWrapPropTypes = {
  versions: any;
  item: any;
  showContactsForInstitution: (id : string) => () => void;
};

import React from "react";
import SimpleModal from "../../Modal/SimpleModal";

import History from "../History";

import { connect } from "react-redux";

import {
  getItem,
  getHistory,
} from "reducers";

import {
  showContactsForInstitutionModal as showContactsForInstitutionModalAction,
} from "actions";

const
  mapStateToProps = (state : State, { id }) => ({
    item     : getItem(state, id),
    versions : getHistory(state, id),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    showContactsForInstitution: (id) => () => {
      dispatch(showContactsForInstitutionModalAction(id));
    },
  });

const ModalWrap = ({ item, versions, showContactsForInstitution } : ModalWrapPropTypes) => (
  <SimpleModal size="lg" title="Istoric versiuni">
    <History
      item={item}
      showContactsForInstitution={showContactsForInstitution}
      versions={versions}
    />
  </SimpleModal>
);

export default connect(mapStateToProps, mapDispatchToProps)(ModalWrap);
