export type Product = {
  id: string;
  name: string;
  brandId: string;
  brand: {
    id: string;
    name: string;
  };
  mainImage: string;
  price: number;
  discount: number;
  description: string;
  images: string[];
  sizes: {
    id: string;
    size: string;
    stock: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    cartItems: number;
    orderItems: number;
  };
};

export type ProductFormData = {
  name: string;
  brandId: string;
  mainImage: string;
  price: number;
  discount: number;
  description: string;
  images: string[];
  sizes: {
    size: string;
    stock: number;
  }[];
};


