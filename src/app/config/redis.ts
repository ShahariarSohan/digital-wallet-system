import { createClient } from "redis";
import { envVars } from "./env";

export const redisClient = createClient({
  username: envVars.REDIS_USERNAME,
  password: envVars.REDIS_PASSWORD,
  socket: {
    host: envVars.REDIS_HOST,
    port: Number(envVars.REDIS_PORT),
  },
});
// export const redisClient = createClient({
//   url: `redis://${envVars.REDIS.REDIS_USERNAME}:${envVars.REDIS.REDIS_PASSWORD}@${envVars.REDIS.REDIS_HOST}:${envVars.REDIS.REDIS_PORT}`,
//   socket: {
//     tls: true,
//     rejectUnauthorized: false,
//   },
// });

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("✔️ Redis connected");
  }
};
