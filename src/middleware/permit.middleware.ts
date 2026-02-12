import { verifyUser } from "../services/token.service";

export const permit = async function(token: string, tabHeader: string) {
  const { success, payload: user } = await verifyUser(token, tabHeader);
  return { success, user };
};
