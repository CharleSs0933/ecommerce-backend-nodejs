import shopModel from "../models/shop.model.js";

export async function findByEmail({
  email,
  select = { email: 1, password: 2, roles: 1, name: 1, roles: 1 },
}) {
  return await shopModel.findOne({ email }).select(select).lean();
}
