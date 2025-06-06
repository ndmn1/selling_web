"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUserProfile() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
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

export async function updateUserProfile(userData: {
  name?: string;
  phone?: string;
  address?: string;
}) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
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

export async function changePassword(oldPassword: string, newPassword: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
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
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to change password");
  }
}

export async function getUserAddresses() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const addresses = await db.address.findMany({
      where: { userId: session.user.id },
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

export async function createAddress(addressData: {
  title: string;
  phoneNumber: string;
  address: string;
  ward?: string;
  district?: string;
  province: string;
  isDefault?: boolean;
}) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // If this address is set as default, update all other addresses to not be default
    if (addressData.isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const newAddress = await db.address.create({
      data: {
        ...addressData,
        userId: session.user.id,
      },
    });

    revalidatePath("/profile");
    return newAddress;
  } catch (error) {
    console.error("Error creating address:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create address");
  }
}

export async function updateAddress(addressId: string, addressData: {
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
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify the address belongs to the user
    const existingAddress = await db.address.findFirst({
      where: { id: addressId, userId: session.user.id },
    });

    if (!existingAddress) {
      throw new Error("Address not found");
    }

    // If this address is set as default, update all other addresses to not be default
    if (addressData.isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id, id: { not: addressId } },
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

export async function deleteAddress(addressId: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify the address belongs to the user
    const existingAddress = await db.address.findFirst({
      where: { id: addressId, userId: session.user.id },
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