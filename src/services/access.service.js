import { createTokenPair, verifyJWT } from "../auth/authUtils.js";
import {
  AuthFailureError,
  BadRequestError,
  ForbiddenError,
} from "../core/error.response.js";
import shopModel from "../models/shop.model.js";
import { getInfoData } from "../utils/index.js";
import * as keyTokenService from "./keyToken.service.js";
import * as shopService from "./shop.service.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { findByEmail } from "./shop.service.js";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

export async function logout({ keyStore }) {
  const delKey = await keyTokenService.removeKeyById(keyStore._id);
  return delKey;
}

export async function login({ email, password, refreshToken = null }) {
  // Check email exists
  const foundShop = await findByEmail({ email });

  if (!foundShop) {
    throw new BadRequestError("Shop not registered!");
  }

  // Match password
  const match = await bcrypt.compare(password, foundShop.password);

  if (!match) {
    throw new AuthFailureError("Authentication error");
  }

  // Create AT vs RT and save
  const privateKey = crypto.randomBytes(64).toString("hex");
  const publicKey = crypto.randomBytes(64).toString("hex");

  // Generate tokens
  const tokens = await createTokenPair(
    { userId: foundShop._id, email },
    publicKey,
    privateKey,
  );

  await keyTokenService.createKeyToken({
    userId: foundShop._id,
    refreshToken: tokens.refreshToken,
    publicKey,
    privateKey,
  });

  // Return data
  return {
    shop: getInfoData({
      fields: ["_id", "name", "email"],
      object: foundShop,
    }),
    tokens,
  };
}

export async function signUp({ name, email, password }) {
  // Check email exists
  const holderShop = await shopModel.findOne({ email }).lean();

  if (holderShop) {
    throw new BadRequestError("Error: Shop already registered!");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newShop = await shopModel.create({
    name,
    email,
    password: passwordHash,
    roles: [RoleShop.SHOP],
  });

  if (newShop) {
    // Created PrivateKey, PublicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // Created token pair
    const tokens = await createTokenPair(
      { userId: newShop._id, email },
      publicKey,
      privateKey,
    );

    await keyTokenService.createKeyToken({
      userId: newShop._id,
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
    });

    return {
      code: 201,
      metadata: {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      },
    };
  }

  return {
    code: 200,
    message: null,
  };
}

export async function handleRefreshToken({ refreshToken, user, keyStore }) {
  const { userId, email } = user;
  if (keyStore.refreshTokensUsed.includes(refreshToken)) {
    await keyTokenService.deleteKeyByUserId({ userId });
    throw new ForbiddenError("Something wrong! Please re-login!");
  }

  if (keyStore.refreshToken !== refreshToken) {
    throw new AuthFailureError("Shop not registered!");
  }

  const foundShop = await shopService.findByEmail({ email });

  if (!foundShop) {
    throw new AuthFailureError("Shop not registered!");
  }

  // Create new token pair
  const tokens = await createTokenPair(
    { userId, email },
    keyStore.publicKey,
    keyStore.privateKey,
  );

  // Update token
  await keyStore.updateOne({
    $set: { refreshToken: tokens.refreshToken },
    $addToSet: { refreshTokensUsed: refreshToken }, // Add the old refresh token to the list of used tokens
  });

  return {
    user: { userId, email },
    tokens,
  };
}
