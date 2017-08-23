// @flow

type PerformLoginTypes = {
  Password: string;
  CaptchaSolution : string;
  Username: string;
};

type ChangePasswordTypes = { password: string; confirmation : string };

import agent from "superagent";

import { withPromiseCallback, normalizeArray } from "utility";

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

export const fetchUsers = () => new Promise((resolve, reject) => (
  agent.
    get("/api/users").
    type("json").
    end(
      withPromiseCallback(
        ({ Users }) => resolve(
          normalizeArray(Users)
        ),
        reject
      )
    )
));

export const fetchInstitutions = () => new Promise((resolve, reject) => (
  agent.
    get("/api/institutions").
    type("json").
    end(
      withPromiseCallback(
        ({ Institutions }) => resolve(
          normalizeArray(Institutions)
        ),
        reject
      )
    )
));


export const addInstitution = (data : any) => (
  new Promise(
    (resolve, reject) => (
      agent.
        put("/api/institutions").
        set("Accept", "application/json").
        send(data).
        end(
          withPromiseCallback(resolve, reject)
        )
    )
  )
);

export const modifyInstitution = (data : any) => (
  new Promise(
    (resolve, reject) => (
      agent.
        post(`/api/institutions/${data._id}`).
        set("Accept", "application/json").
        send(data).
        end(
          withPromiseCallback(resolve, reject)
        )
    )
  )
);

export const deleteInstitution = (id : number) => (
  new Promise(
    (resolve, reject) => (
      agent.
        del(`/api/institutions/${id}`).
        set("Accept", "application/json").
        end(withPromiseCallback(resolve, reject))
    )
  )
);

export const resetPassword = (id : string) => new Promise((resolve, reject) => (
  agent.
    post(`api/users/${id}/reset-password`).
    end(withPromiseCallback(resolve, reject))
));
