// @flow

import express from "express";

import { requireLogin } from "../utility";

import {
  getItemsToAdvice,
  getItemDetails,
} from "./operations";

const router = express.Router();

router.get("/items-to-advice", [
  requireLogin,
  getItemsToAdvice,
]);

router.get("/item/:itemID", [
  requireLogin,
  getItemDetails,
]);

export default router;
