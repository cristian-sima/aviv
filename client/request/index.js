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

export const performLogin = (data : PerformLoginTypes) : Promise<any> => new Promise((resolve, reject) => (
  agent.
    post("/api/login").
    send(data).
    type("form").
    end(withPromiseCallback(resolve, reject))
));

export const changePassword = (data : ChangePasswordTypes) : Promise<any> => new Promise((resolve, reject) => (
  agent.
    post("/api/auth/changePassword").
    send(data).
    type("form").
    end(withPromiseCallback(resolve, reject))
));

export const signOff = () : Promise<any> => new Promise((resolve, reject) => (
  agent.
    post("/api/auth/signOff").
    end(withPromiseCallback(resolve, reject))
));

export const performReconnect = () : Promise<any> => new Promise((resolve, reject) => (
  agent.
    post("/api/auth/reconnect").
    end(withPromiseCallback(resolve, reject))
));

export const fetchInstitutions = () : Promise<any> => new Promise((resolve, reject) => (
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

export const addInstitution = (data : any) : Promise<any> => (
  new Promise((resolve, reject) => (
    agent.
      put("/api/institutions").
      set("Accept", "application/json").
      send(data).
      end(withPromiseCallback(resolve, reject))
  ))
);

export const modifyInstitution = (data : any) : Promise<any> => (
  new Promise((resolve, reject) => (
    agent.
      post(`/api/institutions/${data._id}`).
      set("Accept", "application/json").
      send(data).
      end(withPromiseCallback(resolve, reject))
  ))
);

export const deleteInstitution = (id : number) : Promise<any> => (
  new Promise((resolve, reject) => (
    agent.
      del(`/api/institutions/${id}`).
      set("Accept", "application/json").
      end(withPromiseCallback(resolve, reject))
  ))
);

export const addUser = (data : any) : Promise<any> => (
  new Promise((resolve, reject) => (
    agent.
      put("/api/users").
      set("Accept", "application/json").
      send(data).
      end(withPromiseCallback(resolve, reject))
  ))
);

export const modifyUser = (data : any) : Promise<any> => (
  new Promise((resolve, reject) => (
    agent.
      post(`/api/users/${data._id}`).
      set("Accept", "application/json").
      send(data).
      end(withPromiseCallback(resolve, reject))
  ))
);

export const deleteUser = (id : number) : Promise<any> => (
  new Promise((resolve, reject) => (
    agent.
      del(`/api/users/${id}`).
      set("Accept", "application/json").
      end(withPromiseCallback(resolve, reject))
  ))
);

export const resetPassword = (id : string) : Promise<any> => new Promise((resolve, reject) => (
  agent.
    post(`api/users/${id}/reset-password`).
    end(withPromiseCallback(resolve, reject))
));

export const fetchItemsToAdviceFrom = (lastID: string) : Promise<any> => (
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

export const fetchItemsAdvicedFrom = (lastID: string) : Promise<any> => (
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

export const fetchItemsStartedFrom = (lastID: string) : Promise<any> => (
  new Promise((resolve, reject) => (
    agent.
      get("/api/items/items-started").
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

export const fetchItemsClosedFrom = (lastID: string) : Promise<any> => (
  new Promise((resolve, reject) => (
    agent.
      get("/api/items/items-closed").
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

export const fetchItemDetails = (id : string) : Promise<any> => (
  new Promise((resolve, reject) => (
    agent.
      get(`/api/items/item/${id}`).
      set("Accept", "application/json").
      end(checkForErrorsThenNormalizeItemDetails(resolve, reject))
  ))
);

export const fetchSuggestions = (search : string) : Promise<any> => (
  new Promise((resolve, reject) => (
    agent.
      get("/api/items/items-suggestions").
      type("form").
      set("Accept", "application/json").
      query({ search }).
      end(withPromiseCallback(resolve, reject))
  ))
);
