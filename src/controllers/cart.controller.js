import * as cartService from "../services/cart.service.js";
import { SuccessResponse } from "../core/success.response.js";

export async function addToCart(req, res, next) {
  try {
    new SuccessResponse({
      message: "Add to cart successfully!",
      metadata: await cartService.addToCart({
        ...req.body,
      }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function updateCart(req, res, next) {
  try {
    new SuccessResponse({
      message: "Update cart successfully!",
      metadata: await cartService.addToCartV2({
        ...req.body,
      }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function deleteCartItem(req, res, next) {
  try {
    new SuccessResponse({
      message: "Update cart successfully!",
      metadata: await cartService.deleteCartItem({
        ...req.body,
      }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function getCart(req, res, next) {
  try {
    new SuccessResponse({
      message: "Get cart successfully!",
      metadata: await cartService.getListUserCart(req.query),
    }).send(res);
  } catch (error) {
    next(error);
  }
}
