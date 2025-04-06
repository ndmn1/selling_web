"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

// Define the type for our cart context
type CartSummaryContextType = {
  total: number
  paymentMethod: string
  vocherCode: string
  changePaymentMethod: (method: string) => void
  changeVocherCode: (code: string) => void
  changeTotal: (total: number) => void
}

// Create the context with default values
const CartSummaryContext = createContext<CartSummaryContextType>({
  total: 0,
  paymentMethod: "cod",
  vocherCode: "",
  changePaymentMethod: () => {},
  changeVocherCode: () => {},
  changeTotal: () => {},
})

// Custom hook to use the cart context
export const useCartSummary = () => useContext(CartSummaryContext)

export function CartSummaryProvider({ children }: { children: React.ReactNode }) {
  const [total, setTotal] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("Thanh toán khi nhận hàng")
  const [vocherCode, setVocherCode] = useState("")

  const changePaymentMethod = (method: string) => {
    setPaymentMethod(method)
  }

  const changeVocherCode = (code: string) => {
    setVocherCode(code)
  }

  const changeTotal = (total: number) => {
    setTotal(total)
  }

  return (
    <CartSummaryContext.Provider
      value={{
        total,
        paymentMethod,
        vocherCode,
        changePaymentMethod,
        changeVocherCode,
        changeTotal,
      }}
    >
      {children}
    </CartSummaryContext.Provider>
  )
}
