import { z } from "zod";

// Cart item schema for validation
export const cartItemSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  cartId: z.string().min(1, "Cart ID is required"), 
  name: z.string().min(1, "Product name is required"),
  selectedSize: z.string().min(1, "Size is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
  salePrice: z.number().optional(),
});

// Customer information schema
export const customerInfoSchema = z.object({
  phone: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(/^[0-9+\-\s()]+$/, "Số điện thoại không hợp lệ")
    .min(10, "Số điện thoại phải có ít nhất 10 số"),
  address: z
    .string()
    .min(1, "Địa chỉ là bắt buộc")
    .min(10, "Địa chỉ phải có ít nhất 10 ký tự"),
  province: z.string().min(1, "Vui lòng chọn Tỉnh/Thành phố"),
  district: z.string().min(1, "Vui lòng chọn Quận/Huyện"),
  ward: z.string().min(1, "Vui lòng chọn Phường/Xã"),
  note: z.string().optional(),
  paymentMethod: z.string().min(1, "Vui lòng chọn hình thức thanh toán"),
});


// Complete order schema
export const orderSchema = z.object({
  customerInfo: customerInfoSchema,
  cartItems: z
    .array(cartItemSchema)
    .min(1, "Vui lòng chọn ít nhất một sản phẩm để đặt hàng"),
  voucherCode: z.string().optional(),
  total: z.number().min(0, "Tổng tiền không hợp lệ"),
});

// Type exports
export type CustomerInfo = z.infer<typeof customerInfoSchema>;
export type OrderData = z.infer<typeof orderSchema> ;

// Validation result type
export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}; 