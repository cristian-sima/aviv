// @flow

import express from "express";

import { requireLogin, requireMaster } from "../utility";

import {
  getUsers,
  resetPassword,
  addUser,
  modifyUser,
  deleteUser,
} from "./operations";

const router = express.Router();

router.get("/", [
  requireLogin,
  requireMaster,
  getUsers,
]);

router.put("/", [
  requireLogin,
  requireMaster,
  addUser,
]);

router.post("/:userID", [
  requireLogin,
  modifyUser,
]);

router.delete("/:userID", [
  requireLogin,
  deleteUser,
]);

router.post("/:userID/reset-password", [
  requireLogin,
  resetPassword,
]);


export default router;
