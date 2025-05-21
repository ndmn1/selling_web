import { db } from "@/lib/db";

export const getAccountByUserId = async (userId: string) => { // account is create when user sign in with social media
  try {
    const account = await db.account.findFirst({
      where: { userId }
    });

    return account;
  } catch {
    return null;
  }
};
