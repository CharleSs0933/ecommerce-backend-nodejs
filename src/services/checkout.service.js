import * as cartRepo from "../models/repositories/cart.repo.js";
import * as productRepo from "../models/repositories/product.repo.js";

import * as redisService from "./redis.service.js";

import orderModel from "../models/order.model.js";

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

export async function orderByUser({
  shop_order_ids,
  cart_id,
  user_id,
  user_address = {},
  user_payment = {},
}) {
  const { checkout_order, shop_order_ids_new } = await checkoutReview({
    cart_id,
    user_id,
    shop_order_ids,
  });

  const products = shop_order_ids_new.flatMap((order) => order.item_products);

  console.log(`[1]::`, products);

  const acquireProducts = [];

  for (let i = 0; i < products.length; i++) {
    const { product_id, quantity } = products[i];

    const keyLock = await redisService.acquireLock({
      product_id,
      quantity,
      cart_id,
    });

    acquireProducts.push(keyLock ? true : false);

    if (keyLock) {
      await redisService.releaseLock(keyLock);
    }
  }

  // Check neu co 1 san pham khong du so luong thi bao loi
  if (acquireProducts.includes(false)) {
    throw new BadRequestError("Product is out of stock");
  }

  const newOrder = await orderModel.create({
    order_user_id: user_id,
    order_checkout: checkout_order,
    order_shipping: user_address,
    order_payment: user_payment,
    order_products: shop_order_ids_new,
  });

  // Truong hop thanh cong thi remove product trong cart
  if (newOrder) {
  }

  return newOrder;
}

export async function getOrdersByUser() {}

export async function getOrderDetailByUser() {}

export async function cancelOrderByUser() {}

export async function updateOrderStatusByShop() {}
