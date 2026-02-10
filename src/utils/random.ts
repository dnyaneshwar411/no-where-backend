import crypto from "crypto";

export const generateRandomHex = (bytes: number = 32): string => {
  return crypto.randomBytes(bytes).toString("hex");
};
