import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { paymentMethod, voucherCode, shippingAddress, phoneNumber, notes } = await req.json();

    // Get user's cart with items
    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
            size: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
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
      where: { cartId: cart.id },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        orderItems: order.orderItems,
      },
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 