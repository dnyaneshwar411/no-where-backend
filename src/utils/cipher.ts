import bcrypt from "bcrypt";

export const compareHash = async (plainText: string, hash: string) => {
  return bcrypt.compare(plainText, hash);
};
