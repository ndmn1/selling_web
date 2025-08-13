import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OrderForm from "./_components/OrderForm";
import {
  getUserOrderById,
  updateUserOrder,
} from "@/actions/order";
import type { UserOrderFormData } from "@/types/order";

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }
  const searchParams = await params;
  const order = await getUserOrderById(searchParams.id);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Đơn hàng không tồn tại</h1>
          <p className="text-gray-600">
            Đơn hàng bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền xem nó.
          </p>
        </div>
      </div>
    );
  }

  async function onSubmit(data: UserOrderFormData) {
    "use server";
    await updateUserOrder(searchParams.id, data);
  }

  return (
    <div className="space-y-4 container mx-auto px-6 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng: {order.id}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Ngày đặt hàng: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-6">
        <OrderForm initialData={order} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
