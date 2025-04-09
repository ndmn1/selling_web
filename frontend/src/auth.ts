import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail } from "./data/user";
export const { handlers, signIn, signOut, auth } = NextAuth({
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
})

export const providerMap = [{
  id: "github",
  name: "Github",
},]
