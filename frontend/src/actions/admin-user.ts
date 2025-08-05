"use server";

import { db } from "@/lib/db";
import { UserRole, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type UserFormData = {
  name?: string | null;
  email: string;
  role: UserRole;
  password?: string;
};

export async function getUsers(search?: string, page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;
    
    const whereConditions: Prisma.UserWhereInput = {};
    
    if (search) {
      whereConditions.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          email: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }
    
    // Use a single query with include to get both users and count
    const users = await db.user.findMany({
      where: whereConditions,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Get total count separately with a timeout
    const total = await db.user.count({ 
      where: whereConditions 
    });

    return {
      users,
      total,
    };
  } catch (error) {
    console.error("[GET_USERS]", error);
    
    // Check if it's a connection pool error
    if (error instanceof Error && error.message.includes('connection pool')) {
      throw new Error("Database connection timeout. Please try again.");
    }
    
    // Check if it's a Prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Database error occurred. Please try again.");
    }
    
    throw new Error("Failed to fetch users. Please try again.");
  }
}

export async function updateUser(id: string, data: UserFormData) {
  try {
    const user = await db.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error("[UPDATE_USER]", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Email already exists.");
      }
    }
    throw new Error("Failed to update user.");
  }
}

export async function createUser(data: UserFormData) {
  try {
    if (!data.password) {
      throw new Error("Password is required for new users.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error("[CREATE_USER]", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Email already exists.");
      }
    }
    throw new Error("Failed to create user.");
  }
}

export async function deleteUser(id: string) {
  try {
    await db.user.delete({
      where: { id },
    });
  } catch (error) {
    console.error("[DELETE_USER]", error);
    throw new Error("Failed to delete user.");
  }
}

export async function resetPassword(id: string, newPassword: string) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("[RESET_PASSWORD]", error);
    throw new Error("Failed to reset password.");
  }
}
