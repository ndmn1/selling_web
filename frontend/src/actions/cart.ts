"use server"
import { db } from "@/lib/db"

const prisma = db

// Type definitions
type CartItems = {
  [sizeId: string]: number
}

// Sync cart between cookie and database (mock implementation)
export async function syncCart(cookieCart: CartItems): Promise<CartItems> {
  // For demo purposes, just return the cookie cart
  return cookieCart
}

// Add item to cart (for logged-in users)
export async function addToCart(userId: string, sizeId: string, quantity: number = 1) {
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
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        sizeId
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
export async function removeFromCart(userId: string, sizeId: string) {
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
      item.sizeId === sizeId
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
export async function updateCartItemQuantity(userId: string, sizeId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      return removeFromCart(userId, sizeId)
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
      item.sizeId === sizeId
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
export async function changeItemSize(userId: string, oldSizeId: string, newSizeId: string) {
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
      item.sizeId === oldSizeId
    )

    if (!oldCartItem) {
      throw new Error("Cart item not found")
    }

    // Check if item with new size already exists
    const existingNewItem = cart.items.find(item => 
      item.sizeId === newSizeId
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
    for (const [sizeId, quantity] of Object.entries(cookieCart)) {
      if (quantity > 0) {
        // Check if item already exists in database cart
        const existingItem = cart.items.find(item => 
          item.sizeId === sizeId
        )

        if (existingItem) {
          if(existingItem.quantity !== quantity){
          // Update quantity (add cookie quantity to existing)
            await prisma.cartItem.update({
              where: { id: existingItem.id },
              data: { quantity: quantity }
            })
          }
        } else {
          // Create new cart item
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              sizeId,
              quantity
            }
          })
        }
      }
    }

    // Get the updated cart from database to return as cookie data
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true
      }
    })

    // Convert database cart back to cookie format
    const updatedCookieCart: CartItems = {}
    if (updatedCart) {
      updatedCart.items.forEach(item => {
        updatedCookieCart[item.sizeId] = item.quantity
      })
    }

   // revalidatePath("/cart")
    return { 
      success: true, 
      message: "Cart synced to database",
      cookieCart: updatedCookieCart
    }
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
      cookieCart[item.sizeId] = item.quantity
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
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true
      }
    })
    if (!cart) return 0
    
    const totalCount = cart.items.reduce((total: number, item) => total + item.quantity, 0)
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
            size: {
              include: {
                product: true
              }
            }
          }
        }
      }
    })

    if (!cart) return 0

    return cart.items.reduce((total: number, item) => {
      const price = item.size.product.price - (item.size.product.price * item.size.product.discount / 100)
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

    // Get all size IDs from cookie cart items
    const sizeIds = Object.keys(cookieCartItems);

    if (sizeIds.length === 0) {
      return [];
    }

    // Get all sizes with their products and brands using Prisma
    const sizes = await prisma.size.findMany({
      where: { 
        id: { 
          in: sizeIds 
        } 
      },
      include: {
        product: {
          include: {
            brand: true,
            sizes: true,
          }
        }
      },
    });

    // Create a map for quick size lookup
    const sizeMap = new Map(sizes.map(size => [size.id, size]));

    // Convert the structure to a flat array for display
    for (const [sizeId, quantity] of Object.entries(cookieCartItems)) {
      if (quantity > 0) {
        const size = sizeMap.get(sizeId);
        
        if (size) {
          const product = size.product;
          flattenedItems.push({
            cartId: `${product.id}-${size.size}`,
            id: product.id,
            name: product.name,
            brand: product.brand.name,
            mainImage: product.mainImage,
            price: product.price,
            salePrice: product.price * (1 - product.discount / 100),
            discount: product.discount,
            quantity,
            selectedSize: size.size,
            selectedSizeId: size.id,
            selectedSizeStock: size.stock,
            sizes: product.sizes.map((s) => ({
              id: s.id,
              size: s.size,
              stock: s.stock,
            })),
          });
        }
      }
    }

    return flattenedItems;
  } catch (error) {
    console.error("Error getting cart items from cookies:", error);
    return [];
  }
}





