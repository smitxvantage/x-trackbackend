export function notFoundHandler(req, res, next) {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
}

export function errorHandler(err, req, res, _next) {
  console.error(err);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
}
