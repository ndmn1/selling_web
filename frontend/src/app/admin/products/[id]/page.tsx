import React from "react";
import { notFound } from "next/navigation";
import ProductForm from "./_components/ProductForm";
import {
  getProductById,
  createProduct,
  updateProduct,
  type ProductFormData,
} from "@/actions/product";
import { getBrands } from "@/actions/brand";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const isNew = id === "new";
  const product = !isNew ? await getProductById(id) : null;

  if (!isNew && !product) {
    notFound();
  }

  // Get all brands for the dropdown
  const { brands } = await getBrands();

  async function onSubmit(data: ProductFormData) {
    "use server";

    if (isNew) {
      await createProduct(data);
    } else {
      await updateProduct(id, data);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {isNew ? "Thêm sản phẩm mới" : `Chỉnh sửa: ${product?.name}`}
          </h1>
          {!isNew && (
            <p className="text-sm text-gray-600 mt-1">ID: {product?.id}</p>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg p-6">
        <ProductForm
          initialData={product}
          brands={brands}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
