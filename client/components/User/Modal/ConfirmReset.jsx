// @flow

import type { State, Dispatch } from "types";

type OwnProps = {
  id: string;
};

import { connect } from "react-redux";
import React from "react";

import Delete from "../../Modal/Delete";

import { resetPassword as resetPasswordRequest } from "request";
import { getUser } from "reducers";
import {
  resetPassword as resetPasswordAction,
  notify,
} from "actions";

const
  mapStateToProps = (state : State, { id } : OwnProps) => ({
    data: getUser(state, String(id)),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { id } : OwnProps) => ({
    onSuccess ({ temporaryPassword }) {
      dispatch(resetPasswordAction({
        id,
        temporaryPassword,
      }));
      dispatch(notify("Parola a fost resetată"));
    },
  }),
  mergeProps = ({ data }, { onSuccess }, { id } : OwnProps) => ({

    onSuccess,

    confirmButtonLabel: "Sunt conștient",

    errMessage: "Nu am putut să resetez parola",

    request: () => resetPasswordRequest(id),

    message: (
      <span>
        {"Vrei să resetez parola utilizatorului "}
        <strong>{data.get("username")}</strong>
        {" ?"}
      </span>
    ),
  });

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Delete);
