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
      emit("DEBATE_ITEM", { id });
    },
  }),
  mergeProps = (state, { createVersion }, { id } : OwnProps) => ({

    id: "CONFIRM_DEBATE_ITEM",

    cancelButtonLabel  : "Înapoi",
    confirmButtonLabel : "Discută în pregătitoare",

    action: () => createVersion(id),

    focusButton: false,

    message: (
      <span>
        {"Dorești să discuți actul normativ în ședința pregătitoare?"}
      </span>
    ),
  });

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ConfirmEmit);
