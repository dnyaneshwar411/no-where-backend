import { isBefore } from "date-fns";
import config from "../config/config";
import jwt from "jsonwebtoken";

export const signToken = async function <T extends Record<string, any>>(
  payload: T,
): Promise<string> {
  return jwt.sign(payload, config.jwtSecretKey, {
    expiresIn: config.jwtExpiration,
  });
};

export const verifyToken = async function (token: string) {
  try {
    return jwt.verify(token, config.jwtSecretKey);
  } catch (error) {
    return { success: false };
  }
};

export const verifyUser = async function (
  requestToken: string,
  tabHeaderTag: string,
) {
  const payload = (await verifyToken(requestToken)) as jwt.JwtPayload;
  if (payload.tabHeader !== tabHeaderTag) return { success: false };
  const expAt = new Date(payload.exp as number);
  if (!isBefore(expAt, new Date())) return { success: false };
  return {
    success: true,
    payload,
  };
};