import keyTokenModel from "../models/keyToken.model.js";

export async function createKeyToken({ userId, publicKey }) {
  try {
    const publicKeyString = publicKey.toString();
    const tokens = await keyTokenModel.create({
      user: userId,
      publicKey: publicKeyString,
    });

    return tokens ? tokens.publicKey : null;
  } catch (error) {
    return error;
  }
}
