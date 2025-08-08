import React from "react";
import OrderList from "./OrderList";
import PaginationClient from "@/components/PaginationClient";
import { getOrders } from "@/actions/admin-order";

interface OrdersDataProps {
  search?: string;
  page?: string;
  status?: string;
}

export default async function OrdersData({
  search,
  page,
  status,
}: OrdersDataProps) {
  const currentPage = page ? parseInt(page) : 1;
  const limit = 10; // Items per page

  const { orders, total } = await getOrders(search, currentPage, limit, status);

  return (
    <>
      <OrderList initialOrders={orders} />

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
