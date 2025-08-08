"use client";

import React from "react";
import { MdSave, MdInventory, MdTrendingUp, MdWork } from "react-icons/md";
import type { DashboardStats } from "@/types/statistics";

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const statsData = [
    {
      title: "Total Products",
      value: `${stats.totalProducts}+`,
      icon: MdSave,
      iconColor: "bg-blue-100 text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Low Stock Products",
      value: `${stats.lowStockProducts}+`,
      icon: MdInventory,
      iconColor: "bg-yellow-100 text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Sales Revenue (M)",
      value: `${stats.totalSales}M+`,
      icon: MdTrendingUp,
      iconColor: "bg-orange-100 text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Users",
      value: `${stats.totalUsers}+`,
      icon: MdWork,
      iconColor: "bg-purple-100 text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-xl p-4 sm:p-6 border border-gray-100`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">{stat.title}</p>
            </div>
            <div className={`p-2 sm:p-3 rounded-lg ${stat.iconColor}`}>
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
