import * as checkoutService from "../services/checkout.service.js";
import { SuccessResponse } from "../core/success.response.js";

export async function checkoutReview(req, res, next) {
  try {
    new SuccessResponse({
      message: "Checkout review successfully!",
      metadata: await checkoutService.checkoutReview({
        ...req.body,
      }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}
