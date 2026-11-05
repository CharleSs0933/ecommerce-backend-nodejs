import express from "express";
import * as inventoryController from "../../controllers/inventory.controller.js";
import { authentication } from "../../auth/authUtils.js";

const router = express.Router();

router.use(authentication);
router.post("", inventoryController.addStock);

export default router;
