"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getCookie, setCookie } from "@/lib/cookies"

// Define the type for our cart context
type CartContextType = {
  cartCount: number
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
}

// Create the context with default values
const CartContext = createContext<CartContextType>({
  cartCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
})

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0)
  // Initialize cart from cookies when component mounts (client-side only)
  useEffect(() => {
    const cartItems = getCookie("cart-items")
    if (cartItems) {
      try {
        const items = JSON.parse(cartItems)
        console.log("cartItems", items)
        const itemCount = Object.keys(items).reduce((count, key) => count + items[key], 0)
        setCartCount(itemCount)
      } catch (e) {
        console.error("Failed to parse cart items from cookie", e)
      }
    }
  }, [])

  const addToCart = (productId: string) => {
    const cartItems = getCookie("cart-items") || "{}"
    try {
      const items = JSON.parse(cartItems)
      items[productId] = (items[productId] || 0) + 1
      setCookie("cart-items", JSON.stringify(items))
      setCartCount(cartCount + 1)
    } catch (e) {
      console.error("Failed to add item to cart", e)
    }
  }

  const removeFromCart = (productId: string) => {
    const cartItems = getCookie("cart-items") || "{}"
    try {
      const items = JSON.parse(cartItems)
      if (items[productId]) {
        delete items[productId]
        setCookie("cart-items", JSON.stringify(items))
        setCartCount(Object.keys(items).length)
      }
    } catch (e) {
      console.error("Failed to remove item from cart", e)
    }
  }

  return <CartContext.Provider value={{ cartCount, addToCart, removeFromCart }}>{children}</CartContext.Provider>
}
