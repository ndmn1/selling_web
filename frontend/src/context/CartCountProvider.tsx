"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getCookie, setCookie } from "@/lib/cookies";
import { useSession } from "next-auth/react";
import {
  addToCart as addToCartDB,
  removeFromCart as removeFromCartDB,
  updateCartItemQuantity as updateCartItemQuantityDB,
  changeItemSize as changeItemSizeDB,
  syncCartToDatabase,
  syncCartFromDatabase,
  getCartCount as getCartCountDB,
} from "@/actions/cart";
import { usePathname, useRouter } from "next/navigation";
// Define the type for our cart context
type CartContextType = {
  cartCount: number;
  addToCart: (productId: string, sizeId: string, quantity: number) => void;
  removeFromCart: (productId: string, sizeId: string) => void;
  changeItemQuantity: (
    productId: string,
    sizeId: string,
    quantity: number
  ) => void;
  changeItemSize: (
    productId: string,
    oldSizeId: string,
    newSizeId: string,
    newSizeStock: number
  ) => void;
  getCookieCartItems: () => Record<string, Record<string, number>>;
  removeFromCookieCart: (productId: string, sizeId: string) => void;
  isLoading: boolean;
};

// Create the context with default values
const CartContext = createContext<CartContextType>({
  cartCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  changeItemQuantity: () => {},
  changeItemSize: () => {},
  getCookieCartItems: () => ({}),
  removeFromCookieCart: () => {},
  isLoading: true,
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const { data: session, status } = useSession();
  const [previousUserId, setPreviousUserId] = useState<string | null>(null); // check if the user has logged in or out
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const calculateCartCount = (
    // calculate the total number of items in the cart in cookies
    items: Record<string, Record<string, number>>
  ) => {
    let totalCount = 0;
    if (items) {
      Object.values(items).forEach((sizeObj) => {
        Object.values(sizeObj as Record<string, number>).forEach((quantity) => {
          totalCount += quantity;
        });
      });
    }
    return totalCount;
  };

  // Get current cart items from cookies
  const getCookieCartItems = () => {
    const cartItems = getCookie("cart-items");
    if (cartItems) {
      try {
        return JSON.parse(cartItems);
      } catch (e) {
        console.error("Failed to parse cart items from cookie", e);
        return {};
      }
    }
    return {};
  };

  // Update cart items in cookies
  const setCookieCartItems = useCallback(
    (
      items: Record<string, Record<string, number>> // Record<productId, Record<sizeId, quantity>>
    ) => {
      setCookie("cart-items", JSON.stringify(items));
      setCartCount(calculateCartCount(items));
    },
    []
  );

  // Initialize cart and handle user login/logout
  useEffect(() => {
    const handleCartInitialization = async () => {
      if (status === "loading" || isLoggingIn || pathname === "/login") return;
      setIsLoading(true);
      try {
        const currentUserId = session?.user?.id || null;
        const cookieItems = getCookieCartItems();
        console.log("currentUserId", currentUserId, "status", status);
        console.log("previousUserId", previousUserId);

        // User just logged in
        if (currentUserId) {
          console.log("User logged in");

          // Check if cookie has data
          if (Object.keys(cookieItems).length > 0) {
            console.log(
              "Cookie has data, clearing DB and syncing cookie to DB"
            );
            setCartCount(calculateCartCount(cookieItems));
            // Clear database cart first, then sync cookie items
            // const clearResult = await clearCartDB(currentUserId);
            // console.log("Clear result:", clearResult);

            const syncResult = await syncCartToDatabase(
              currentUserId,
              cookieItems
            );
            console.log("Sync result:", syncResult);
            if (pathname === "/cart") {
              router.refresh();
            }
          } else {
            console.log("Cookie is empty, using existing DB data");
            const dbCartItems = await syncCartFromDatabase(currentUserId);
            console.log("dbCartItems", dbCartItems);
            setCookieCartItems(dbCartItems);

            // Get updated count from database
            const dbCount = await getCartCountDB(currentUserId);
            console.log("dbCount", dbCount, "type:", typeof dbCount);

            if (typeof dbCount === "number") {
              setCartCount(dbCount);
            } else {
              console.error("Invalid cart count:", dbCount);
              setCartCount(0);
            }
          }
        }
        // User is not logged in (refresh or initial load)
        else if (!currentUserId && status === "unauthenticated") {
          console.log("User not logged in, using cookie cart");
          const totalCount = calculateCartCount(cookieItems);
          setCartCount(totalCount);
        }

        setPreviousUserId(currentUserId);
      } catch (error) {
        console.error("Error in cart initialization:", error);
        setCartCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    handleCartInitialization();
  }, [
    session?.user?.id,
    status,
    previousUserId,
    setCookieCartItems,
    isLoggingIn,
    setIsLoading,
  ]);

  useEffect(() => {
    if (pathname === "/login" && status === "authenticated") {
      setIsLoggingIn(true);
    }
    if (pathname !== "/login" && status === "authenticated") {
      setIsLoggingIn(false);
    }
  }, [pathname, status]);

  const addToCart = async (
    productId: string,
    sizeId: string,
    quantity: number = 1
  ) => {
    const userId = session?.user?.id;

    if (userId) {
      // User is logged in - use database
      try {
        const result = await addToCartDB(userId, productId, sizeId, quantity);

        if (result && result.success) {
          const newCount = await getCartCountDB(userId);

          if (typeof newCount === "number") {
            setCartCount(newCount);
          } else {
            console.error("Invalid cart count after add:", newCount);
            setCartCount(0);
          }
        } else {
          console.error("Failed to add item to cart:", result);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
    // Update cookie cart items
    const cartItems = getCookieCartItems();
    if (!cartItems[productId]) {
      cartItems[productId] = {};
    }
    cartItems[productId][sizeId] =
      (cartItems[productId]?.[sizeId] || 0) + quantity;
    setCookieCartItems(cartItems);
  };
  const removeFromCookieCart = (productId: string, sizeId: string) => {
    const cartItems = getCookieCartItems();
    if (cartItems && cartItems[productId] && cartItems[productId][sizeId]) {
      delete cartItems[productId][sizeId];
      // Remove the product entirely if no sizes remain
      if (Object.keys(cartItems[productId]).length === 0) {
        delete cartItems[productId];
      }
      setCookieCartItems(cartItems);
    }
  };

  const removeFromCart = async (productId: string, sizeId: string) => {
    const userId = session?.user?.id;

    if (userId) {
      // User is logged in - use database
      try {
        const result = await removeFromCartDB(userId, productId, sizeId);
        console.log("Remove from cart result:", result);

        if (result && result.success) {
          const newCount = await getCartCountDB(userId);
          console.log(
            "New cart count after remove:",
            newCount,
            "type:",
            typeof newCount
          );

          if (typeof newCount === "number") {
            setCartCount(newCount);
          } else {
            console.error("Invalid cart count after remove:", newCount);
            setCartCount(0);
          }
        } else {
          console.error("Failed to remove item from cart:", result);
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
    // Update cookie cart items
    removeFromCookieCart(productId, sizeId);
  };

  const changeItemQuantity = async (
    productId: string,
    sizeId: string,
    quantity: number
  ) => {
    const userId = session?.user?.id;

    if (userId) {
      // User is logged in - use database
      try {
        const result = await updateCartItemQuantityDB(
          userId,
          productId,
          sizeId,
          quantity
        );

        if (result && result.success) {
          const newCount = await getCartCountDB(userId);

          if (typeof newCount === "number") {
            setCartCount(newCount);
          } else {
            console.error(
              "Invalid cart count after quantity change:",
              newCount
            );
            setCartCount(0);
          }
        } else {
          console.error("Failed to update item quantity:", result);
        }
      } catch (error) {
        console.error("Error updating item quantity:", error);
      }
    }
    // Update cookie cart items
    const cartItems = getCookieCartItems();
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      if (cartItems[productId] && cartItems[productId][sizeId]) {
        delete cartItems[productId][sizeId];
        if (Object.keys(cartItems[productId]).length === 0) {
          delete cartItems[productId];
        }
      }
    } else {
      if (!cartItems[productId]) {
        cartItems[productId] = {};
      }
      cartItems[productId][sizeId] = quantity;
    }
    setCookieCartItems(cartItems);
  };

  const changeItemSize = async (
    productId: string,
    oldSizeId: string,
    newSizeId: string,
    newSizeStock: number
  ) => {
    const userId = session?.user?.id;

    if (userId) {
      // User is logged in - use database
      try {
        const result = await changeItemSizeDB(
          userId,
          productId,
          oldSizeId,
          newSizeId
        );
        console.log("Change size result:", result);

        if (result && result.success) {
          const newCount = await getCartCountDB(userId);
          console.log(
            "New cart count after size change:",
            newCount,
            "type:",
            typeof newCount
          );

          if (typeof newCount === "number") {
            setCartCount(newCount);
          } else {
            console.error("Invalid cart count after size change:", newCount);
            setCartCount(0);
          }
        } else {
          console.error("Failed to change item size:", result);
        }
      } catch (error) {
        console.error("Error changing item size:", error);
      }
    }
    // Update cookie cart items
    const cartItems = getCookieCartItems();
    if (cartItems[productId] && cartItems[productId][oldSizeId] != null) {
      const oldQuantity = cartItems[productId][oldSizeId];
      const newQuantity = cartItems[productId][newSizeId] || 0;
      cartItems[productId][newSizeId] = Math.min(
        newQuantity + oldQuantity,
        newSizeStock
      );
      delete cartItems[productId][oldSizeId];
      setCookieCartItems(cartItems);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        addToCart,
        removeFromCart,
        changeItemQuantity,
        changeItemSize,
        getCookieCartItems,
        removeFromCookieCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
