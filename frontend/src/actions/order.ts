"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { OrderData, UserOrder, UserOrderFormData } from "@/types/order";
import { OrderStatus } from "@prisma/client";
import { PAYMENT_METHOD } from "@/constant";

// types moved to @/types/order


export async function createOrder(orderData: OrderData = {}) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const { paymentMethod, voucherCode, shippingAddress, phoneNumber, notes, cartItems, status } = orderData;

    console.log("cartItems", cartItems);
    // Get user's cart with items
    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            size: {
              include: {
                product: true
              },
            },
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
      const price = item.size.product.price * (1 - item.size.product.discount / 100);
      return total + price * item.quantity;
    }, 0);

    // Create order with order items
    const order = await db.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        status: status || OrderStatus.PENDING,
        paymentMethod: paymentMethod || PAYMENT_METHOD.cod,
        voucherCode,
        shippingAddress,
        phoneNumber,
        notes,
        orderItems: {
          create: cart.items.map((item) => ({
            productId: item.size.product.id,
            size: item.size.size,
            quantity: item.quantity,
            price: item.size.product.price * (1 - item.size.product.discount / 100),
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


export async function getUserOrders() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const orders = await db.order.findMany({
      where: { userId: session.user.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                mainImage: true,
                price: true,
                discount: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format orders for display
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      date: order.createdAt.toLocaleDateString("vi-VN"),
      total: order.totalAmount,
      status: order.status,
      items: order.orderItems.map((item) => ({
        name: item.product.name,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        image: item.product.mainImage,
      })),
    }));
    return formattedOrders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch orders");
  }
}

export async function getUserOrderById(orderId: string): Promise<UserOrder | null> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const order = await db.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id, // Ensure user can only see their own orders
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                brand: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return order;
  } catch (error) {
    console.error("Error fetching user order:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch order");
  }
}

export async function updateUserOrder(orderId: string, data: UserOrderFormData) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Check if order exists and belongs to user
    const existingOrder = await db.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id,
      },
    });

    if (!existingOrder) {
      throw new Error("Order not found");
    }

    // Only allow cancellation if order is PENDING
    if (data.status === OrderStatus.CANCELLED && existingOrder.status !== OrderStatus.PENDING) {
      throw new Error("Can only cancel orders with PENDING status");
    }

    const order = await db.order.update({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      data: {
        status: data.status,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                brand: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    revalidatePath("/profile");
    revalidatePath(`/order/${orderId}`);

    return order;
  } catch (error) {
    console.error("Error updating user order:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update order");
  }
}

