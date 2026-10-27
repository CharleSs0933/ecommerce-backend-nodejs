import express from "express";
import * as discountController from "../../controllers/discount.controller.js";
import { authentication } from "../../auth/authUtils.js";

const router = express.Router();

// Get Amount a discount code
router.post("/amount", discountController.getDiscountAmount);
router.get(
  "/list_product_code",
  discountController.getDiscountCodesWithProducts,
);

// authentication
router.use(authentication);
// ======================= //
router.post("/", discountController.createDiscountCode);
router.get("/", discountController.getAllDiscountCodes);

export default router;
