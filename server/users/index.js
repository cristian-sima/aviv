// @flow

import express from "express";

import { requireLogin, requireMaster } from "../utility";

import { getUsers, resetPassword } from "./operations";

const router = express.Router();

router.get("/", [
  requireLogin,
  requireMaster,
  getUsers,
]);
router.post("/:accountID/reset-password", [
  requireLogin,
  resetPassword,
]);

export default router;
