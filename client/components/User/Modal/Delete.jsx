// @flow

import type { State, Dispatch } from "types";

type OwnProps = {
  id: string;
};

import { connect } from "react-redux";
import React from "react";

import Delete from "../../Modal/Delete";

import { deleteUser as deleteUserRequest } from "request";
import { getUser } from "reducers";
import {
  deleteUser as deleteUserAction,
  notify,
} from "actions";

const
  mapStateToProps = (state : State, { id } : OwnProps) => ({
    data: getUser(state, String(id)),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { id } : OwnProps) => ({
    onSuccess () {
      dispatch(deleteUserAction(id));
      dispatch(notify("Cont șters"));
    },
  }),
  mergeProps = ({ data }, { onSuccess }, { id } : OwnProps) => ({

    onSuccess,

    errMessage: "Nu am putut să șterg contul",

    request: () => deleteUserRequest(id),

    message: (
      <span>
        {"Vrei să ștergi contul de utilizator "}
        <strong>{data.get("username")}</strong>
        {" ?"}
      </span>
    ),
  });

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Delete);
