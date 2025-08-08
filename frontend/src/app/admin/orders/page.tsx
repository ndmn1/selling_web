import React, { Suspense } from "react";
import OrdersData from "./_components/OrdersData";
import OrderSearch from "./_components/OrderSearch";
import OrderStatusFilter from "./_components/OrderStatusFilter";
import LoadingCircle from "@/components/LoadingCircle";

interface OrdersPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    status?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const resolvedParams = await searchParams;
  const { search, page, status } = resolvedParams;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="mb-6 flex justify-between items-center">
          <OrderSearch />
          <Suspense fallback={<div>Loading...</div>}>
            <OrderStatusFilter />
          </Suspense>
        </div>
        <Suspense
          key={JSON.stringify(resolvedParams)}
          fallback={<LoadingCircle />}
        >
          <OrdersData search={search} page={page} status={status} />
        </Suspense>
      </div>
    </div>
  );
}
