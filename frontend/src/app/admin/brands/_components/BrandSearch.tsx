"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Search from "@/components/Search";

const BrandSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    // Reset to page 1 when searching
    params.delete("page");
    router.push(`/admin/brands?${params.toString()}`);
  };

  return (
    <Search
      placeholder="Tìm kiếm thương hiệu..."
      defaultValue={searchParams.get("search") || ""}
      onSearch={handleSearch}
    />
  );
};

export default BrandSearch;
