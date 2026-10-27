import { BadRequestError, NotFoundError } from "../core/error.response.js";
import { convertToObjectId } from "../utils/index.js";

import discountModel from "../models/discount.model.js";
import * as productRepo from "../models/repositories/product.repo.js";
import * as discountRepo from "../models/repositories/discount.repo.js";

// 1 - Generate Discount Code [Shop | Admin]
export async function createDiscountCode({ payload }) {
  const {
    code,
    start_date,
    end_date,
    is_active,
    shop_id,
    min_order_value,
    product_ids,
    applies_to,
    name,
    description,
    type,
    value,
    max_value,
    max_uses,
    uses_count,
    max_uses_per_user,
  } = payload;

  if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    throw new BadRequestError("Discount code has expired!");
  }

  if (new Date(start_date) >= new Date(end_date)) {
    throw new BadRequestError("Start date must be less than end date!");
  }

  const foundDiscount = await discountModel.findOne({
    discount_code: code,
    discount_shop: convertToObjectId(shop_id),
  });

  if (foundDiscount && foundDiscount.discount_is_active) {
    throw new BadRequestError("Discount code already exists!");
  }

  const newDiscount = await discountModel.create({
    discount_code: code,
    discount_start_date: new Date(start_date),
    discount_end_date: new Date(end_date),
    discount_is_active: is_active,
    discount_shop: shop_id,
    discount_min_order_value: min_order_value || 0,
    discount_applies_to: applies_to,
    discount_name: name,
    discount_description: description,
    discount_type: type,
    discount_value: value,
    discount_max_value: max_value,
    discount_max_uses: max_uses,
    discount_uses_count: uses_count,
    discount_max_uses_per_user: max_uses_per_user,
    discount_product_ids: applies_to === "all" ? [] : product_ids,
  });

  return newDiscount;
}

// 2 - Get discount amount [User]
export async function getAllDiscountCodesWithProduct({
  code,
  shop_id,
  user_id,
  limit,
  page,
}) {
  const foundDiscount = await discountModel.findOne({
    discount_code: code,
    discount_shop: convertToObjectId(shop_id),
  });

  if (!foundDiscount || !foundDiscount.discount_is_active) {
    throw new NotFoundError("Discount code not found!");
  }

  const { discount_applies_to, discount_product_ids } = foundDiscount;

  let products = [];
  if (discount_applies_to === "all") {
    // Get All Product
    products = await productRepo.findAllProducts({
      filter: {
        product_shop: convertToObjectId(shop_id),
        isPublish: true,
      },
      limit: +limit,
      page: +page,
      sort: "ctime",
      select: ["product_name"],
    });
  }

  if (discount_applies_to === "specific") {
    // Get Specific Product
    products = await productRepo.findAllProducts({
      filter: {
        _id: { $in: discount_product_ids },
        // product_shop: convertToObjectId(shop_id),
        isPublish: true,
      },
      limit: +limit,
      page: +page,
      sort: "ctime",
      select: ["product_name"],
    });
  }

  return products;
}

// 3 - Get all discount codes [User | Shop]
export async function getAllDiscountCodesByShop({ limit, page, shop_id }) {
  const discounts = await discountRepo.findAllDiscountCodesUnSelect({
    limit: +limit,
    page: +page,
    filter: {
      discount_shop: convertToObjectId(shop_id),
      discount_is_active: true,
    },
    unSelect: ["__v", "discount_shop"],
    model: discountModel,
  });

  return discounts;
}

// 4 - Verify discount code [User]
export async function getDiscountAmount({ code, user_id, shop_id, products }) {
  const foundDiscount = await discountRepo.checkDiscountExists({
    model: discountModel,
    filter: {
      discount_code: code,
      discount_shop: convertToObjectId(shop_id),
    },
  });

  if (!foundDiscount) {
    throw new NotFoundError("Discount does not exist!");
  }

  const {
    discount_is_active,
    discount_max_uses,
    discount_value,
    discount_start_date,
    discount_end_date,
    discount_min_order_value,
    discount_max_uses_per_user,
    discount_users_used,
    discount_type,
  } = foundDiscount;

  if (!discount_is_active) {
    throw new BadRequestError("Discount code has expired!");
  }

  if (!discount_max_uses) {
    throw new BadRequestError("Discount are out!");
  }

  if (
    new Date() < new Date(discount_start_date) ||
    new Date() > new Date(discount_end_date)
  ) {
    throw new BadRequestError("Discount code has expired!");
  }

  let totalOrder = 0;
  if (discount_min_order_value > 0) {
    // get total
    totalOrder = products.reduce((acc, product) => {
      return acc + product.quantity * product.price;
    }, 0);

    if (totalOrder < discount_min_order_value) {
      throw new BadRequestError(
        `Discount require min order value of ${discount_min_order_value}!`,
      );
    }
  }

  if (discount_max_uses_per_user > 0) {
    const userUseDiscount = discount_users_used.find(
      (user) => user.user_id === user_id,
    );

    if (userUseDiscount) {
    }
  }

  const amount =
    discount_type === "fixed_amount"
      ? discount_value
      : totalOrder * (discount_value / 100);

  return {
    totalOrder,
    discount: amount,
    totalPrice: totalOrder - amount,
  };
}

// 5 - Delete discount code [Shop | Admin]
export async function deleteDiscountCode({ shop_id, code }) {
  const deleted = await discountModel.findOneAndDelete({
    discount_code: code,
    discount_shop: convertToObjectId(shop_id),
  });

  return deleted;
}
// 6 - Cancel discount code [User]
export async function cancelDiscountCode({ code, shop_id, user_id }) {
  const foundDiscount = await discountRepo.checkDiscountExists({
    model: discountModel,
    filter: {
      discount_code: code,
      discount_shop: convertToObjectId(shop_id),
    },
  });

  if (!foundDiscount) {
    throw new NotFoundError("Discount does not exist!");
  }

  const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
    $pull: { discount_users_used: user_id },
    $inc: { discount_max_uses: 1, discount_uses_count: -1 },
  });

  return result;
}
