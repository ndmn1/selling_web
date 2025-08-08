import React from "react";
import { notFound } from "next/navigation";
import BrandForm from "./_components/BrandForm";
import {
  getBrandById,
  createBrand,
  updateBrand,
  type BrandFormData,
} from "@/actions/brand";

interface BrandPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { id } = await params;
  const isNew = id === "new";
  const brand = !isNew ? await getBrandById(id) : null;

  if (!isNew && !brand) {
    notFound();
  }

  async function onSubmit(data: BrandFormData) {
    "use server";

    if (isNew) {
      await createBrand(data);
    } else {
      await updateBrand(id, data);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {isNew ? "Thêm thương hiệu mới" : "Chỉnh sửa thương hiệu"}
      </h1>
      <div className="bg-white rounded-lg p-6">
        <BrandForm initialData={brand} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
