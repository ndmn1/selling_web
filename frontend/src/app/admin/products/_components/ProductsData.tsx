import React from "react";
import ProductList from "./ProductList";
import PaginationClient from "@/components/PaginationClient";
import { getProducts } from "@/actions/product";

interface ProductsDataProps {
  search?: string;
  page?: string;
  brand?: string;
}

export default async function ProductsData({
  search,
  page,
  brand,
}: ProductsDataProps) {
  const currentPage = page ? parseInt(page) : 1;
  const limit = 10; // Items per page

  const { products, total } = await getProducts(
    search,
    currentPage,
    limit,
    brand
  );

  return (
    <>
      <ProductList initialProducts={products} />

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
    </>
  );
}
