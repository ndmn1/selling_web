"use server"
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { AuthError } from "next-auth";
import { z } from "zod";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";


export const login = async (
  values: z.infer<typeof LoginSchema>
) : Promise<{ success?: string, redirect?: string } | undefined>=> {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
      throw new Error("Invalid fields!");
  }
  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
   // return { error: "Email does not exist!" }
    throw new Error("Email does not exist!");
  }
  if(existingUser.password == "abcd"){
    return { success: "Login successful!" };
  }
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
      redirect: false, 
    });
    return { redirect: result };
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
