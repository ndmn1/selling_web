import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { getUserByEmail } from "./data/user";
import { NextAuthConfig } from "next-auth";


export default{
  providers: [
    GitHub,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async ({email,password}) => {
        const user = await getUserByEmail(email as string);
        if (!user) return null;
        if (user.password !== password) return null;
        return user;
      },
    }),
  ],
} satisfies NextAuthConfig


export const providerMap = [{
  id: "github",
  name: "Github",
},]
