import {
  productModel,
  electronicsModel,
  clothingModel,
  furnitureModel,
} from "../../models/product.model.js";
import { Types } from "mongoose";
import { getSelectData, unGetSelectData } from "../../utils/index.js";

async function queryProduct({ query, limit, skip }) {
  return await productModel
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatdeAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
}

export async function findAllDraftsForShop({ query, limit, skip }) {
  return await queryProduct({ query, limit, skip });
}

export async function findAllPublishForShop({ query, limit, skip }) {
  return await queryProduct({ query, limit, skip });
}

export async function findAllProducts({ limit, sort, page, filter, select }) {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await productModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
}

export async function findProduct({ product_id, unSelect }) {
  return await productModel
    .findById(product_id)
    .select(unGetSelectData(unSelect))
    .lean();
}

export async function searchProductByUser({ keySearch }) {
  const regexSearch = new RegExp(keySearch);
  const results = await productModel
    .find(
      {
        isPublish: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } },
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return results;
}

export async function publishProductByShop({ product_id, product_shop }) {
  const foundShop = await productModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublish = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
}

export async function unPublishProductByShop({ product_id, product_shop }) {
  const foundShop = await productModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublish = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
}

export async function updateProductById({
  product_id,
  payload,
  model,
  isNew = true,
}) {
  return await model.findByIdAndUpdate(product_id, payload, { new: isNew });
}
