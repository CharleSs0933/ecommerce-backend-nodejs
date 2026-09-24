import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

// init middleware
const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db

// init routes

// handing errors

export default app;
