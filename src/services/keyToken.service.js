import keyTokenModel from "../models/keyToken.model.js";
import { Types } from "mongoose";

export async function createKeyToken({
  userId,
  publicKey,
  privateKey,
  refreshToken,
}) {
  try {
    // Level 0
    // const tokens = await keyTokenModel.create({
    //   user: userId,
    //   publicKey,
    //   privateKey,
    // });

    // return tokens ? tokens.publicKey : null;

    // Level xxx
    const filter = { user: userId },
      update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
      options = { upsert: true, new: true };

    const tokens = await keyTokenModel.findOneAndUpdate(
      filter,
      update,
      options,
    );

    return tokens ? tokens.publicKey : null;
  } catch (error) {
    return error;
  }
}

export async function findByUserId({ userId }) {
  return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
}

export async function removeKeyById(id) {
  return await keyTokenModel.deleteOne({ _id: id });
}

export async function findByRefreshTokenUsed({ refreshToken }) {
  return await keyTokenModel
    .findOne({ refreshTokensUsed: refreshToken })
    .lean();
}

export async function findByRefreshToken({ refreshToken }) {
  return await keyTokenModel.findOne({ refreshToken });
}

export async function deleteKeyByUserId({ userId }) {
  return await keyTokenModel.deleteOne({
    user: new Types.ObjectId(userId),
  });
}
