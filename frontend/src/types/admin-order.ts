import { OrderStatus } from "@prisma/client";

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


