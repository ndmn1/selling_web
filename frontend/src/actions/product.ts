"use server";
import { LocalImagePaths } from "@/constant";
import { db } from "@/lib/db";

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

export async function getProducts(search?: string, page: number = 1, limit: number = 10, brandName?: string) {
  try {
    const skip = (page - 1) * limit;
    
    // Build where conditions
    const whereConditions: {
      name?: { contains: string; mode: 'insensitive' };
      brand?: { name: { in: string[]; mode: 'insensitive' } };
    } = {};
    
    if (search) {
      whereConditions.name = {
        contains: search,
        mode: 'insensitive'
      };
    }
    
    if (brandName) {
      const brands = Array.isArray(brandName) ? brandName : [brandName];
      whereConditions.brand = {
        name: {
          in: brands,
          mode: 'insensitive'
        }
      };
    }
    
    const [products, total] = await Promise.all([
      db.product.findMany({
        where: whereConditions,
        include: {
          brand: {
            select: {
              id: true,
              name: true
            }
          },
          sizes: {
            select: {
              id: true,
              size: true,
              stock: true
            }
          },
          _count: {
            select: {
              cartItems: true,
              orderItems: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      db.product.count({
        where: whereConditions
      })
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        brand: {
          select: {
            id: true,
            name: true
          }
        },
        sizes: {
          select: {
            id: true,
            size: true,
            stock: true
          }
        },
        _count: {
          select: {
            cartItems: true,
            orderItems: true
          }
        }
      }
    });

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
}

export async function createProduct(data: ProductFormData) {
  try {
    const product = await db.product.create({
      data: {
        name: data.name,
        brandId: data.brandId,
        mainImage: data.mainImage,
        price: data.price,
        discount: data.discount,
        description: data.description,
        images: data.images,
        sizes: {
          create: data.sizes
        }
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true
          }
        },
        sizes: {
          select: {
            id: true,
            size: true,
            stock: true
          }
        }
      }
    });

    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

export async function updateProduct(id: string, data: ProductFormData) {
  try {
    // First, delete existing sizes
    await db.size.deleteMany({
      where: { productId: id }
    });

    // Then update the product with new data
    const product = await db.product.update({
      where: { id },
      data: {
        name: data.name,
        brandId: data.brandId,
        mainImage: data.mainImage,
        price: data.price,
        discount: data.discount,
        description: data.description,
        images: data.images,
        sizes: {
          create: data.sizes
        }
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true
          }
        },
        sizes: {
          select: {
            id: true,
            size: true,
            stock: true
          }
        }
      }
    });

    return product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
}

export async function deleteProductWithImages(id: string, mainImage?: string | null, images?: string[]) {
  try {
    // Delete the product images if they exist
    if (mainImage) {
      const { deleteImage } = await import("./upload");
      await deleteImage(mainImage, LocalImagePaths.PRODUCT);
    }
    
    if (images && images.length > 0) {
      const { deleteImage } = await import("./upload");
      for (const image of images) {
        await deleteImage(image, LocalImagePaths.PRODUCT);
      }
    }
    
    // Delete the product from database
    await db.product.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
} 