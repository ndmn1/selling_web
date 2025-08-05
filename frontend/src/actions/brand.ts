"use server";
import { db } from "@/lib/db";

export type Brand = {
  id: string;
  name: string;
  logo: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    products: number;
  };
};

export type BrandFormData = {
  name: string;
  logo: string;
  description?: string;
};

export async function getBrands(search?: string, page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;
    
    const [brands, total] = await Promise.all([
      db.brand.findMany({
        where: {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        include: {
          _count: {
            select: { products: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      db.brand.count({
        where: {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        }
      })
    ]);

    return {
      brands,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw new Error('Failed to fetch brands');
  }
}

export async function getBrandById(id: string) {
  try {
    const brand = await db.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    return brand;
  } catch (error) {
    console.error('Error fetching brand:', error);
    throw new Error('Failed to fetch brand');
  }
}

export async function createBrand(data: BrandFormData) {
  try {
    const brand = await db.brand.create({
      data: {
        name: data.name,
        logo: data.logo || null,
        description: data.description || null
      }
    });

    return brand;
  } catch (error) {
    console.error('Error creating brand:', error);
    throw new Error('Failed to create brand');
  }
}

export async function updateBrand(id: string, data: BrandFormData) {
  try {
    const brand = await db.brand.update({
      where: { id },
      data: {
        name: data.name,
        logo: data.logo || null,
        description: data.description || null
      }
    });

    return brand;
  } catch (error) {
    console.error('Error updating brand:', error);
    throw new Error('Failed to update brand');
  }
}

export async function deleteBrand(id: string) {
  try {
    await db.brand.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw new Error('Failed to delete brand');
  }
}



export async function deleteBrandWithImage(id: string, logoUrl?: string | null) {
  try {
    // Delete the brand image if it exists
    if (logoUrl) {
      const { deleteImage } = await import("./upload");
      await deleteImage(logoUrl);
    }
    
    // Delete the brand from database
    await db.brand.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw new Error('Failed to delete brand');
  }
} 