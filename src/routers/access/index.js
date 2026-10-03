import express from "express";
import * as accessController from "../../controllers/access.controller.js";

const router = express.Router();

// signUp
router.post("/shop/signup", accessController.signUp);
// login
router.post("/shop/login", accessController.login);

export default router;
