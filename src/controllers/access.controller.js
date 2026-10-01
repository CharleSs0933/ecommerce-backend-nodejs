import { CREATED } from "../core/success.response.js";
import * as accessService from "../services/access.service.js";

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
