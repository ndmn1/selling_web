"use server";

import { db } from "@/lib/db";
import { OrderStatus, Prisma } from "@prisma/client";

export type Order = {
  id: string;
  userId: string;
  user: {
    name: string | null;
    email: string;
  };
  orderItems: {
    id: string;
    productId: string;
    product: {
      name: string;
      mainImage: string;
    };
    size: string;
    quantity: number;
    price: number;
  }[];
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: string;
  voucherCode?: string | null;
  shippingAddress?: string | null;
  phoneNumber?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderFormData = {
  status: OrderStatus;
  notes?: string;
};

export async function getOrders(search?: string, page: number = 1, limit: number = 10, status?: string) {
  try {
    const skip = (page - 1) * limit;
    
    const whereConditions: Prisma.OrderWhereInput = {};
    
    if (search) {
      whereConditions.OR = [
        {
          user: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          id: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }
    
    if (status) {
      // Convert string status to uppercase enum value
      const statusEnum = status.toUpperCase() as OrderStatus;
      whereConditions.status = statusEnum;
    }
    
    const [orders, total] = await Promise.all([
      db.order.findMany({
        where: whereConditions,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            }
          },
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                  mainImage: true,
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      db.order.count({
        where: whereConditions
      })
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                mainImage: true,
              }
            }
          }
        }
      }
    });

    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }
}

export async function updateOrder(id: string, data: OrderFormData) {
  try {
    const order = await db.order.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                mainImage: true,
              }
            }
          }
        }
      }
    });

    return order;
  } catch (error) {
    console.error('Error updating order:', error);
    throw new Error('Failed to update order');
  }
}

export async function deleteOrder(id: string) {
  try {
    await db.order.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    throw new Error('Failed to delete order');
  }
}