"use client";
import { PAYMENT_METHOD } from "@/constant";
import { useCartSummary } from "@/context/CartSummaryProvider";
import { useSession } from "next-auth/react";
import React from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/hooks/use-order";
import { orderSchema } from "@/schemas/order";

function CartBottomBar() {
  const {
    total,
    vocherCode,
    customerInfo,
    selectedCartItems,
    setValidationErrors,
  } = useCartSummary();
  const { status } = useSession();
  const router = useRouter();
  const { createOrder, loading, error } = useOrder();

  const validateOrderData = () => {
    const orderData = {
      customerInfo,
      paymentMethod: customerInfo.paymentMethod,
      cartItems: selectedCartItems,
      voucherCode: vocherCode,
      total,
    };

    const result = orderSchema.safeParse(orderData);
    console.log("result", result);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      console.log("errors", errors);
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    return true;
  };

  const handleOrder = async () => {
    if (status === "authenticated") {
      // Validate form data before creating order
      if (!validateOrderData()) {
        return; // Stop if validation fails
      }

      // Create order with validated data
      await createOrder({
        paymentMethod: customerInfo.paymentMethod,
        voucherCode: vocherCode || undefined,
        shippingAddress: `${customerInfo.address}, ${customerInfo.ward}, ${customerInfo.district}, ${customerInfo.province}`,
        phoneNumber: customerInfo.phone,
        notes: customerInfo.note,
        cartItems: selectedCartItems,
      });
    } else {
      const callbackUrl = encodeURIComponent(window.location.href);
      router.push(`/login?callbackUrl=${callbackUrl}`);
    }
  };
  return (
    <>
      {error && (
        <div className="container mx-auto mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="mr-2">
              <img
                src="/placeholder.svg?height=30&width=30"
                alt="COD"
                className="w-8 h-8"
              />
            </div>
            <div className="text-sm">
              <div>
                {
                  PAYMENT_METHOD[
                    customerInfo.paymentMethod as keyof typeof PAYMENT_METHOD
                  ]
                }
              </div>
            </div>
          </div>
          <button className="text-blue-600 text-sm">
            {vocherCode || "Chưa dùng voucher"}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <div className="text-blue-600">
              Thành tiền{" "}
              <span className="text-blue-600 font-bold">{total}đ</span>
            </div>
            {status === "unauthenticated" && (
              <div className="text-xs text-right">
                <button className="text-blue-600 text-xs">Đăng nhập</button> để
                có thể đặt hàng
              </div>
            )}
          </div>
          <button
            className={`bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full px-6 py-3 ${
              loading ? "opacity-50" : ""
            }`}
            onClick={handleOrder}
            disabled={loading}
          >
            {loading ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
          </button>
        </div>
      </div>
    </>
  );
}

export default CartBottomBar;
