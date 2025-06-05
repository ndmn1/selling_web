"use server"
import { db } from "@/lib/db"

const prisma = db

// Type definitions
type CartItems = {
  [productId: string]: {
    [sizeId: string]: number
  }
}

// Sync cart between cookie and database (mock implementation)
export async function syncCart(cookieCart: CartItems): Promise<CartItems> {
  // For demo purposes, just return the cookie cart
  return cookieCart
}

// Add item to cart (for logged-in users)
export async function addToCart(userId: string, productId: string, sizeId: string, quantity: number = 1) {
  try {
    // Get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      })
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_sizeId: {
          cartId: cart.id,
          productId,
          sizeId
        }
      }
    })

    if (existingItem) {
      // Update quantity if item exists
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          sizeId,
          quantity
        }
      })
    }

  //  revalidatePath("/cart")
    return { success: true, message: "Item added to cart" }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return { success: false, message: "Failed to add item to cart" }
  }
}

// Remove item from cart (for logged-in users)
export async function removeFromCart(userId: string, productId: string, sizeId: string) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true
      }
    })

    if (!cart) {
      throw new Error("Cart not found")
    }

    // Find the cart item to remove
    const cartItem = cart.items.find(item => 
      item.productId === productId && item.sizeId === sizeId
    )

    if (!cartItem) {
      throw new Error("Cart item not found")
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id }
    })

   // revalidatePath("/cart")
    return { success: true, message: "Item removed from cart" }
  } catch (error) {
    console.error("Error removing from cart:", error)
    return { success: false, message: "Failed to remove item from cart" }
  }
}

// Update cart item quantity (for logged-in users)
export async function updateCartItemQuantity(userId: string, productId: string, sizeId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      return removeFromCart(userId, productId, sizeId)
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true
      }
    })

    if (!cart) {
      throw new Error("Cart not found")
    }

    // Find the cart item to update
    const cartItem = cart.items.find(item => 
      item.productId === productId && item.sizeId === sizeId
    )

    if (!cartItem) {
      throw new Error("Cart item not found")
    }

    await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity }
    })

   // revalidatePath("/cart")
    return { success: true, message: "Cart updated" }
  } catch (error) {
    console.error("Error updating cart:", error)
    return { success: false, message: "Failed to update cart" }
  }
}

// Change item size (for logged-in users)
export async function changeItemSize(userId: string, productId: string, oldSizeId: string, newSizeId: string) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true
      }
    })

    if (!cart) {
      throw new Error("Cart not found")
    }

    // Find the old cart item
    const oldCartItem = cart.items.find(item => 
      item.productId === productId && item.sizeId === oldSizeId
    )

    if (!oldCartItem) {
      throw new Error("Cart item not found")
    }

    // Check if item with new size already exists
    const existingNewItem = cart.items.find(item => 
      item.productId === productId && item.sizeId === newSizeId
    )

    if (existingNewItem) {
      // Update existing item quantity and remove old item
      await prisma.cartItem.update({
        where: { id: existingNewItem.id },
        data: { quantity: existingNewItem.quantity + oldCartItem.quantity }
      })
      await prisma.cartItem.delete({
        where: { id: oldCartItem.id }
      })
    } else {
      // Update the size of the existing item
      await prisma.cartItem.update({
        where: { id: oldCartItem.id },
        data: { sizeId: newSizeId }
      })
    }

   // revalidatePath("/cart")
    return { success: true, message: "Item size updated" }
  } catch (error) {
    console.error("Error changing item size:", error)
    return { success: false, message: "Failed to change item size" }
  }
}

// Clear entire cart (for logged-in users)
export async function clearCart(userId: string) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId }
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      })
    }

  //  revalidatePath("/cart")
    return { success: true, message: "Cart cleared" }
  } catch (error) {
    console.error("Error clearing cart:", error)
    return { success: false, message: "Failed to clear cart" }
  }
}

// Sync cart from cookies to database (when user logs in)
export async function syncCartToDatabase(userId: string, cookieCart: CartItems) {
  try {
    // Get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true
      }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: true
        }
      })
    }

    // Process each item from cookies
    for (const [productId, sizes] of Object.entries(cookieCart)) {
      for (const [sizeId, quantity] of Object.entries(sizes)) {
        if (quantity > 0) {
          // Check if item already exists in database cart
          const existingItem = cart.items.find(item => 
            item.productId === productId && item.sizeId === sizeId
          )

          if (existingItem && existingItem.quantity !== quantity) {
            // Update quantity (add cookie quantity to existing)
            await prisma.cartItem.update({
              where: { id: existingItem.id },
              data: { quantity: quantity }
            })
          } else {
            // Create new cart item
            await prisma.cartItem.create({
              data: {
                cartId: cart.id,
                productId,
                sizeId,
                quantity
              }
            })
          }
        }
      }
    }

   // revalidatePath("/cart")
    return { success: true, message: "Cart synced to database" }
  } catch (error) {
    console.error("Error syncing cart to database:", error)
    return { success: false, message: "Failed to sync cart" }
  }
}

// Sync cart from database to cookies (when user logs out)
export async function syncCartFromDatabase(userId: string): Promise<CartItems> {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true
      }
    })

    if (!cart) {
      return {}
    }

    const cookieCart: CartItems = {}

    cart.items.forEach(item => {
      if (!cookieCart[item.productId]) {
        cookieCart[item.productId] = {}
      }
      cookieCart[item.productId][item.sizeId] = item.quantity
    })

    return cookieCart
  } catch (error) {
    console.error("Error syncing cart from database:", error)
    return {}
  }
}

// Get cart total count (for logged-in users)
export async function getCartCount(userId: string) {
  try {
    console.log("Getting cart count for user:", userId);
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true
      }
    })
    console.log("Cart found:", cart ? "Yes" : "No");
    if (!cart) return 0
    
    const totalCount = cart.items.reduce((total: number, item) => total + item.quantity, 0)
    console.log("Total cart count:", totalCount);
    return totalCount
  } catch (error) {
    console.error("Error getting cart count:", error)
    return 0
  }
}

// Get cart total price
export async function getCartTotal() {
  try {
    const userId = "temp-user-id" // Replace with actual session user ID

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!cart) return 0

    return cart.items.reduce((total: number, item) => {
      const price = item.product.price - (item.product.price * item.product.discount / 100)
      return total + (price * item.quantity)
    }, 0)
  } catch (error) {
    console.error("Error getting cart total:", error)
    return 0
  }
}

// Get cart items from cookies (for guest users)
export async function getCartItemFromCookies(cookieCartItems: CartItems) {
  try {
    const flattenedItems = [];

    // Convert the nested structure to a flat array for display
    for (const [productId, sizes] of Object.entries(cookieCartItems)) {
      for (const [sizeId, quantity] of Object.entries(sizes)) {
        if (quantity > 0) {
          // Get product details from database
          const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
              sizes: true,
            },
          });

          if (product) {
            // Find the specific size
            const selectedSize = product.sizes.find(size => size.id === sizeId);
            
            if (selectedSize) {
              flattenedItems.push({
                cartId: `${productId}-${selectedSize.size}`,
                id: product.id,
                name: product.name,
                brand: product.brand,
                mainImage: product.mainImage,
                price: product.price,
                salePrice: product.price * (1 - product.discount / 100),
                discount: product.discount,
                quantity,
                selectedSize: selectedSize.size,
                sizes: product.sizes.map((size) => ({
                  id: size.id,
                  size: size.size,
                  stock: size.stock,
                })),
              });
            }
          }
        }
      }
    }

    return flattenedItems;
  } catch (error) {
    console.error("Error getting cart items from cookies:", error);
    return [];
  }
}





