import { db } from "@/lib/db"
import type { CartProduct, DetailedProduct, Product } from "@/types/product"

// Server-side functions to get products
export async function getProducts(searchParams: {
  [key: string]: string | string[] | undefined;
}): Promise<{ products: Product[], total: number }> {
  const params = searchParams;
  
  // Extract search parameters
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 24;
  const search = params.search as string;
  const brandName = params.brand as string | string[];
  const size = params.size as string | string[];
  const from = params.from as string;
  const to = params.to as string;
  const sort = params.sort as string;
  const order = params.order as string;
  
  const skip = (page - 1) * limit;
  
  // Build where conditions
  const whereConditions: Record<string, unknown> = {};
  
  // Search by name
  if (search) {
    whereConditions.name = {
      contains: search,
      mode: 'insensitive' as const
    };
  }
  // Filter by brand
  if (brandName) {
    const brands = Array.isArray(brandName) ? brandName : [brandName];
    whereConditions.brand = {
      name: {
        in: brands,
        mode: 'insensitive' as const
      }
    };
  }
  // Filter by price range
  if (from || to) {
    whereConditions.price = {};
    if (from) {
      (whereConditions.price as Record<string, number>).gte = Number(from);
    }
    if (to) {
      (whereConditions.price as Record<string, number>).lte = Number(to);
    }
  }
  // Build orderBy
  let orderBy: Record<string, string> = { createdAt: 'desc' };
  if (sort && order) {
    orderBy = { [sort]: order };
  }


  if (size) {
    // If size filter is applied, use database pagination with size filtering
    const sizes = Array.isArray(size) ? size : [size];
    
    // Get paginated products that have the specified sizes with stock > 0
    const [products, total] = await Promise.all([
      db.product.findMany({
        where: {
          ...whereConditions,
          sizes: {
            some: {
              size: {
                in: sizes
              },
              stock: {
                gt: 0
              }
            }
          }
        },
        include: {
          sizes: true,
          brand: true,
        },
        skip,
        take: limit,
        orderBy,
      }),
      db.product.count({
        where: {
          ...whereConditions,
          sizes: {
            some: {
              size: {
                in: sizes
              },
              stock: {
                gt: 0
              }
            }
          }
        },
      }),
    ]);
     return {
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand.name,
      mainImage: product.mainImage,
      price: product.price,
      salePrice: product.price * (1 - product.discount / 100),
      discount: product.discount,
    })),
    total
  };
  } else {
    // No size filter - use regular query
    const [products, total] = await Promise.all([
      db.product.findMany({
        where: whereConditions,
        include: {
          sizes: true,
          brand: true,
        },
        skip,
        take: limit,
        orderBy,
      }),
      db.product.count({
        where: whereConditions,
      }),
    ]);
     return {
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand.name,
      mainImage: product.mainImage,
      price: product.price,
      salePrice: product.price * (1 - product.discount / 100),
      discount: product.discount,
    })),
    total
  };
  }

 
}



export async function getProductById(id: string): Promise<DetailedProduct | null> {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      sizes: true,
      brand: true,
    },
  })

  if (!product) return null

  return {
    id: product.id,
    name: product.name,
    brand: product.brand.name,
    mainImage: product.mainImage,
    images: product.images,
    price: product.price,
    salePrice: product.price * (1 - product.discount / 100),
    discount: product.discount,
    description: product.description,
    sizes: product.sizes.map((size) => ({
      id: size.id,
      size: size.size,
      stock: size.stock,
    })),
  }
}

export async function getCartProducts(userId: string): Promise<CartProduct[]> {
  const cart = await db.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          size: {
            include: {
              product: {
                include: {
                  sizes: true,
                  brand: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!cart) return []

  const cartItems = cart.items.map((item) => ({
    cartId: item.id,
    id: item.size.product.id,
    name: item.size.product.name,
    brand: item.size.product.brand.name,
    mainImage: item.size.product.mainImage,
    price: item.size.product.price,
    salePrice: item.size.product.price * (1 - item.size.product.discount / 100),
    discount: item.size.product.discount,
    quantity: item.quantity,
    selectedSize: item.size.size,
    sizes: item.size.product.sizes.map((size) => ({
      id: size.id,
      size: size.size,
      stock: size.stock,
    })),
  }))
  return cartItems;
}



