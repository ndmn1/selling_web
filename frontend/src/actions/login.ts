"use server"
import { LoginSchema } from "@/schemas/auth";
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { AuthError } from "next-auth";
import { z } from "zod";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { UserRole } from "@prisma/client";


export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl: string | null,
) : Promise<{ success?: string, redirect?: string } | undefined>=> {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
      throw new Error("Invalid fields!");
  }
  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    throw new Error("Email does not exist!");
  }
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      redirect: false, 
    });
    console.log("Result:", result);
    return { redirect: existingUser.role === UserRole.ADMIN ? "/admin/dashboard" : "/all" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
         // return { error: "Invalid credentials!" }
          throw new Error("Invalid credentials!");
        default:
         // return { error: "Something went wrong!" }
          throw new Error("Something went wrong!");
      }
    }
  }
};

export const socialLogin = async (
  providerId: string,
)=> {
  await signIn(providerId, {
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  });
}
