import { CREATED, SuccessResponse } from "../core/success.response.js";
import * as accessService from "../services/access.service.js";

export async function login(req, res, next) {
  try {
    new SuccessResponse({
      metadata: await accessService.login(req.body),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function signUp(req, res, next) {
  try {
    new CREATED({
      message: "Registered successfully!",
      metadata: await accessService.signUp(req.body),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    new SuccessResponse({
      message: "Logout successfully!",
      metadata: await accessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}
