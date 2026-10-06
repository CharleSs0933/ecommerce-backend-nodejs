import { BadRequestError } from "../core/error.response.js";
import {
  productModel,
  clothingModel,
  electronicsModel,
  furnitureModel,
} from "../models/product.model.js";

// Factory Pattern
/*
class ProductFactory {
  static async createProduct({ type, payload }) {
    switch (type) {
      case "Clothing":
        return new Clothing(payload).createProduct();
      case "Electronic":
        return new Electronic(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid product type: ${type}`);
    }
  }
}

// Define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  //Create new product
  async createProduct() {
    return await productModel.create(this);
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError("Create new clothing error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create(this.product_attributes);
    if (!newElectronic)
      throw new BadRequestError("Create new electronic error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new product error");

    return newProduct;
  }
}
*/

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

  if (!newProduct) {
    throw new BadRequestError("Create new product error");
  }

  return newProduct;
}

/**
 * Create Clothing product
 */
async function createClothing(payload) {
  const { product_attributes } = payload;

  const newClothing = await clothingModel.create(product_attributes);

  if (!newClothing) {
    throw new BadRequestError("Create new clothing error");
  }

  return createBaseProduct(payload);
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
  Clothing: createClothing,
  Electronics: createElectronics,
  Furniture: createFurniture,
};

export async function createProduct({ type, payload }) {
  const createProductByType = productRegistry[type];

  if (!createProductByType) {
    throw new BadRequestError(`Invalid product type: ${type}`);
  }

  return createProductByType(payload);
}
