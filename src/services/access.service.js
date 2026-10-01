import { createTokenPair } from "../auth/authUtils.js";
import { BadRequestError } from "../core/error.response.js";
import shopModel from "../models/shop.model.js";
import { getInfoData } from "../utils/index.js";
import * as keyTokenService from "./keyToken.service.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

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
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    // Public key CryptoGraphy Standards !

    const publicKeyString = await keyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
    });

    if (!publicKeyString) {
      throw new BadRequestError("Error: PublicKeyString error!");
    }

    // Created token pair
    const tokens = await createTokenPair(
      { userId: newShop._id, email },
      publicKeyString,
      privateKey,
    );

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
