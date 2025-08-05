import React, { Suspense } from "react";
import Link from "next/link";
import { MdAdd } from "react-icons/md";
import ProductSearch from "./_components/ProductSearch";
import ProductsData from "./_components/ProductsData";
import BrandsData from "./_components/BrandsData";
import LoadingCircle from "@/components/LoadingCircle";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    brand?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const { search, page, brand } = resolvedParams;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <MdAdd className="w-5 h-5" />
          <span>Thêm sản phẩm</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="mb-6 flex justify-between items-center">
          <ProductSearch />
          <Suspense fallback={<div>Loading...</div>}>
            <BrandsData />
          </Suspense>
        </div>
        <Suspense
          key={JSON.stringify(resolvedParams)}
          fallback={<LoadingCircle />}
        >
          <ProductsData search={search} page={page} brand={brand} />
        </Suspense>
      </div>
    </div>
  );
}
