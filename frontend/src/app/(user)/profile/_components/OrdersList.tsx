import Link from "next/link";
import OrderCard from "./OrderCard";
import { OrderStatus } from "@prisma/client";

interface OrderItem {
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}

interface OrdersListProps {
  orders: Order[];
}

export default function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Đơn hàng của tôi</h2>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Bạn chưa có đơn hàng nào
          </h3>
          <p className="mt-1 text-gray-500">
            Hãy khám phá các sản phẩm của chúng tôi và đặt hàng ngay!
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Mua sắm ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Đơn hàng của tôi</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
