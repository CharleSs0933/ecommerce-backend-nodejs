import express from "express";
import * as cartController from "../../controllers/cart.controller.js";

const router = express.Router();

router.post("/", cartController.addToCart);
router.delete("/", cartController.deleteCartItem);
router.post("/update", cartController.updateCart);
router.get("/", cartController.getCart);

export default router;
