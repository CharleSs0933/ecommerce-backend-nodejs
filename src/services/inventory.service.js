import { BadRequestError } from "../core/error.response.js";
import inventoryModel from "../models/inventory.model.js";

import * as productRepo from "../models/repositories/product.repo.js";

export async function addStockToInventory({
  stock,
  product_id,
  shop_id,
  location = "HCM City",
}) {
  const product = await productRepo.findProduct({
    product_id,
  });

  if (!product) throw new BadRequestError("Product not found");

  const query = {
      inven_shop: shop_id,
      inven_product: product_id,
    },
    updateSet = {
      $inc: { inven_stock: stock },
      $set: { inven_location: location },
    },
    options = { upsert: true, new: true };

  return await inventoryModel.findOneAndUpdate(query, updateSet, options);
}
