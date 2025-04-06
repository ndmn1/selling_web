"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { getCookie, setCookie } from "@/lib/cookies";


// Define the type for our cart context
type CartContextType = {
  cartCount: number;
  addToCart: (productId: string, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  changeItemQuantity: (productId: string, size: string, quantity: number) => void;
  changeItemSize: (productId: string, oldSize: string, newSize: string, newSizeStock: number) => void;
};

// Create the context with default values
const CartContext = createContext<CartContextType>({
  cartCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  changeItemQuantity: () => {},
  changeItemSize: () => {},
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  const calculateCartCount = (items: Record<string, Record<string, number>>) => {
    let totalCount = 0;
    Object.values(items).forEach((sizeObj) => {
      Object.values(sizeObj as Record<string, number>).forEach((quantity) => {
        totalCount += quantity;
      });
    });
    return totalCount;
  }
  // Initialize cart from cookies when component mounts (client-side only)
  useEffect(() => {
    const cartItems = getCookie("cart-items");
    if (cartItems) {
      try {
        const items = JSON.parse(cartItems);
        const totalCount = calculateCartCount(items);
        setCartCount(totalCount);
      } catch (e) {
        console.error("Failed to parse cart items from cookie", e);
      }
    }
  }, []);

  const addToCart = (productId: string, size: string) => {
    const cartItems = getCookie("cart-items") || "{}";
    try {
      const items = JSON.parse(cartItems);
      if (!items[productId]) {
        items[productId] = {}
      }
      items[productId][size] = (items[productId]?.[size] || 0) + 1; // Increment the size count for the product
      setCookie("cart-items", JSON.stringify(items));
      setCartCount(cartCount + 1);
    } catch (e) {
      console.error("Failed to add item to cart", e);
    }
  };
  const changeItemQuantity = (productId: string, size: string, quantity: number) => {
    const cartItems = getCookie("cart-items") || "{}";
    try {
      const items = JSON.parse(cartItems);
      if (!items[productId]) {
        items[productId] = {}
      }
      items[productId][size] = quantity;
      setCookie("cart-items", JSON.stringify(items));
      setCartCount(calculateCartCount(items));
    } catch (e) {
      console.error("Failed to add item to cart", e);
    }
  };
  const changeItemSize = (productId: string, oldSize: string, newSize: string, newSizeStock: number) => {
    const cartItems = getCookie("cart-items") || "{}";
    try {
      const items = JSON.parse(cartItems);
      if (items[productId] && items[productId][oldSize]!=null) {
        const oldQuantity = items[productId][oldSize];
        const newQuantity = items[productId][newSize] || 0;
        items[productId][newSize] = Math.min(newQuantity + oldQuantity, newSizeStock); // Set the new size with the quantity
        delete items[productId][oldSize]; // Remove the old size
        setCookie("cart-items", JSON.stringify(items));
        setCartCount(calculateCartCount(items));
      }
    } catch (e) {
      console.error("Failed to change item size in cart", e);
    }
  }
  const removeFromCart = (productId: string, size: string) => {
    const cartItems = getCookie("cart-items") || "{}";
    try {
      const items = JSON.parse(cartItems);
      if (items[productId] && items[productId][size]) {
        delete items[productId][size]
        // Remove the product entirely if no sizes remain
        if (Object.keys(items[productId]).length === 0) {
          delete items[productId]
        }
        setCookie("cart-items", JSON.stringify(items));
        setCartCount(calculateCartCount(items));
      }
    } catch (e) {
      console.error("Failed to remove item from cart", e);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart, removeFromCart, changeItemQuantity, changeItemSize }}>
      {children}
    </CartContext.Provider>
  );
}
