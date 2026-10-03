import jwt from "jsonwebtoken";

export async function createTokenPair(payload, publicKey, privateKey) {
  try {
    // Access token
    const accessToken = await jwt.sign(payload, publicKey, {
      // algorithm: "RS256",
      expiresIn: "2 days",
    });

    // Refresh token
    const refreshToken = await jwt.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "7 days",
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("Error verify::", err);
      } else {
        console.log("Decode verify:: ", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
}
