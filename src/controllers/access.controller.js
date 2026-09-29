import * as accessService from "../services/access.service.js";

export async function signUp(req, res, next) {
  try {
    console.log(`[P]::signUp::`, req.body);

    return res.status(201).json(await accessService.signUp(req.body));
  } catch (error) {
    next(error);
  }
}
