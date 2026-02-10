import { NextFunction, Request, Response } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timeStart = performance.now();
  res.on("finish", () => {
    const timeEnd = performance.now();
    console.log(
      req.method,
      "----",
      req.originalUrl,
      "----",
      res.statusCode,
      "----",
      (timeEnd - timeStart).toFixed(2) + "ms",
    );
  });
  next();
};
