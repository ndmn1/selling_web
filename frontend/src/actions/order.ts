"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

import { CartProduct } from "@/types/product";

interface CreateOrderData {
  paymentMethod?: string;
  voucherCode?: string;
  shippingAddress?: string;
  phoneNumber?: string;
  notes?: string;
  cartItems?: CartProduct[];
}

export async function createOrder(orderData: CreateOrderData = {}) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const { paymentMethod, voucherCode, shippingAddress, phoneNumber, notes, cartItems } = orderData;

    console.log("cartItems", cartItems);
    // Get user's cart with items
    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
            size: true,
          },
          where: {
            id: { in: cartItems?.map((item) => item.cartId) || [] }
          }
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Selected cart items not found");
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((total, item) => {
      const price = item.product.price * (1 - item.product.discount / 100);
      return total + price * item.quantity;
    }, 0);

    // Create order with order items
    const order = await db.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        paymentMethod: paymentMethod || "COD",
        voucherCode,
        shippingAddress,
        phoneNumber,
        notes,
        orderItems: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            size: item.size.size,
            quantity: item.quantity,
            price: item.product.price * (1 - item.product.discount / 100),
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear the cart after successful order creation
    await db.cartItem.deleteMany({
      where: { id: { in: cartItems?.map((item) => item.cartId) || [] } },
    });

    // Revalidate cart and orders pages
    revalidatePath("/cart");

    return {
      success: true,
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        orderItems: order.orderItems,
      },
    };

  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create order");
  }
}

export async function createOrderAndRedirect(orderData: CreateOrderData = {}) {
  try {
    const result = await createOrder(orderData);
    return result;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

