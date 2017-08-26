// @flow

import type { State, Dispatch } from "types";

type OwnProps = {
  id: string;
};

import { connect } from "react-redux";
import React from "react";

import Delete from "../../Modal/Delete";

import { deleteInstitution as deleteInstitutionRequest } from "request";
import { getInstitution } from "reducers";
import {
  deleteInstitution as deleteInstitutionAction,
  notify,
} from "actions";

const
  mapStateToProps = (state : State, { id } : OwnProps) => ({
    data: getInstitution(state, String(id)),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { id } : OwnProps) => ({
    onSuccess () {
      dispatch(deleteInstitutionAction(id));
      dispatch(notify("Instituție ștersă"));
    },
  }),
  mergeProps = ({ data }, { onSuccess }, { id } : OwnProps) => ({

    onSuccess,

    errMessage: "Nu am putut să șterg instituția",

    request: () => deleteInstitutionRequest(id),

    message: (
      <span>
        {"Vrei să ștergi instituția "}
        <strong>{data.get("name")}</strong>
        {" ?"}
      </span>
    ),
  });

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Delete);
