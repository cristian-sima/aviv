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
    deleteItem () {
      emit("DELETE_ITEM", { id });
    },
  }),
  mergeProps = (state, { deleteItem }, { id } : OwnProps) => ({

    id: "CONFIRM_DELETE_ITEM",

    cancelButtonLabel  : "Înapoi",
    confirmButtonLabel : "Retrage actul normativ",

    errMessage: "Nu am putut să retrag actul normativ",

    action: () => deleteItem(id),

    message: (
      <span>
        {"Vrei retragi actul normativ?"}
        <div className="mt-2 text-warning">
          <i className="fa fa-exclamation-triangle mr-1" />{"Această operațiune este ireversibilă."}
        </div>
      </span>
    ),
  });

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ConfirmEmit);
