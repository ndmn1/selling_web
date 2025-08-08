"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

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
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });
    
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};

export async function getUserProfile(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch user profile");
  }
}

export async function updateUserProfile(userId: string, userData: {
  name?: string;
  phone?: string;
  address?: string;
}) {
  try {

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        ...userData,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    revalidatePath("/profile");

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update user profile");
  }
}

export async function changePassword(userId: string, oldPassword: string, newPassword: string) {
  try {

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password || "");

    if (!isPasswordValid) {
      throw new Error("Mật khẩu cũ không đúng");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to change password");
  }
}

export async function getUserAddresses(userId: string) {
  try {

    const addresses = await db.address.findMany({
      where: { userId: userId },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" }
      ],
    });

    return addresses;
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch addresses");
  }
}

export async function createAddress(userId: string, addressData: {
  title: string;
  phoneNumber: string;
  address: string;
  ward?: string;
  district?: string;
  province: string;
  isDefault?: boolean;
}) {
  try {


    // If this address is set as default, update all other addresses to not be default
    if (addressData.isDefault) {
      await db.address.updateMany({
        where: { userId: userId },
        data: { isDefault: false },
      });
    }

    const newAddress = await db.address.create({
      data: {
        ...addressData,
        userId: userId,
      },
    });

    revalidatePath("/profile");
    return newAddress;
  } catch (error) {
    console.error("Error creating address:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create address");
  }
}

export async function updateAddress(userId: string, addressId: string, addressData: {
  title?: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  ward?: string;
  district?: string;
  province?: string;
  isDefault?: boolean;
}) {
  try {


    // Verify the address belongs to the user
    const existingAddress = await db.address.findFirst({
      where: { id: addressId, userId: userId },
    });

    if (!existingAddress) {
      throw new Error("Address not found");
    }

    // If this address is set as default, update all other addresses to not be default
    if (addressData.isDefault) {
      await db.address.updateMany({
        where: { userId: userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await db.address.update({
      where: { id: addressId },
      data: addressData,
    });

    revalidatePath("/profile");
    return updatedAddress;
  } catch (error) {
    console.error("Error updating address:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update address");
  }
}

export async function deleteAddress(userId: string, addressId: string) {
  try {
    // Verify the address belongs to the user
    const existingAddress = await db.address.findFirst({
      where: { id: addressId, userId: userId },
    });

    if (!existingAddress) {
      throw new Error("Address not found");
    }

    await db.address.delete({
      where: { id: addressId },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error deleting address:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete address");
  }
}