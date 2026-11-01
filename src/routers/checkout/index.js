import express from "express";
import * as checkoutController from "../../controllers/checkout.controller.js";

const router = express.Router();

router.post("/review", checkoutController.checkoutReview);

export default router;
