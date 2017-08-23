// @flow

import express from "express";

import { requireLogin, requireMaster } from "../utility";

import { getInstitutions } from "./operations";

const router = express.Router();

router.get("/", [
  requireLogin,
  requireMaster,
  getInstitutions,
]);

export default router;
