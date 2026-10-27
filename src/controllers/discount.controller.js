import * as discountService from "../services/discount.service.js";
import { SuccessResponse } from "../core/success.response.js";

export async function createDiscountCode(req, res, next) {
  try {
    new SuccessResponse({
      message: "Create discount code successfully!",
      metadata: await discountService.createDiscountCode({
        payload: {
          ...req.body,
          shop_id: req.user.userId,
        },
      }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function getAllDiscountCodes(req, res, next) {
  try {
    new SuccessResponse({
      message: "Get list discount code successfully!",
      metadata: await discountService.getAllDiscountCodesByShop({
        ...req.query,
        shop_id: req.user.userId,
      }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function getDiscountAmount(req, res, next) {
  try {
    new SuccessResponse({
      message: "Get discount amount successfully!",
      metadata: await discountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function getDiscountCodesWithProducts(req, res, next) {
  try {
    new SuccessResponse({
      message: "Get list discount code successfully!",
      metadata: await discountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}
