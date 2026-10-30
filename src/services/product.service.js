import { BadRequestError } from "../core/error.response.js";
import {
  productModel,
  clothingModel,
  electronicsModel,
  furnitureModel,
} from "../models/product.model.js";
import * as productRepo from "../models/repositories/product.repo.js";
import * as inventoryRepo from "../models/repositories/inventory.repo.js";
import {
  removeUndefinedObject,
  updateNestedObjectParser,
} from "../utils/index.js";

//#region POST

/**
 * Create base product
 */
async function createBaseProduct(payload) {
  const {
    _id,
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  } = payload;

  const newProduct = await productModel.create({
    _id,
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  });

  if (newProduct) {
    // Add product_stock in inventory collection
    await inventoryRepo.insertInventory({
      product_id: newProduct._id,
      shop_id: product_shop,
      stock: product_quantity,
    });
  }

  return newProduct;
}

/**
 * Update base product
 */
async function updateBaseProduct({ product_id, payload }) {
  return await productRepo.updateProductById({
    product_id,
    payload: updateNestedObjectParser(payload),
    model: productModel,
  });
}

/**
 * Create Clothing product
 */
async function createClothing(payload) {
  const { product_attributes, product_shop } = payload;

  const newClothing = await clothingModel.create({
    ...product_attributes,
    product_shop,
  });

  if (!newClothing) {
    throw new BadRequestError("Create new clothing error");
  }

  return createBaseProduct({ ...payload, _id: newClothing._id });
}

async function updateClothing({ product_id, payload }) {
  const { product_attributes } = payload;
  if (product_attributes) {
    await productRepo.updateProductById({
      product_id,
      payload: updateNestedObjectParser(product_attributes),
      model: clothingModel,
    });
  }

  return updateBaseProduct({ product_id, payload });
}

/**
 * Create Electronic product
 */
async function createElectronics(payload) {
  const { product_attributes, product_shop } = payload;

  const newElectronic = await electronicsModel.create({
    ...product_attributes,
    product_shop,
  });

  if (!newElectronic) {
    throw new BadRequestError("Create new electronics error");
  }

  return createBaseProduct({ ...payload, _id: newElectronic._id });
}

/**
 * Create Furniture product
 */
async function createFurniture(payload) {
  const { product_attributes, product_shop } = payload;

  const newFurniture = await furnitureModel.create({
    ...product_attributes,
    product_shop,
  });

  if (!newFurniture) {
    throw new BadRequestError("Create new furniture error");
  }

  return createBaseProduct({ ...payload, _id: newFurniture._id });
}

/**
 * Product factory
 */
const productRegistry = {
  Clothing: { create: createClothing, update: updateClothing },
  Electronics: { create: createElectronics, update: updateClothing },
  Furniture: { create: createFurniture, update: updateClothing },
};

export async function createProduct({ type, payload }) {
  const createProductByType = productRegistry[type]?.create;

  if (!createProductByType) {
    throw new BadRequestError(`Invalid product type: ${type}`);
  }

  return createProductByType(payload);
}

export async function updateProduct({ type, payload, product_id }) {
  const updateProductByType = productRegistry[type]?.update;

  if (!updateProductByType) {
    throw new BadRequestError(`Invalid product type: ${type}`);
  }

  return updateProductByType({
    payload: removeUndefinedObject(payload),
    product_id,
  });
}

//#endregion

//#region PUT
export async function publishProductByShop({ product_shop, product_id }) {
  return await productRepo.publishProductByShop({ product_id, product_shop });
}

export async function unPublishProductByShop({ product_shop, product_id }) {
  return await productRepo.unPublishProductByShop({ product_id, product_shop });
}

//#endregion

//#region QUERY
export async function findAllDraftsForShop({
  product_shop,
  limit = 50,
  skip = 0,
}) {
  const query = { product_shop, isDraft: true };

  return await productRepo.findAllDraftsForShop({ query, limit, skip });
}

export async function findAllPublishForShop({
  product_shop,
  limit = 50,
  skip = 0,
}) {
  const query = { product_shop, isPublish: true };

  return await productRepo.findAllPublishForShop({ query, limit, skip });
}

export async function searchProducts({ keySearch }) {
  return await productRepo.searchProductByUser({ keySearch });
}

export async function findAllProducts({
  limit = 50,
  sort = "ctime",
  page = 1,
  filter = { isPublish: true },
}) {
  return await productRepo.findAllProducts({
    limit,
    sort,
    page,
    filter,
    select: ["product_name", "product_price", "product_thumb", "product_shop"],
  });
}

export async function findProduct({ product_id }) {
  return await productRepo.findProduct({ product_id, unSelect: ["__v"] });
}
//#endregion
