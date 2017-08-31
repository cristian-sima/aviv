// @flow

import type { State, Action } from "types";

import * as Immutable from "immutable";

import { noError, noID, nothingFetched } from "utility";

const getTheLastItem = (ids, data) => {
  const
    sortedByTime = ids.
      map((current) => data.get(current)).
      sortBy((current) => -current.get("date"));

  return sortedByTime.get(sortedByTime.size - 2);
};

const performDelete = (state, data, item) => {
  const { lastID, total, IDs, negativeOffset } = state;

  if (total === nothingFetched) {
    return state;
  }

  const
    id = item.get("_id"),
    findAndRemoveCurrent = () => (
      IDs.remove(
        IDs.findIndex((current) => current === id)
      )
    );

  if (lastID === id) {
    // there are more on the server
    // but nothing here
    if (IDs.size === 1 && total !== 1) {
      return {
        ...state,
        IDs      : Immutable.List(),
        error    : noError,
        fetched  : false,
        fetching : false,

        lastID         : noID,
        from           : 0,
        negativeOffset : 0,
        total          : nothingFetched,
      };
    }

    // get the last one before latest
    return {
      ...state,
      lastID         : getTheLastItem(IDs, data).get("_id"),
      IDs            : findAndRemoveCurrent(),
      total          : total - 1,
      negativeOffset : negativeOffset - 1,
    };
  }

  if (IDs.includes(id)) {
    return {
      ...state,
      IDs            : findAndRemoveCurrent(),
      total          : total - 1,
      negativeOffset : negativeOffset - 1,
    };
  }

  return state;
};

const getShouldStore = (lists : Array<any>, id) => {
  for (const list of lists) {
    if (list.includes(id)) {
      return true;
    }
  }

  return false;
};

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
      toAdvice : performDelete(state.items.toAdvice, state.items.byID, action.payload),
      started  : performDelete(state.items.started, state.items.byID, action.payload),
    },
    versions: state.versions.remove(_id),
  };
};

const adviceItem = (state :State, action : any) => {

  // console.log("action", action);

  const
    { items, versions : versionsState } = state,
    { toAdvice, byID } = items,
    { payload : { item, versions : rawVersions } } = action,
    _id = item.get("_id"),
    versions = rawVersions.entities,
    version = versions.first(),
    currentVersion = item.get("version"),
    currentInstitutionID = version.get("institutionID");

  // console.log("item", item);

  const
    newToAdvice = performDelete(toAdvice, byID, item),
    shouldStore = (
      byID.has(_id) &&
      byID.get(_id).has("detailsFetched")
    ) || getShouldStore([newToAdvice], _id);

  // console.log("shouldStore", shouldStore);
  // console.log("_id", _id);
  // console.log("versions", versions);
  // console.log("versionsState.has(_id) ", versionsState.has(_id));

  const newByID = shouldStore ? (
    byID.update(_id, (current) => {
      if (typeof current === "undefined") {
        return current;
      }

      const responses = current.get("responses");

      if (responses.includes(currentInstitutionID)) {
        return current;
      }

      const newResponses = responses.push(currentInstitutionID);

      return current.set("responses", newResponses);
    })
  ) : byID;

  const newVersions = shouldStore ? (
    versionsState.has(_id) ? (
      versionsState.update(_id, (currentState) => {
        if (typeof currentState === "undefined") {
          return versions;
        }

        return currentState.filter((current) => (
          !(
            current.get("version") === currentVersion &&
            current.get("institutionID") === currentInstitutionID
          )
        )).set(version.get("_id"), version);
      })
    ) : versionsState.set(_id, versions)
  ) : versionsState;

  return {
    ...state,
    items: {
      ...items,
      byID     : newByID,
      toAdvice : newToAdvice,
    },
    versions: newVersions,
  };
};

const paginator = (state : State, action : Action) => {
  switch (action.type) {
    case "DELETE_ITEM":
      return deleteItem(state, action);
    case "ADVICE_ITEM":
      return adviceItem(state, action);

    default:
      return state;
  }
};

export default paginator;
