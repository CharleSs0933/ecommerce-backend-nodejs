import cartModel from "../models/cart.model.js";

import { BadRequestError, NotFoundError } from "../core/error.response.js";
import * as productRepo from "../models/repositories/product.repo.js";

async function createUserCart({ user_id, product = {} }) {
  const query = { cart_user: user_id, cart_state: "active" };

  const updateOrInsert = {
      $addToSet: { cart_products: product },
      $inc: { cart_count_products: 1 },
    },
    options = { upsert: true, new: true };

  return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
}

async function updateUserCartQuantity({ user_id, product = {} }) {
  const { product_id, quantity } = product;
  const query = {
      cart_user: user_id,
      cart_state: "active",
      "cart_products.product_id": product_id,
    },
    updateSet = {
      $inc: { "cart_products.$.quantity": quantity },
    },
    options = { upsert: true, new: true };

  return await cartModel.findOneAndUpdate(query, updateSet, options);
}

export async function deleteCartItem({ user_id, product_id }) {
  const query = { cart_user: user_id, cart_state: "active" },
    updateSet = {
      $pull: {
        cart_products: {
          product_id,
        },
      },
    };

  return await cartModel.updateOne(query, updateSet);
}

export async function addToCart({ user_id, product = {} }) {
  const userCart = await cartModel.findOne({ cart_user: user_id });

  if (!userCart) {
    return await createUserCart({ user_id, product });
  }

  if (userCart.cart_products.length === 0) {
    userCart.cart_products.push(product);
    return await userCart.save();
  }

  return await updateUserCartQuantity({ user_id, product });
}

export async function addToCartV2({ user_id, shop_order_ids = {} }) {
  const { product_id, quantity, old_quantity } =
    shop_order_ids[0]?.item_products[0];

  const foundProduct = await productRepo.findProduct({ product_id });

  if (!foundProduct) throw new NotFoundError("Product not found");

  if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shop_id)
    throw new BadRequestError("Product not belong to the shop");

  if (quantity === 0) {
  }

  return await updateUserCartQuantity({
    user_id,
    product: {
      product_id,
      quantity: quantity - old_quantity,
    },
  });
}

export async function getListUserCart({ user_id }) {
  return await cartModel.findOne({ cart_user: +user_id }).lean();
}
