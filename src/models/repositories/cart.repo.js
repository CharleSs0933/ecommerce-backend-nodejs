import { convertToObjectId } from "../../utils/index.js";
import cartModel from "../cart.model.js";

export async function findCartById(cart_id) {
  return await cartModel
    .findOne({
      _id: convertToObjectId(cart_id),
      cart_state: "active",
    })
    .lean();
}
