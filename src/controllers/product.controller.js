import * as productService from "../services/product.service.js";
import { SuccessResponse } from "../core/success.response.js";

export const createProduct = async (req, res) => {
  return new SuccessResponse({
    message: "Create product successfully",
    metadata: await productService.createProduct({
      type: req.body.product_type,
      payload: {
        ...req.body,
        product_shop: req.user.userId,
      },
    }),
  }).send(res);
};
