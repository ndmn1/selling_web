import { db } from "@/lib/db"
import type { CartProduct, DetailedProduct, Product } from "@/types/product"
import type { SearchParams } from "@/app/(user)/all/page"
import { Brand } from "@prisma/client";
// Server-side functions to get products
export async function getProducts(searchParams: SearchParams): Promise<{ products: Product[], total: number }> {
  const params = await searchParams;
  
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

export async function getBrands(): Promise<Brand[]> {
  const brands = await db.brand.findMany();
  return brands;
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
          product: {
            include: {
              sizes: true,
              brand: true,
            },
          },
          size: true,
        },
      },
    },
  })

  if (!cart) return []

  const cartItems = cart.items.map((item) => ({
    cartId: item.id,
    id: item.product.id,
    name: item.product.name,
    brand: item.product.brand.name,
    mainImage: item.product.mainImage,
    price: item.product.price,
    salePrice: item.product.price * (1 - item.product.discount / 100),
    discount: item.product.discount,
    quantity: item.quantity,
    selectedSize: item.size.size,
    sizes: item.product.sizes.map((size) => ({
      id: size.id,
      size: size.size,
      stock: size.stock,
    })),
  }))
  return cartItems;
}

// For client-side initial state or fallback
export const initialProducts: Product[] = [
  {
    id: "1",
    name: "i-Shirt Champion White",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 239000,
    discount: 24,
  },
  {
    id: "2",
    name: "i-Shirt Champion Light White",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 198000,
    discount: 32,
  },
  {
    id: "3",
    name: "i-Shirt Champion Blue",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 239000,
    discount: 24,
  },
  {
    id: "4",
    name: "i-Shirt Champion Black",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 198000,
    discount: 32,
  },
  {
    id: "5",
    name: "i-Shirt Champion Yellow",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 239000,
    discount: 24,
  },
  {
    id: "6",
    name: "i-Shirt Champion Red",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 198000,
    discount: 32,
  },
  {
    id: "7",
    name: "Adilette Shower | AQ1702",
    brand: "Adidas",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 799000,
    salePrice: 599000,
    discount: 24,
  },
  {
    id: "8",
    name: "Air Jordan 1 Mid 'Hyper Royal' | 554724-077",
    brand: "Nike",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 3999000,
    salePrice: 3399000,
    discount: 15,
  },
  {
    id: "9",
    name: "Puma Suede Classic XXI Malachite White Mens",
    brand: "Puma",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 2500000,
    salePrice: 1799000,
    discount: 28,
  },
  {
    id: "10",
    name: "Puma Suede XL Team Royal White Men Unisex | 395205-01",
    brand: "Puma",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 2500000,
    salePrice: 1799000,
    discount: 28,
  },
  //create 20 more products
  {
    id: "11",
    name: "i-Shirt Champion White",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 239000,
    discount: 24,
  },
  {
    id: "12",
    name: "i-Shirt Champion Light White",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 198000,
    discount: 32,
  },
  {
    id: "13",
    name: "i-Shirt Champion Blue",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 239000,
    discount: 24,
  },
  {
    id: "14",
    name: "i-Shirt Champion Black",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 198000,
    discount: 32,
  },
  {
    id: "15",
    name: "i-Shirt Champion Yellow",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 239000,
    discount: 24,
  },
  {
    id: "16",
    name: "i-Shirt Champion Red",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 198000,
    discount: 32,
  },
  {
    id: "17",
    name: "Adilette Shower | AQ1702",
    brand: "Adidas",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 799000,
    salePrice: 599000,
    discount: 24,
  },
]

export const detailProducts : DetailedProduct[] = [
  {
    id: "1",
    name: "i-Shirt Champion White",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
    price: 299000,
    salePrice: 239000,
    discount: 24,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla augue nec est tristique auctor. Donec non est at libero.",
    sizes: [
      {
        id: "1-s",
        size: "S",
        stock: 5,
      },
      {
        id: "1-m",
        size: "M",
        stock: 10,
      },
      {
        id: "1-l",
        size: "L",
        stock: 0,
      },
    ],
  },
  {
    id: "2",
    name: "i-Shirt Champion Light White",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
    price: 299000,
    salePrice: 198000,
    discount: 32,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla augue nec est tristique auctor. Donec non est at libero.",
    sizes: [
      {
        id: "2-s",
        size: "S",
        stock: 5,
      },
      {
        id: "2-m",
        size: "M",
        stock: 10,
      },
      {
        id: "2-l",
        size: "L",
        stock: 0,
      },
    ],
  },
  {
    id: "3",
    name: "i-Shirt Champion Blue",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
    price: 299000,
    salePrice: 239000,
    discount: 24,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla augue nec est tristique auctor. Donec non est at libero.",
    sizes: [
      {
        id: "3-s",
        size: "S",
        stock: 5,
      },
      {
        id: "3-m",
        size: "M",
        stock: 10,
      },
      {
        id: "3-l",
        size: "L",
        stock: 0,
      },
    ],
  },
  {
    id: "4",
    name: "i-Shirt Champion Black",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
    price: 299000,
    salePrice: 198000,
    discount: 32,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla augue nec est tristique auctor. Donec non est at libero.",
    sizes: [
      {
        id: "4-s",
        size: "S",
        stock: 5,
      },
      {
        id: "4-m",
        size: "M",
        stock: 10,
      },
      {
        id: "4-l",
        size: "L",
        stock: 0,
      },
    ],
  }, 
]


//create 20 cart Products
export const cartProducts: CartProduct[] = [
  {
    cartId: "1",
    id: "1",
    name: "i-Shirt Champion White",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 239000,
    discount: 24,
    quantity: 1,
    selectedSize: "S",
    sizes: [
      {
        id: "1-s",
        size: "S",
        stock: 5,
      },
      {
        id: "1-m",
        size: "M",
        stock: 10,
      },
      {
        id: "1-l",
        size: "L",
        stock: 0,
      },
    ],
  },
  {
    cartId: "2",
    id: "2",
    name: "i-Shirt Champion Light White",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 198000,
    discount: 32,
    quantity: 1,
    selectedSize: "M",
    sizes: [
      {
        id: "2-s",
        size: "S",
        stock: 5,
      },
      {
        id: "2-m",
        size: "M",
        stock: 10,
      },
      {
        id: "2-l",
        size: "L",
        stock: 0,
      },
    ],
  },
  {
    cartId: "3",
    id: "3",
    name: "i-Shirt Champion Blue",
    brand: "Champion",
    mainImage: "/placeholder.svg?height=300&width=300",
    price: 299000,
    salePrice: 239000,
    discount: 24,
    quantity: 1,
    selectedSize: "L",
    sizes: [
      {
        id: "3-s",
        size: "S",
        stock: 5,
      },
      {
        id: "3-m",
        size: "M",
        stock: 10,
      },
      {
        id: "3-l",
        size: "L",
        stock: 0,
      },
    ],
  },
]

