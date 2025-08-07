import { auth } from "@/auth";
import { getCartProducts } from "@/data/product";
import { getCartItemFromCookies } from "@/actions/cart";
import { CartProduct } from "@/types/product";
import CartItemsClient from "./CartItemsClient";
import { cookies } from "next/headers";

// Server Component for data fetching
async function CartItemServer() {
  const session = await auth();
  let serverCartItems: CartProduct[] = [];

  if (session?.user?.id) {
    // User is logged in - fetch cart items from database
    try {
      serverCartItems = await getCartProducts(session.user.id);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      serverCartItems = [];
    }
  } else {
    // User not logged in - get cart items from cookies
    try {
      const cookieStore = await cookies();
      const cartCookie = cookieStore.get("cart-items");

      if (cartCookie) {
        const cookieCartItems = JSON.parse(cartCookie.value);
        serverCartItems = await getCartItemFromCookies(cookieCartItems);
      }
    } catch (error) {
      console.error("Error parsing cart items from cookies:", error);
      serverCartItems = [];
    }
  }

  return (
    <CartItemsClient
      serverCartItems={serverCartItems}
    />
  );
}

export default CartItemServer;
