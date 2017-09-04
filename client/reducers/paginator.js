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
        lastDate       : nothingFetched,
        from           : 0,
        negativeOffset : 0,
        total          : nothingFetched,
      };
    }

    // get the last one before latest

    const lastItem = getTheLastItem(IDs, data);

    return {
      ...state,
      lastID         : lastItem.get("_id"),
      lastDate       : lastItem.get("date"),
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

const performAddIfNewer = (state, data, item) => {
  const { lastDate, total, IDs } = state;

  if (total === nothingFetched) {
    return state;
  }

  const
    _id = item.get("_id"),
    currentDate = item.get("date");

  if (currentDate > lastDate) {
    return {
      ...state,
      IDs   : IDs.push(_id),
      total : total + 1,
    };
  }

  return state;
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
      adviced  : performDelete(state.items.adviced, state.items.byID, action.payload),
      started  : performDelete(state.items.started, state.items.byID, action.payload),
      toAdvice : performDelete(state.items.toAdvice, state.items.byID, action.payload),
    },
    versions: state.versions.remove(_id),
  };
};

const adviceItem = (state :State, action : any) => {

  // console.log("action", action);

  const
    { items, versions : versionsState } = state,
    { toAdvice, adviced, byID } = items,
    { payload : { item, versions : rawVersions } } = action;

  const
    _id = item.get("_id"),
    currentVersion = item.get("version");

  const
    versions = rawVersions.entities,
    version = versions.first(),
    currentInstitutionID = version.get("institutionID");

  const
    newToAdvice = performDelete(toAdvice, byID, item),
    newAdviced = performAddIfNewer(adviced, byID, item),
    shouldStore = (
      byID.has(_id) &&
      byID.get(_id).has("detailsFetched")
    ) || getShouldStore([
        newToAdvice,
        newAdviced,
      ], _id);

  const newByID = shouldStore ? (
    byID.update(_id, (current) => {
      if (typeof current === "undefined") {
        return current;
      }

      const
        responses = current.get("responses"),
        allAdvices = current.get("allAdvices");

      const newResponses = responses.includes(currentInstitutionID) ? (
        responses
      ) : (
        responses.push(currentInstitutionID)
      );

      const newAllResponses = allAdvices.includes(currentInstitutionID) ? (
        allAdvices
      ) : (
        allAdvices.push(currentInstitutionID)
      );

      return current.merge({
        responses  : newResponses,
        allAdvices : newAllResponses,
      });
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
      adviced  : newAdviced,
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
