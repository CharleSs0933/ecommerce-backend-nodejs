import express from "express";
import * as accessController from "../../controllers/access.controller.js";
import { authentication } from "../../auth/authUtils.js";

const router = express.Router();

// signUp
router.post("/shop/signup", accessController.signUp);
// login
router.post("/shop/login", accessController.login);

// authentication
router.use(authentication);
// ======================= //
router.post("/shop/logout", accessController.logout);
router.post("/shop/refresh-token", accessController.handleRefreshToken);

export default router;
