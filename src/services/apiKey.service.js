import apiKeyModel from "../models/apiKey.model";

export async function findById(key) {
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
}
