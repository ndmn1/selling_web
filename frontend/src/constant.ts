import { OrderStatus } from "@prisma/client";

export const PAYMENT_METHOD = {
  cod: 'Thanh toán khi nhận hàng',
  bank_transfer: 'Thanh toán qua ngân hàng',
  credit_card: 'Thanh toán qua thẻ tín dụng',
}


export function getOrderStatusText(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "Chờ xác nhận";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "PROCESSING":
      return "Đang xử lý";
    case "SHIPPING":
      return "Đang giao hàng";
    case "DELIVERED":
      return "Đã giao hàng";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
}

export function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";
    case "PROCESSING":
      return "bg-orange-100 text-orange-800";
    case "SHIPPING":
      return "bg-purple-100 text-purple-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}