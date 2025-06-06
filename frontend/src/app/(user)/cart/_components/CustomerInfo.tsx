"use client";
import React from "react";
import Link from "next/link";
import { useCartSummary } from "@/context/CartSummaryProvider";
import { FaChevronDown } from "react-icons/fa";
import Image from "next/image";
import { PAYMENT_METHOD } from "@/constant";

function CustomerInfo() {
  const {
    customerInfo,
    updateCustomerInfo,
    validationErrors,
    clearValidationError,
  } = useCartSummary();

  const handleInputChange = (
    field: keyof typeof customerInfo,
    value: string
  ) => {
    updateCustomerInfo({ [field]: value });
    // Clear error when user starts typing
    if (validationErrors[`customerInfo.${field}`]) {
      clearValidationError(`customerInfo.${field}`);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold">Thông tin đặt hàng</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="phone" className="block mb-1">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={customerInfo.phone}
            placeholder="Nhập số điện thoại"
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={`w-full border rounded-md px-4 py-2 ${
              validationErrors["customerInfo.phone"]
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {validationErrors["customerInfo.phone"] && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors["customerInfo.phone"]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block mb-1">
            Địa chỉ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            value={customerInfo.address}
            placeholder="Nhập địa chỉ"
            onChange={(e) => handleInputChange("address", e.target.value)}
            className={`w-full border rounded-md px-4 py-2 ${
              validationErrors["customerInfo.address"]
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {validationErrors["customerInfo.address"] && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors["customerInfo.address"]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="province" className="block mb-1">
              Tỉnh/Thành phố <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="province"
                value={customerInfo.province}
                onChange={(e) => handleInputChange("province", e.target.value)}
                className={`appearance-none w-full border rounded-md px-4 py-2 pr-8 ${
                  validationErrors["customerInfo.province"]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                <option value="Bình Dương">Bình Dương</option>
                <option value="TP.HCM">TP.HCM</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaChevronDown className="w-3 h-3" />
              </div>
            </div>
            {validationErrors["customerInfo.province"] && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors["customerInfo.province"]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="district" className="block mb-1">
              Quận/Huyện <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="district"
                value={customerInfo.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
                className={`appearance-none w-full border rounded-md px-4 py-2 pr-8 ${
                  validationErrors["customerInfo.district"]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Chọn Quận/Huyện</option>
                <option value="Dĩ An">Dĩ An</option>
                <option value="Thủ Đức">Thủ Đức</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaChevronDown className="w-3 h-3" />
              </div>
            </div>
            {validationErrors["customerInfo.district"] && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors["customerInfo.district"]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ward" className="block mb-1">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="ward"
                value={customerInfo.ward}
                onChange={(e) => handleInputChange("ward", e.target.value)}
                className={`appearance-none w-full border rounded-md px-4 py-2 pr-8 ${
                  validationErrors["customerInfo.ward"]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Chọn Phường/Xã</option>
                <option value="Đông Hòa">Đông Hòa</option>
                <option value="Tân Tạo">Tân Tạo</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaChevronDown className="w-3 h-3" />
              </div>
            </div>
            {validationErrors["customerInfo.ward"] && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors["customerInfo.ward"]}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block mb-1">
            Ghi chú
          </label>
          <input
            type="text"
            id="note"
            value={customerInfo.note || ""}
            placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)"
            onChange={(e) => handleInputChange("note", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Hình thức thanh toán</h2>
        <div className="space-y-4">
          <label className="flex items-center space-x-4 border rounded-lg p-4 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="cod"
              className="w-4 h-4"
              checked={customerInfo.paymentMethod === "cod"}
              onChange={(e) => updateCustomerInfo({ paymentMethod: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="COD"
                className="w-10 h-10"
                width={40}
                height={40}
              />
              <span className="font-medium">{PAYMENT_METHOD.cod}</span>
            </div>
          </label>

          <label className="flex items-center space-x-4 border rounded-lg p-4 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="bank_transfer"
              className="w-4 h-4"
              checked={customerInfo.paymentMethod === "bank_transfer"}
              onChange={(e) => updateCustomerInfo({ paymentMethod: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Bank"
                className="w-10 h-10"
                width={40}
                height={40}
              />
              <span className="font-medium">
                {PAYMENT_METHOD.bank_transfer}
              </span>
            </div>

            <div className="text-xs text-gray-500 ml-12">
              Quét QR để thanh toán
            </div>
          </label>
          {validationErrors["paymentMethod"] && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors["paymentMethod"]}
            </p>
          )}
        </div>

        <p className="text-sm">
          Nếu bạn không hài lòng với sản phẩm của chúng tôi? Bạn hoàn toàn có
          thể trả lại sản phẩm. Tìm hiểu thêm{" "}
          <Link href="#" className="text-blue-600">
            tại đây
          </Link>
          .
        </p>
      </div>
    </>
  );
}

export default CustomerInfo;
