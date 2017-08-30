// @flow

import type { Action, ModalState } from "types";

import * as Immutable from "immutable";

const initialState = Immutable.Map();

// const
//   showModal = (state : ModalState, { payload : { modalType, modalProps } }) => (
//     state.push({
//       type  : modalType,
//       props : modalProps,
//     })
//   );

const reducer = (state : ModalState = initialState, action : Action) => {
  switch (action.type) {


    default:
      return state;
  }
};

export default reducer;
