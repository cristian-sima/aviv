// @flow

import express from "express";

import { requireLogin, requireMaster } from "../utility";

import { getInstitutions, addInstitution, modifyInstitution, deleteInstitution } from "./operations";

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

router.post("/:institutionID", [
  requireLogin,
  modifyInstitution,
]);

router.delete("/:institutionID", [
  requireLogin,
  deleteInstitution,
]);

export default router;
