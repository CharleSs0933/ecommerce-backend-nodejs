import { ErrorResponse } from "./error.response.js";

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ErrorResponse) {
    return res.status(err.status).json({
      status: "error",
      code: err.status,
      stack: err.stack,
      message: err.message || "Internal Server Error",
    });
  }

  // Logger.error
  console.error("Internal Server Error::", err);

  return res.status(500).json({
    status: "error",
    code: 500,
    stack: err.stack,
    message: "Internal Server Error",
  });
}
