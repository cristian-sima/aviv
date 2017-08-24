// @flow

import type { State, UsersState } from "types";

import * as Immutable from "immutable";
import { createSelector } from "reselect";

import { noError } from "utility";

const newInitialState = () => ({
  fetched       : false,
  fetching      : false,
  errorFetching : noError,

  isUpdating  : false,
  errorUpdate : noError,

  isResetingPassword: false,

  data: Immutable.Map(),
});

const
  updateUsersPending = (state : UsersState) => ({
    ...state,
    errorUpdate : noError,
    isUpdating  : true,
  }),
  updateUsersRejected = (state : UsersState) => ({
    ...state,
    errorUpdate : "Problem",
    isUpdating  : false,
  }),
  updateUsersFulFilled = (state : UsersState, { payload }) => ({
    ...state,

    isUpdating : false,
    data       : payload.users.entities,

    fetched  : true,
    fetching : false,
  }),
  fetchUsersPending = (state : UsersState) => ({
    ...state,
    fetching      : true,
    errorFetching : noError,
  }),
  fetchUsersRejected = (state : UsersState, { payload : { error } }) => ({
    ...state,
    fetching      : false,
    errorFetching : error,
  }),
  fetchUsersFulfilled = (state : UsersState, { payload }) => ({
    ...state,
    fetched  : true,
    fetching : false,

    data: payload.users.entities,
  }),
  resetPasswordPending = (state : UsersState) => ({
    ...state,
    isResetingPassword: true,
  }),
  resetPasswordRejected = (state : UsersState) => ({
    ...state,
    isResetingPassword: false,
  }),
  resetPasswordFulfilled = (state : UsersState, { payload: { temporaryPassword }, meta : { id } }) => ({
    ...state,
    isResetingPassword: false,

    data: state.data.update(id, (user) => {
      if (typeof user === "undefined") {
        return user;
      }

      return user.merge({
        password      : "",
        requireChange : true,
        temporaryPassword,
      });
    }),
  }),
  setUser = (state : UsersState, { payload }) => ({
    ...state,
    data: state.data.set(String(payload.get("_id")), payload),
  }),
  deleteUser = (state : UsersState, { payload }) => ({
    ...state,
    data: state.data.delete(String(payload)),
  });


const reducer = (state : UsersState = newInitialState(), action : any) => {
  switch (action.type) {
    case "FETCH_INSTITUTIONS_PENDING":
      return updateUsersPending(state);

    case "FETCH_INSTITUTIONS_REJECTED":
      return updateUsersRejected(state);

    case "FETCH_INSTITUTIONS_FULFILLED":
      return updateUsersFulFilled(state, action);

    case "FETCH_USERS_PENDING":
      return fetchUsersPending(state);

    case "FETCH_USERS_REJECTED":
      return fetchUsersRejected(state, action);

    case "FETCH_USERS_FULFILLED":
      return fetchUsersFulfilled(state, action);

    case "SIGN_OFF_FULFILLED":
      return newInitialState();

    case "RESET_PASSWORD_PENDING":
      return resetPasswordPending(state);

    case "RESET_PASSWORD_REJECTED":
      return resetPasswordRejected(state);

    case "RESET_PASSWORD_FULFILLED":
      return resetPasswordFulfilled(state, action);

    case "ADD_USER":
    case "MODIFY_USER":
      return setUser(state, action);

    case "DELETE_USER":
      return deleteUser(state, action);

    default:
      return state;
  }
};

const
  updatingUserListSelector = (state : State) : bool => state.users.isUpdating,
  errorUpdateUserListSelector = (state : State) : string => state.users.errorUpdate || noError;

const
  getFetching = (state : State) => state.users.fetching,
  getFetched = (state : State) => state.users.fetched,
  getError = (state : State) => state.users.errorFetching,
  getData = (state : State) => state.users.data;

export const
  getUser = createSelector(
    getData,
    (state, id) => id,
    (data, id) => data.get(id)
  ),
  getIsResetingPassword = (state : State) => state.users.isResetingPassword;

export const getErrorUpdateUsers = createSelector(
  errorUpdateUserListSelector,
  (errorLoading) => (errorLoading !== noError)
);

export const getIsUpdatingUserList = createSelector(
  updatingUserListSelector,
  (isUpdating) => isUpdating
);

export const
  getUsers = createSelector(
    getData,
    (map) => map.toList().sortBy(
      (user) => user.get("name")
    )
  );

export const getUsersByInstitution = createSelector(
  getData,
  (state, id) => id,
  (data, id) => data.filter((user) => (
    user.get("institutionID") === id
  )).toList()
);

export const getUsersAreFetched = createSelector(
  getFetching,
  getFetched,
  getError,
  (isFetching, isFetched, error) => (
    !isFetching && isFetched && error === noError
  )
);

export const getUsersAreFetching = createSelector(
  getFetching,
  getError,
  (isFetching, error) => (
    isFetching && error === noError
  )
);

export const getUsersHasError = createSelector(
  getError,
  (error) => error !== noError
);

export const getUsersShouldFetch = createSelector(
  getIsUpdatingUserList,
  getUsersAreFetched,
  getUsersAreFetching,
  (isUpdating, isFetched, isFetching) => (
    !isUpdating && !isFetched && !isFetching
  )
);

export default reducer;
