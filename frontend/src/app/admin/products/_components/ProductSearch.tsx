"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Search from "@/components/Search";

const ProductSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    // Reset to page 1 when searching, but preserve brand filter
    params.delete("page");
    router.push(`/admin/products?${params.toString()}`);
  };

  return (
    <Search
      placeholder="Tìm kiếm sản phẩm..."
      defaultValue={searchParams.get("search") || ""}
      onSearch={handleSearch}
    />
  );
};

export default ProductSearch;
