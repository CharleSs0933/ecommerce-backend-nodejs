import * as productService from "../services/product.service.js";
import { SuccessResponse } from "../core/success.response.js";

export async function createProduct(req, res, next) {
  try {
    new SuccessResponse({
      message: "Create product successfully",
      metadata: await productService.createProduct({
        type: req.body.product_type,
        payload: {
          ...req.body,
          product_shop: req.user.userId,
        },
      }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    new SuccessResponse({
      message: "Update product successfully",
      metadata: await productService.updateProduct({
        type: req.body.product_type,
        product_id: req.params.id,
        payload: { ...req.body, product_shop: req.user.userId },
      }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function publishProductByShop(req, res, next) {
  try {
    new SuccessResponse({
      message: "Update product successfully",
      metadata: await productService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function unPublishProductByShop(req, res, next) {
  try {
    new SuccessResponse({
      message: "Update product successfully",
      metadata: await productService.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

/**
 * @description Get all Drafts for shop
 * @param {Number} limit
 * @param {Number} skip
 * @returns { JSON }
 */
export async function getAllDraftsForShop(req, res, next) {
  try {
    new SuccessResponse({
      message: "Get list successfully",
      metadata: await productService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function getAllPublishForShop(req, res, next) {
  try {
    new SuccessResponse({
      message: "Get list successfully",
      metadata: await productService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function getListSearchProduct(req, res, next) {
  try {
    new SuccessResponse({
      message: "Get list successfully",
      metadata: await productService.searchProducts(req.params),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function getAllProducts(req, res, next) {
  try {
    new SuccessResponse({
      message: "Get list successfully",
      metadata: await productService.findAllProducts(req.query),
    }).send(res);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    new SuccessResponse({
      message: "Get product successfully",
      metadata: await productService.findProduct({ product_id: req.params.id }),
    }).send(res);
  } catch (error) {
    next(error);
  }
}
