"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import SearchableSelect from "@/components/SearchableSelect";

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: OrderStatus.PENDING, label: "Chờ xử lý" },
  { value: OrderStatus.CONFIRMED, label: "Đã xác nhận" },
  { value: OrderStatus.PROCESSING, label: "Đang xử lý" },
  { value: OrderStatus.SHIPPING, label: "Đang giao" },
  { value: OrderStatus.DELIVERED, label: "Đã giao" },
  { value: OrderStatus.CANCELLED, label: "Đã hủy" },
];

export default function OrderStatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "";

  const handleStatusChange = (statusValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (statusValue) {
      params.set("status", statusValue.toLowerCase());
    } else {
      params.delete("status");
    }
    // Reset to page 1 when filtering
    params.delete("page");
    router.replace(`/admin/orders?${params.toString()}`);
  };

  return (
    <div className="max-w-48">
      <SearchableSelect
        options={statusOptions}
        value={status}
        onChange={handleStatusChange}
        placeholder="Chọn trạng thái"
      />
    </div>
  );
}
