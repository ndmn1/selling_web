"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import type { Order, OrderFormData } from "@/actions/admin-order";
import { formatCurrency } from "@/lib/utils";
import { getOrderStatusText } from "@/constant";
import Image from "next/image";
interface OrderFormProps {
  initialData: Order;
  onSubmit: (data: OrderFormData) => Promise<void>;
}

const OrderForm = ({ initialData, onSubmit }: OrderFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    status: initialData.status,
    notes: initialData.notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await onSubmit(formData);
      router.push("/admin/orders");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Order Information */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trạng thái đơn hàng
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as OrderStatus,
                }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>
                  {getOrderStatusText(status)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ghi chú
            </label>
            <textarea
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nhập ghi chú cho đơn hàng"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Thông tin khách hàng
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p>
                <span className="font-medium">Tên:</span>{" "}
                {initialData.user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {initialData.user.email}
              </p>
              <p>
                <span className="font-medium">Số điện thoại:</span>{" "}
                {initialData.phoneNumber || "N/A"}
              </p>
              <p>
                <span className="font-medium">Địa chỉ:</span>{" "}
                {initialData.shippingAddress || "N/A"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Thông tin thanh toán
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p>
                <span className="font-medium">Phương thức:</span>{" "}
                {initialData.paymentMethod === "COD"
                  ? "Tiền mặt"
                  : "Chuyển khoản"}
              </p>
              <p>
                <span className="font-medium">Mã giảm giá:</span>{" "}
                {initialData.voucherCode || "Không có"}
              </p>
              <p>
                <span className="font-medium">Tổng tiền:</span>{" "}
                {formatCurrency(initialData.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Order Items */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Sản phẩm đã đặt</h2>
          </div>

          <div className="space-y-4">
            {initialData.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
              >
                <Image
                  src={item.product.mainImage}
                  alt={item.product.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">
                    Size: {item.size} | Số lượng: {item.quantity}
                  </p>
                  <p className="text-sm font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Quay lại
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "Đang lưu..." : "Cập nhật"}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
