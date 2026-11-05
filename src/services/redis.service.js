import redis from "redis";
import { promisify } from "util";
import * as inventoryRepo from "../models/repositories/inventory.repo.js";

const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

export async function acquireLock({ product_id, quantity, cart_id }) {
  const key = `lock:${product_id}`;

  const retryTimes = 10;
  const expireTime = 3000; // 3 seconds

  for (let i = 0; i < retryTimes.length; i++) {
    const result = await setnxAsync(key, expireTime);
    console.log(`result::`, result);

    if (result === 1) {
      const isReversation = await inventoryRepo.reservationInventory({
        product_id,
        quantity,
        cart_id,
      });

      if (isReversation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }

      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
}

export async function releaseLock(key) {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(key);
}
