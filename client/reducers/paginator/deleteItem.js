// @flow

import type { State } from "types";

import performDelete from "./util/performDelete";

const deleteItem = (state : State, action : any) => {
  const _id = action.payload.get("_id");

  return {
    ...state,
    items: {
      ...state.items,
      byID: state.items.byID.update(_id, (current) => {
        if (typeof current === "undefined") {
          return current;
        }

        return current.merge({
          detailsFetchingError: "Removed",
        });
      }),
      adviced  : performDelete(state.items.adviced, state.items.byID, action.payload),
      started  : performDelete(state.items.started, state.items.byID, action.payload),
      toAdvice : performDelete(state.items.toAdvice, state.items.byID, action.payload),
    },
    versions: state.versions.remove(_id),
  };
};

export default deleteItem;
