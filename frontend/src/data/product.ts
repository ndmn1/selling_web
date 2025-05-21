import { db } from "@/lib/db"
import type { CartProduct, DetailedProduct, Product } from "@/types/product"

// Server-side functions to get products
export async function getProducts(page: number = 1, limit: number = 1): Promise<{ products: Product[], total: number }> {
  const skip = (page - 1) * limit;
  
  const [products, total] = await Promise.all([
    db.product.findMany({
      include: {
        sizes: true,
      },
      skip,
      take: limit,
    }),
    db.product.count()
  ]);

  return {
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      mainImage: product.mainImage,
      price: product.price,
      salePrice: product.price * (1 - product.discount / 100),
      discount: product.discount,
    })),
    total
  };
}

export async function getProductById(id: string): Promise<DetailedProduct | null> {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      sizes: true,
    },
  })

  if (!product) return null

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    mainImage: product.mainImage,
    images: product.images,
    price: product.price,
    salePrice: product.price * (1 - product.discount / 100),
    discount: product.discount,
    description: product.description,
    sizes: product.sizes.map((size) => ({
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
            },
          },
          size: true,
        },
      },
    },
  })

  if (!cart) return []

  return cart.items.map((item) => ({
    cartId: item.id,
    id: item.product.id,
    name: item.product.name,
    brand: item.product.brand,
    mainImage: item.product.mainImage,
    price: item.product.price,
    salePrice: item.product.price * (1 - item.product.discount / 100),
    discount: item.product.discount,
    quantity: item.quantity,
    selectedSize: item.size.size,
    sizes: item.product.sizes.map((size) => ({
      size: size.size,
      stock: size.stock,
    })),
  }))
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
        size: "S",
        stock: 5,
      },
      {
        size: "M",
        stock: 10,
      },
      {
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
        size: "S",
        stock: 5,
      },
      {
        size: "M",
        stock: 10,
      },
      {
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
        size: "S",
        stock: 5,
      },
      {
        size: "M",
        stock: 10,
      },
      {
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
        size: "S",
        stock: 5,
      },
      {
        size: "M",
        stock: 10,
      },
      {
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
        size: "S",
        stock: 5,
      },
      {
        size: "M",
        stock: 10,
      },
      {
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
        size: "S",
        stock: 5,
      },
      {
        size: "M",
        stock: 10,
      },
      {
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
        size: "S",
        stock: 5,
      },
      {
        size: "M",
        stock: 10,
      },
      {
        size: "L",
        stock: 0,
      },
    ],
  },
]

