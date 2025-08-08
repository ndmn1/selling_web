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
// Price filter options
export const priceOptions = [
  { id: "price-1", label: "Giá dưới 1.000.000đ", min: 0, max: 1000000 },
  {
    id: "price-2",
    label: "1.000.000đ - 2.000.000đ",
    min: 1000000,
    max: 2000000,
  },
  {
    id: "price-3",
    label: "2.000.000đ - 3.000.000đ",
    min: 2000000,
    max: 3000000,
  },
  {
    id: "price-4",
    label: "3.000.000đ - 5.000.000đ",
    min: 3000000,
    max: 5000000,
  },
  {
    id: "price-5",
    label: "5.000.000đ - 10.000.000đ",
    min: 5000000,
    max: 10000000,
  },
];

// Size filter options
export const sizeOptions = [
  { id: "36.0", label: "36.0VN", value: "36.0" },
  { id: "37.0", label: "37.0VN", value: "37.0" },
  { id: "38.0", label: "38.0VN", value: "38.0" },
  { id: "39.0", label: "39.0VN", value: "39.0" },
  { id: "40.0", label: "40.0VN", value: "40.0" },
  { id: "41.0", label: "41.0VN", value: "41.0" },
  { id: "42.0", label: "42.0VN", value: "42.0" },
  { id: "43.0", label: "43.0VN", value: "43.0" },
  { id: "44.0", label: "44.0VN", value: "44.0" },
  { id: "45.0", label: "45.0VN", value: "45.0" },
];
export enum LocalImagePaths {
  BRAND = "/brands",
  PRODUCT = "/products",
}