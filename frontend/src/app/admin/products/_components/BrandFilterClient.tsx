"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchableSelect from "@/components/SearchableSelect";

interface BrandFilterClientProps {
  brandOptions: {
    id: string;
    label: string;
    value: string;
  }[];
}

export default function BrandFilterClient({
  brandOptions,
}: BrandFilterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brand = searchParams.get("brand") || "";

  const handleBrandChange = (brandValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (brandValue) {
      params.set("brand", brandValue);
    } else {
      params.delete("brand");
    }
    // Reset to page 1 when filtering
    params.delete("page");
    router.replace(`/admin/products?${params.toString()}`);
  };

  return (
    <div className="max-w-48">
      <SearchableSelect
        options={[{ value: "", label: "Tất cả" }, ...brandOptions]}
        value={brand}
        onChange={handleBrandChange}
        placeholder="Chọn thương hiệu"
      />
    </div>
  );
}
