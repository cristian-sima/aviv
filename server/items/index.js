// @flow

import express from "express";

import { requireLogin } from "../utility";

import {
  getItemsToAdvice,
} from "./operations";

const router = express.Router();

router.get("/items-to-advice", [
  requireLogin,
  getItemsToAdvice,
]);

export default router;
