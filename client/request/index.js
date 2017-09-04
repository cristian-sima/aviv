// @flow

type PerformLoginTypes = {
  Password: string;
  CaptchaSolution : string;
  Username: string;
};

type ChangePasswordTypes = { password: string; confirmation : string };

import agent from "superagent";

import {
  withPromiseCallback,
  normalizeArrayOfItems,
  normalizeArray,
  checkForErrorsThenNormalizeItemDetails,
} from "./normalize";

export const performLogin = (data : PerformLoginTypes) => new Promise((resolve, reject) => (
  agent.
    post("/api/login").
    send(data).
    type("form").
    end(withPromiseCallback(resolve, reject))
));

export const changePassword = (data : ChangePasswordTypes) => new Promise((resolve, reject) => (
  agent.
    post("/api/auth/changePassword").
    send(data).
    type("form").
    end(withPromiseCallback(resolve, reject))
));

export const signOff = () => new Promise((resolve, reject) => (
  agent.
    post("/api/auth/signOff").
    end(withPromiseCallback(resolve, reject))
));

export const performReconnect = () => new Promise((resolve, reject) => (
  agent.
    post("/api/auth/reconnect").
    end(withPromiseCallback(resolve, reject))
));

export const fetchInstitutions = () => new Promise((resolve, reject) => (
  agent.
    get("/api/institutions").
    type("json").
    end(withPromiseCallback(
      ({ Institutions, Users }) => resolve({
        institutions : normalizeArray(Institutions),
        users        : normalizeArray(Users),
      }),
      reject
    ))
));

export const addInstitution = (data : any) => (
  new Promise((resolve, reject) => (
    agent.
      put("/api/institutions").
      set("Accept", "application/json").
      send(data).
      end(withPromiseCallback(resolve, reject))
  ))
);

export const modifyInstitution = (data : any) => (
  new Promise((resolve, reject) => (
    agent.
      post(`/api/institutions/${data._id}`).
      set("Accept", "application/json").
      send(data).
      end(withPromiseCallback(resolve, reject))
  ))
);

export const deleteInstitution = (id : number) => (
  new Promise((resolve, reject) => (
    agent.
      del(`/api/institutions/${id}`).
      set("Accept", "application/json").
      end(withPromiseCallback(resolve, reject))
  ))
);

export const addUser = (data : any) => (
  new Promise((resolve, reject) => (
    agent.
      put("/api/users").
      set("Accept", "application/json").
      send(data).
      end(withPromiseCallback(resolve, reject))
  ))
);

export const modifyUser = (data : any) => (
  new Promise((resolve, reject) => (
    agent.
      post(`/api/users/${data._id}`).
      set("Accept", "application/json").
      send(data).
      end(withPromiseCallback(resolve, reject))
  ))
);

export const deleteUser = (id : number) => (
  new Promise((resolve, reject) => (
    agent.
      del(`/api/users/${id}`).
      set("Accept", "application/json").
      end(withPromiseCallback(resolve, reject))
  ))
);

export const resetPassword = (id : string) => new Promise((resolve, reject) => (
  agent.
    post(`api/users/${id}/reset-password`).
    end(withPromiseCallback(resolve, reject))
));

export const fetchItemsToAdviceFrom = (lastID: string) => (
  new Promise((resolve, reject) => (
    agent.
      get("/api/items/items-to-advice").
      query({
        lastID,
      }).
      set("Accept", "application/json").
      end(withPromiseCallback(
        ({ Items, Total, LastID, LastDate }) => resolve({
          Items    : normalizeArrayOfItems(Items),
          LastID,
          LastDate : new Date(LastDate).getTime(),
          Total,
        }),
        reject
      ))
  ))
);

export const fetchItemsAdvicedFrom = (lastID: string) => (
  new Promise((resolve, reject) => (
    agent.
      get("/api/items/items-adviced").
      query({
        lastID,
      }).
      set("Accept", "application/json").
      end(withPromiseCallback(
        ({ Items, Total, LastID, LastDate }) => resolve({
          Items    : normalizeArrayOfItems(Items),
          LastID,
          LastDate : new Date(LastDate).getTime(),
          Total,
        }),
        reject
      ))
  ))
);

export const fetchItemsStartedFrom = (lastID: string) => (
  new Promise((resolve, reject) => (
    agent.
      get("/api/items/items-started").
      query({
        lastID,
      }).
      set("Accept", "application/json").
      end(withPromiseCallback(
        ({ Items, Total, LastID }) => resolve({
          Items: normalizeArrayOfItems(Items),
          LastID,
          Total,
        }),
        reject
      ))
  ))
);

export const fetchItemDetails = (id : string) => (
  new Promise((resolve, reject) => (
    agent.
      get(`/api/items/item/${id}`).
      set("Accept", "application/json").
      end(checkForErrorsThenNormalizeItemDetails(resolve, reject))
  ))
);

export const fetchSuggestions = (search : string) => (
  new Promise((resolve, reject) => (
    agent.
      get("/api/items/items-suggestions").
      type("form").
      set("Accept", "application/json").
      query({ search }).
      end(withPromiseCallback(resolve, reject))
  ))
);
