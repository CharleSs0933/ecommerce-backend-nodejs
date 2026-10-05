import jwt from "jsonwebtoken";
import { AuthFailureError, NotFoundError } from "../core/error.response.js";
import * as keyTokenService from "../services/keyToken.service.js";

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-refresh-token",
};

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
  } catch (error) {}
}

export async function authentication(req, _res, next) {
  try {
    // Check userId missing???
    const userId = req.headers[HEADER.CLIENT_ID];

    if (!userId) {
      throw new AuthFailureError("Invalid request");
    }

    // Get access token
    const keyStore = await keyTokenService.findByUserId({ userId });
    if (!keyStore) {
      throw new NotFoundError("Not found keyStore");
    }

    const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
    if (refreshToken) {
      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) {
        throw new AuthFailureError("Invalid UserId");
      }
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    }

    // Verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
      throw new AuthFailureError("Invalid request");
    }

    // Check user in dbs
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid UserId");
    }

    req.keyStore = keyStore;
    // Check keyStore with userId
    // Return next
    return next();
  } catch (error) {
    return next(error);
  }
}

export async function verifyJWT(token, keySecret) {
  return await jwt.verify(token, keySecret);
}
