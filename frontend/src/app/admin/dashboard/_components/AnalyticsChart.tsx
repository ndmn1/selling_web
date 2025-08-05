"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { AnalyticsData } from "@/actions/statistics";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AnalyticsChartProps {
  analyticsData: AnalyticsData;
}

const AnalyticsChart = ({ analyticsData }: AnalyticsChartProps) => {
  const total =
    analyticsData.pending + analyticsData.completed + analyticsData.cancelled;
  const completedPercentage =
    total > 0 ? Math.round((analyticsData.completed / total) * 100) : 0;

  const data = {
    labels: ["Completed", "Pending", "Cancelled"],
    datasets: [
      {
        data: [
          analyticsData.completed,
          analyticsData.pending,
          analyticsData.cancelled,
        ],
        backgroundColor: ["#3B82F6", "#F59E0B", "#EF4444"],
        borderColor: ["#3B82F6", "#F59E0B", "#EF4444"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const legendItems = [
    { name: "Completed", color: "#3B82F6", value: analyticsData.completed },
    { name: "Pending", color: "#F59E0B", value: analyticsData.pending },
    { name: "Cancelled", color: "#EF4444", value: analyticsData.cancelled },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <div className="w-32 h-32">
            <Doughnut data={data} options={options} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {completedPercentage}%
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
