// @flow

import express from "express";

import { requireLogin } from "../utility";

import {
  getItemsToAdvice,
  getItemsStarted,
  getItemDetails,
} from "./operations";

const router = express.Router();

router.get("/items-to-advice", [
  requireLogin,
  getItemsToAdvice,
]);

router.get("/items-started", [
  requireLogin,
  getItemsStarted,
]);

router.get("/item/:itemID", [
  requireLogin,
  getItemDetails,
]);

export default router;
