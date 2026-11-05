import { convertToObjectId } from "../../utils/index.js";
import inventoryModel from "../inventory.model.js";

export async function insertInventory({
  product_id,
  shop_id,
  stock,
  location = "unknown",
}) {
  return await inventoryModel.create({
    inven_product: product_id,
    inven_location: location,
    inven_stock: stock,
    inven_shop: shop_id,
  });
}

export async function reservationInventory({ product_id, quantity, cart_id }) {
  const query = {
      inven_product: convertToObjectId(product_id),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: { inven_stock: -quantity },
      $push: {
        inven_reservations: { quantity, cart_id, createOn: new Date() },
      },
    },
    options = { upsert: true, new: true };

  return await inventoryModel.updateOne(query, updateSet);
}
