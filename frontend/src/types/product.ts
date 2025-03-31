export interface Product {
  id: string
  name: string
  brand: string
  mainImage: string
  price: number
  salePrice: number
  discount: number
}

export interface DetailedProduct {
  id: string
  name: string
  brand: string
  mainImage: string
  images: string[]
  price: number
  salePrice: number
  discount: number
  description: string
  sizes: {
    size: string
    stock: number
  }[]

}