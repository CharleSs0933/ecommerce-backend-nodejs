import express from "express";
import accessRouter from "./access/index.js";
import productRouter from "./product/index.js";
import discountRouter from "./discount/index.js";
import cartRouter from "./cart/index.js";

import { apiKey, permission } from "../auth/checkAuth.js";
const router = express.Router();

// Check apiKey
// router.use(apiKey);
// Check Permission
// router.use(permission("0000"));

router.use("/v1/api/discount", discountRouter);
router.use("/v1/api/cart", cartRouter);
router.use("/v1/api/product", productRouter);
router.use("/v1/api/", accessRouter);

export default router;
