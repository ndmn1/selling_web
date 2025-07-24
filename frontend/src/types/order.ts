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
