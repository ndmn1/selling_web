'use client';
import React from "react";
import Link from "next/link";
import { useCartSummary } from "@/context/CartSummaryProvider";
function CustomerInfo() {
  const { changePaymentMethod } = useCartSummary();
  return (
    <>
      <h2 className="text-2xl font-bold">Thông tin đặt hàng</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Họ và tên
          </label>
          <div className="flex gap-2">
            <div className="relative w-[120px]">
              <select className="appearance-none w-full border rounded-md px-4 py-2 pr-8">
                <option>Anh/Chị</option>
                <option>Anh</option>
                <option>Chị</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <input
              type="text"
              id="name"
              placeholder="ndminhnhat1234@gmail.com"
              className="flex-1 border rounded-md px-4 py-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block mb-1">
            Số điện thoại
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="0915680152"
            className="w-full border rounded-md px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="ndminhnhat1234@gmail.com"
            className="w-full border rounded-md px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="address" className="block mb-1">
            Địa chỉ
          </label>
          <input
            type="text"
            id="address"
            placeholder="Công sau KTX KHU B ĐHQG TP.HCM, Đông Hòa, Dĩ An, Bình Dương"
            className="w-full border rounded-md px-4 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="province" className="block mb-1">
              Tỉnh/Thành phố
            </label>
            <div className="relative">
              <select
                id="province"
                className="appearance-none w-full border rounded-md px-4 py-2 pr-8"
              >
                <option>Bình Dương</option>
                <option>TP.HCM</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="district" className="block mb-1">
              Quận/Huyện
            </label>
            <div className="relative">
              <select
                id="district"
                className="appearance-none w-full border rounded-md px-4 py-2 pr-8"
              >
                <option>Dĩ An</option>
                <option>Thủ Đức</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="ward" className="block mb-1">
              Phường/Xã
            </label>
            <div className="relative">
              <select
                id="ward"
                className="appearance-none w-full border rounded-md px-4 py-2 pr-8"
              >
                <option>Đông Hòa</option>
                <option>Tân Tạo</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block mb-1">
            Ghi chú
          </label>
          <input
            type="text"
            id="note"
            placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)"
            className="w-full border rounded-md px-4 py-2"
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
              onChange={(e) => changePaymentMethod(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <img
                src="/placeholder.svg?height=40&width=40"
                alt="COD"
                className="w-10 h-10"
              />
              <span className="font-medium">Thanh toán khi nhận hàng</span>
            </div>
          </label>

          <label className="flex items-center space-x-4 border rounded-lg p-4 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="vnpay"
              className="w-4 h-4"
              onChange={(e) => changePaymentMethod(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <img
                src="/placeholder.svg?height=40&width=40"
                alt="VNPAY"
                className="w-10 h-10"
              />
              <span className="font-medium">Ví điện tử VNPAY</span>
            </div>
            <div className="text-xs text-gray-500 ml-12">
              Quét QR để thanh toán
            </div>
          </label>
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
