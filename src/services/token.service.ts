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

(async function () {
  console.log(
    await signToken({
      tabHeader:
        "6449ee8b11c6caf29004f6a708a65d965fa291cb1d2490d18b035389781c2840",
      userId: "6988a0c4e52891b5af391f25",
      channelId: "698847866b73a367cf0a02c6",
    }),
  );
});
