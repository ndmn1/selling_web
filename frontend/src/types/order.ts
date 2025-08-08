import { CartProduct } from "./product";
import { OrderStatus } from "@prisma/client";

//create order
export interface OrderData {
  paymentMethod?: string;
  voucherCode?: string;
  shippingAddress?: string;
  phoneNumber?: string;
  notes?: string;
  cartItems?: CartProduct[];
  status?: OrderStatus;
}

//profile
export interface OrderItem {
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}

// user order detail page
export type UserOrder = {
  id: string;
  userId: string;
  orderItems: {
    id: string;
    productId: string;
    product: {
      name: string;
      mainImage: string;
      brand: {
        name: string;
      } | null;
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

export type UserOrderFormData = {
  status: OrderStatus;
};