import keyTokenModel from "../models/keyToken.model.js";

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
