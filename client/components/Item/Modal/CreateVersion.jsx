// @flow

import type { State, Emit, Dispatch } from "types";

type OwnProps = {
  id: string;
  emit: Emit;
};

import { connect } from "react-redux";
import React from "react";

import ConfirmEmit from "../../Modal/ConfirmEmit";

import { getItem } from "reducers";

const
  mapStateToProps = (state : State, { id } : OwnProps) => ({
    data: getItem(state, String(id)),
  }),
  mapDispatchToProps = (dispatch : Dispatch, { id, emit } : OwnProps) => ({
    createVersion () {
      emit("CREATE_VERSION", { id });
    },
  }),
  mergeProps = (state, { createVersion }, { id } : OwnProps) => ({

    id: "CONFIRM_CREATE_VERSION",

    cancelButtonLabel  : "Înapoi",
    confirmButtonLabel : "Trimite la re-avizare",

    action: () => createVersion(id),

    focusButton: false,

    message: (
      <span>
        {`
          Actul va fi trimis la toate instituțiile avizatoare, în vederea obținerii unor noi avize.
           Ești sigur că acest lucru dorești?
        `}
        <hr />
        <div className="mt-2 text-warning">
          <i className="fa fa-exclamation-triangle mr-1" />
          {"Această operațiune este ireversibilă"}
        </div>
      </span>
    ),
  });

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ConfirmEmit);
