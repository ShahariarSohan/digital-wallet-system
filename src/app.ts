import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import cors from "cors";
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is a Digital Wallet System Server",
  });
});

export default app;
