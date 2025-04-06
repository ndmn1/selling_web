export interface Product {
  id: string
  name: string
  brand: string
  mainImage: string
  price: number
  salePrice: number
  discount: number
}

export interface DetailedProduct extends Product {
  images: string[]
  description: string
  sizes: {
    size: string
    stock: number
  }[]

}

export interface CartProduct extends Product {
  cartId: string
  quantity: number
  selectedSize: string
  sizes: {
    size: string
    stock: number
  }[]
}