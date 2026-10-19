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
