import { Server } from "http";
import { envVars } from "./app/config/env";
import mongoose from "mongoose";
import app from "./app";
import { seedAdmin } from "./app/utils/seedAdmin";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("✅ Connected to MongoDB");

    server = app.listen(envVars.PORT, () => {
      console.log(`✅ Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
(async () => {
  await startServer();
  await seedAdmin();
})();

process.on("unhandledRejection", (err) => {
  console.log("UnhandledRejection Error Occurred Server Shutting Down", err);
  if (server) {
    server.close(() => process.exit(1));
  }
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.log("UncaughtException Error Occurred Server Shutting Down", err);
  if (server) {
    server.close(() => process.exit(1));
  }
  process.exit(1);
});
process.on("SIGINT", (err) => {
  console.log("Sigint signal got ,Server Shutting Down", err);
  if (server) {
    server.close(() => process.exit(1));
  }
  process.exit(1);
});
