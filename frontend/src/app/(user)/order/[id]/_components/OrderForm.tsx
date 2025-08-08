"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import type { UserOrder, UserOrderFormData } from "@/types/order";
import { formatCurrency } from "@/lib/utils";
import { getOrderStatusText, getOrderStatusColor } from "@/constant";
import Image from "next/image";
interface OrderFormProps {
  initialData: UserOrder;
  onSubmit: (data: UserOrderFormData) => Promise<void>;
}

const OrderForm = ({ initialData, onSubmit }: OrderFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await onSubmit({ status: OrderStatus.CANCELLED });
      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const canCancel = initialData.status === OrderStatus.PENDING;

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
            <div className="mt-1">
              <span
                className={`inline-flex px-3 py-2 text-sm rounded-md ${getOrderStatusColor(
                  initialData.status
                )}`}
              >
                {getOrderStatusText(initialData.status)}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Thông tin thanh toán
            </h3>
            <div className="bg-white rounded-lg p-4 space-y-2">
              <p>
                <span className="font-medium">Phương thức thanh toán:</span>{" "}
                {initialData.paymentMethod === "COD"
                  ? "Thanh toán khi nhận hàng"
                  : "Thanh toán qua ngân hàng"}
              </p>
              <p>
                <span className="font-medium">Mã voucher:</span>{" "}
                {initialData.voucherCode || "Không có"}
              </p>
              <p>
                <span className="font-medium">Tổng tiền:</span>{" "}
                {formatCurrency(initialData.totalAmount)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Thông tin giao hàng
            </h3>
            <div className="bg-white rounded-lg p-4 space-y-2">
              <p>
                <span className="font-medium">Địa chỉ:</span>{" "}
                {initialData.shippingAddress || "Không có"}
              </p>
              <p>
                <span className="font-medium">Số điện thoại:</span>{" "}
                {initialData.phoneNumber || "Không có"}
              </p>
              {initialData.notes && (
                <p>
                  <span className="font-medium">Ghi chú:</span>{" "}
                  {initialData.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Order Items */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
          </div>

          <div className="space-y-4">
            {initialData.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 bg-white p-4 rounded-lg"
              >
                <Image
                  src={item.product.mainImage}
                  alt={item.product.name}
                  width={64}
                  height={64}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">
                    {item.product.brand?.name}
                  </p>
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
        {canCancel && (
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Đang hủy..." : "Hủy đơn hàng"}
          </button>
        )}
      </div>
    </form>
  );
};

export default OrderForm;
