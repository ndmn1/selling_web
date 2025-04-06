'use client'
import { useCartSummary } from '@/context/CartSummaryProvider'
import React from 'react'

function CartBottomBar() {
  const { total, paymentMethod, vocherCode } = useCartSummary()
  return (
    <>
      <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="mr-2">
                <img src="/placeholder.svg?height=30&width=30" alt="COD" className="w-8 h-8" />
              </div>
              <div className="text-sm">
                <div>{paymentMethod}</div>
              </div>
            </div>
            <button className="text-blue-600 text-sm">{vocherCode ||'Chưa dùng voucher'}</button>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <div className="text-blue-600">
                Thành tiền <span className="text-blue-600 font-bold">{total}đ</span>
              </div>
              <div className="text-xs text-right">
                <button className="text-blue-600 text-xs">Đăng nhập</button> để có thể đặt hàng
              </div>
            </div>
            <button className="bg-gray-500 hover:bg-gray-600 text-white rounded-full px-6 py-3">ĐẶT HÀNG</button>
          </div>
        </div>
    </>
  )
}

export default CartBottomBar
