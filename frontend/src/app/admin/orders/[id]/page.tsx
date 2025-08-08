import React from "react";
import { notFound } from "next/navigation";
import OrderForm from "./_components/OrderForm";
import { getOrderById, updateOrder } from "@/actions/admin-order";
import type { OrderFormData } from "@/types/admin-order";

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  async function onSubmit(data: OrderFormData) {
    "use server";
    await updateOrder(id, data);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng: {order.id}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6">
        <OrderForm initialData={order} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
