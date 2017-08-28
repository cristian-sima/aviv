// @flow

import type { State, Dispatch } from "types";

type OwnProps = {
  id: string;
};

import { connect } from "react-redux";
import React from "react";

import Delete from "../../Modal/Delete";

import { deleteUser as deleteUserRequest } from "request";
import { getItem } from "reducers";
import {
  deleteUser as deleteUserAction,
  notify,
} from "actions";

const
  mapStateToProps = (state : State, { id } : OwnProps) => ({
    data: getItem(state, String(id)),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { id } : OwnProps) => ({
    onSuccess () {
      dispatch(deleteUserAction(id));
      dispatch(notify("Actul normatv a fost retras"));
    },
  }),
  mergeProps = ({ onSuccess }, { id } : OwnProps) => ({

    onSuccess,

    errMessage: "Nu am putut să retrag actul normativ",

    request: () => deleteUserRequest(id),

    message: (
      <span>
        {"Vrei retragi actul normativ? Această operațiune este ireversibilă."}
      </span>
    ),
  });

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Delete);
