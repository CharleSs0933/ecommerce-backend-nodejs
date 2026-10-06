import express from "express";
import * as productController from "../../controllers/product.controller.js";
import { authentication } from "../../auth/authUtils.js";

const router = express.Router();

// authentication
router.use(authentication);
// ============================ //
router.post("/", productController.createProduct);

export default router;
