import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import cors from "cors";
import "./app/config/passport"
import { router } from "./app/routes";
import { globalErrorHandlers } from "./app/middlewares/globalErrorHandlers";
import { notFoundRoute } from "./app/middlewares/notFound";

import passport from "passport";
import { envVars } from "./app/config/env";
const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is  ePay Wallet Server",
  });
});

app.use(globalErrorHandlers);
app.use(notFoundRoute);
export default app;
