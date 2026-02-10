import express from "express";

export const permit = function() {
  return async function(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const token = req.headers.authorization?.split(" ")?.at(1);
    } catch (error) { }
  };
};
