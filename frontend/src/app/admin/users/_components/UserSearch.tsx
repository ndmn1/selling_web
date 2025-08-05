"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Search from "@/components/Search";

export default function UserSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    // Reset to page 1 when searching
    params.delete("page");
    router.replace(`/admin/users?${params.toString()}`);
  };

  return (
    <Search
      onSearch={handleSearch}
      placeholder="Tìm kiếm theo tên hoặc email..."
    />
  );
}
