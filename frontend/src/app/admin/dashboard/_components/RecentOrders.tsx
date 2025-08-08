"use client";

import React from "react";
import type { RecentOrder } from "@/types/statistics";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

interface RecentOrdersProps {
  orders: RecentOrder[];
}

const RecentOrders = ({ orders }: RecentOrdersProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Recent Orders
        </h3>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap">
                  Tracking no.
                </th>
                <th className="text-left py-3 px-2 text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap">
                  Product Name
                </th>
                <th className="text-left py-3 px-2 text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap">
                  Price
                </th>
                <th className="text-left py-3 px-2 text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap">
                  Total Items
                </th>
                <th className="text-left py-3 px-2 text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap">
                  Total Amount
                </th>
                <th className="text-left py-3 px-2 text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 sm:py-4 px-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        {order.trackingNo}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <Image
                            src={order.productImage}
                            alt={order.productName}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {order.productName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2">
                      <span className="text-xs sm:text-sm text-gray-900">
                        {formatCurrency(order.price)}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2">
                      <span className="text-xs sm:text-sm text-blue-600 font-medium">
                        {order.totalOrder}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2">
                      <span className="text-xs sm:text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
