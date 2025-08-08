import React from "react";
import DashboardHeader from "./_components/DashboardHeader";
import StatsCards from "./_components/StatsCards";
import ReportsChart from "./_components/ReportsChart";
import AnalyticsChart from "./_components/AnalyticsChart";
import RecentOrders from "./_components/RecentOrders";
import TopSellingProducts from "./_components/TopSellingProducts";
import {
  getDashboardStats,
  getRecentOrders,
  getSalesData,
  getAnalyticsData,
  getTopSellingProducts,
} from "@/actions/statistics";
import type { DateRange } from "@/types/statistics";

export type DashboardSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export default async function DashboardPage(props: {
  searchParams: DashboardSearchParams;
}) {
  const searchParams = await props.searchParams;

  // Parse date range from URL params
  const startDateParam = searchParams.startDate as string;
  const endDateParam = searchParams.endDate as string;

  const dateRange: DateRange | undefined =
    startDateParam && endDateParam
      ? {
          startDate: new Date(startDateParam),
          endDate: new Date(endDateParam),
        }
      : undefined;

  // Fetch all dashboard data in parallel
  const [stats, recentOrders, salesData, analyticsData, topProducts] =
    await Promise.all([
      getDashboardStats(dateRange),
      getRecentOrders(5, dateRange), // Get last 5 orders
      getSalesData(dateRange),
      getAnalyticsData(dateRange),
      getTopSellingProducts(3, dateRange), // Get top 3 products
    ]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="order-1">
          <ReportsChart salesData={salesData} />
        </div>
        <div className="order-2">
          <AnalyticsChart analyticsData={analyticsData} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2 order-1">
          <RecentOrders orders={recentOrders} />
        </div>
        <div className="xl:col-span-1 order-2">
          <TopSellingProducts products={topProducts} />
        </div>
      </div>
    </div>
  );
}
