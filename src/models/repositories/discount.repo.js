import { getSelectData, unGetSelectData } from "../../utils/index.js";

export async function findAllDiscountCodesUnSelect({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();
}

export async function findAllDiscountCodesSelect({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
}

export async function checkDiscountExists({ model, filter }) {
  return await model.findOne(filter).lean().exec();
}
