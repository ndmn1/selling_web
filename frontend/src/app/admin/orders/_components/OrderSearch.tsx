"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Search from "@/components/Search";

export default function OrderSearch() {
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
    router.replace(`/admin/orders?${params.toString()}`);
  };

  return (
    <Search
      placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, email..."
      defaultValue={searchParams.get("search") || ""}
      onSearch={handleSearch}
    />
  );
}
