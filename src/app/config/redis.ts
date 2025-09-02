/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "redis";
import { envVars } from "./env";

export const redisClient = createClient({
  username: envVars.REDIS.REDIS_USERNAME,
  password: "",
  socket: {
    host: envVars.REDIS.REDIS_HOST,
    port: Number(envVars.REDIS.REDIS_PORT),
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
  },
});
let notConnected = true;
redisClient.on("error", (err:any) =>{
  if (notConnected) {
    console.log("⏳ Redis not ready yet, retrying...");
  } else {
    console.error("❌ Redis runtime error:", err.message);
  }
});

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect()
        notConnected = false;
        console.log("✔️ Redis Connected")
    }
}


