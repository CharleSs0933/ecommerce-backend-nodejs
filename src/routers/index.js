import express from "express";
import accessRouter from "./access/index.js";
import { apiKey, permission } from "../auth/checkAuth.js";
const router = express.Router();

// Check apiKey
router.use(apiKey);
// Check Permission
router.use(permission("0000"));

router.use("/v1/api/", accessRouter);

export default router;
