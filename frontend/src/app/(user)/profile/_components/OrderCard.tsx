import Image from "next/image";
import { Order } from "@/types/order";
import { getOrderStatusText, getOrderStatusColor } from "@/constant";
import Link from "next/link";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Đơn hàng:</span>
            <span>#{order.id}</span>
          </div>
          <div className="text-sm text-gray-500">Ngày đặt: {order.date}</div>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center space-x-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${getOrderStatusColor(order.status)}`}
          >
            {getOrderStatusText(order.status)}
          </span>
          <span className="font-medium">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(order.total)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Image
                  src={"/images/product-1.jpg"}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-grow">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">
                  Size: {item.size} | Số lượng: {item.quantity}
                </div>
                <div className="font-medium text-orange-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price)}
                </div>
              </div>
              <div>
                <button className="text-sm text-orange-600 hover:text-orange-700 hover:underline">
                  Mua lại
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
        <Link
          href={`/order/${order.id}`}
          className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors"
        >
          Chi tiết đơn hàng
        </Link>
      </div>
    </div>
  );
}
