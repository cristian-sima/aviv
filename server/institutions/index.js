// @flow

import express from "express";

import { requireLogin, requireMaster } from "../utility";

import { getInstitutions, addInstitution } from "./operations";

const router = express.Router();

router.get("/", [
  requireLogin,
  requireMaster,
  getInstitutions,
]);

router.put("/", [
  requireLogin,
  requireMaster,
  addInstitution,
]);

export default router;
