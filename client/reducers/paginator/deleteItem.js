// @flow

import type { State } from "types";

import performDelete from "./util/performDelete";

const deleteItem = (state : State, action : any) => {
  const
    { items: { byID } } = state,
    _id = action.payload.get("_id");

  return {
    ...state,
    items: {
      ...state.items,
      byID: byID.update(_id, (current) => {
        if (typeof current === "undefined") {
          return current;
        }

        return current.merge({
          detailsFetchingError: "Removed",
        });
      }),
      adviced  : performDelete(state.items.adviced, byID, _id),
      started  : performDelete(state.items.started, byID, _id),
      toAdvice : performDelete(state.items.toAdvice, byID, _id),
    },
    versions: state.versions.remove(_id),
  };
};

export default deleteItem;
