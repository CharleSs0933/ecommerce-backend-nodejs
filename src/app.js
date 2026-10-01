import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import connect from "./dbs/init.mongodb.js";
import { checkOverload } from "./helpers/check.connect.js";
import indexRouter from "./routers/index.js";
import { errorHandler } from "./core/error.handler.js";
import { ErrorResponse } from "./core/error.response.js";

dotenv.config();

// init middleware
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
connect();
checkOverload();

// init routes

app.use("/", indexRouter);

// handing errors
app.use((_req, res, next) => {
  next(new ErrorResponse("Route not found", 404));
});

app.use(errorHandler);

export default app;
