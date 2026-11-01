import * as cartRepo from "../models/repositories/cart.repo.js";
import * as productRepo from "../models/repositories/product.repo.js";

import { BadRequestError, NotFoundError } from "../core/error.response.js";
import { getDiscountAmount } from "./discount.service.js";

export async function checkoutReview({ cart_id, user_id, shop_order_ids }) {
  const foundCart = await cartRepo.findCartById(cart_id);

  if (!foundCart) throw new NotFoundError("Cart not found");

  const checkout_order = {
      total_price: 0, // Tong tien hang
      fee_ship: 0, // Phi ship
      total_discount: 0, // Tong tien giam gia
      total_checkout: 0, // Tong tien thanh toan
    },
    shop_order_ids_new = [];

  for (let i = 0; i < shop_order_ids.length; i++) {
    const {
      shop_id,
      shop_discounts = [],
      item_products = [],
    } = shop_order_ids[i];

    const checkProduct = await productRepo.checkProduct({
      products: item_products,
    });

    if (!checkProduct[0]) throw new NotFoundError("Order Wrong !!!");

    // Tong tien hang
    const checkoutPrice = checkProduct.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    // Tong tien truoc khi xu ly
    checkout_order.total_price += checkoutPrice;

    const itemCheckout = {
      shop_id,
      shop_discounts,
      price_raw: checkoutPrice,
      price_apply_discount: checkoutPrice,
      item_products: checkProduct,
    };

    // Neu shop_discounts co ton tai thi xu ly giam gia
    if (shop_discounts.length > 0) {
      const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
        code: shop_discounts[0].code,
        user_id,
        shop_id,
        products: checkProduct,
      });

      checkout_order.total_discount += discount;

      if (discount > 0) {
        itemCheckout.price_apply_discount = checkoutPrice - discount;
      }
    }

    checkout_order.total_checkout += itemCheckout.price_apply_discount;

    shop_order_ids_new.push(itemCheckout);
  }

  return {
    shop_order_ids,
    shop_order_ids_new,
    checkout_order,
  };
}
