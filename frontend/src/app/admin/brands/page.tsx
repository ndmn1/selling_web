import React from "react";
import Link from "next/link";
import { MdAdd } from "react-icons/md";
import BrandSearch from "./_components/BrandSearch";
import BrandList from "./_components/BrandList";
import PaginationClient from "@/components/PaginationClient";
import { getBrands } from "@/actions/brand";

interface BrandsPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function BrandsPage({ searchParams }: BrandsPageProps) {
  const { search, page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;
  const limit = 10; // Items per page

  const { brands, total } = await getBrands(search, currentPage, limit);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý thương hiệu</h1>
        <Link
          href="/admin/brands/new"
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <MdAdd className="w-5 h-5" />
          <span>Thêm thương hiệu</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="mb-6 max-w-md">
          <BrandSearch />
        </div>
        <BrandList initialBrands={brands} />

        {total > 0 && (
          <div className="mt-6">
            <PaginationClient
              total={total}
              itemPerPage={limit}
              curPage={currentPage}
              pageParamName="page"
            />
          </div>
        )}
      </div>
    </div>
  );
}
