import express from "express";
import * as productController from "../../controllers/product.controller.js";
import { authentication } from "../../auth/authUtils.js";

const router = express.Router();

router.get("/search/:keySearch", productController.getListSearchProduct);

// authentication
router.use(authentication);
// ============================ //
router.post("/", productController.createProduct);
router.post("/publish/:id", productController.publishProductByShop);
router.post("/unpublish/:id", productController.publishProductByShop);

// QUERY //
router.get("/drafts/all", productController.getAllDraftsForShop);
router.get("/publish/all", productController.getAllPublishForShop);

export default router;
