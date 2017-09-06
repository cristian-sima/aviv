// @flow

import express from "express";

import { requireLogin } from "../utility";

import {
  getItemsToAdvice,
  getItemsStarted,
  getItemDetails,
  getItemsAdviced,
  getItemsClosed,
} from "./get";

import { getSuggestions } from "./suggestions";

const router = express.Router();

router.get("/items-to-advice", [
  requireLogin,
  getItemsToAdvice,
]);

router.get("/items-started", [
  requireLogin,
  getItemsStarted,
]);

router.get("/items-adviced", [
  requireLogin,
  getItemsAdviced,
]);

router.get("/item/:itemID", [
  requireLogin,
  getItemDetails,
]);

router.get("/items-suggestions", [
  requireLogin,
  getSuggestions,
]);

router.get("/items-closed", [
  requireLogin,
  getItemsClosed,
]);

export default router;
