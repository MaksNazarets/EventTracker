import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
dotenv.config();

import { AppDataSource } from "./data-source";
import { router as eventRouter } from "./routes/eventRoute";
import { router as userRouter } from "./routes/userRouter";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use("/", userRouter);
app.use("/events", eventRouter);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    const PORT = process.env.APP_PORT;

    app.listen(PORT, () => {
      console.log(`Server is running on ${process.env.CLIENT_ORIGIN}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
