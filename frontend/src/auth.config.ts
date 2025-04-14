import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { getUserByEmail } from "./data/user";
import { NextAuthConfig } from "next-auth";
import { LoginSchema } from "./schemas";
import bcrypt from "bcryptjs";


export default{
  providers: [
    GitHub,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password,
          );

          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig


export const providerMap = [{
  id: "github",
  name: "Github",
},]
