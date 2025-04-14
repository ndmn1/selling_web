"use server";

import { RegisterSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  
  if (!validatedFields.success) {
    throw new Error("Invalid fields!");
  }

  const { email, password, name } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists!");
  }
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  
  return { 
    success: "Registration successful!",
  };
}