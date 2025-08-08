"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { SalesData } from "@/types/statistics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ReportsChartProps {
  salesData: SalesData[];
}

const ReportsChart = ({ salesData }: ReportsChartProps) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 12,
          },
        },
      },
      y: {
        display: true,
        grid: {
          color: "#F3F4F6",
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 12,
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 3,
        borderColor: "#3B82F6",
      },
    },
  };

  const labels = salesData.map((item) => item.date);
  const amounts = salesData.map((item) => item.amount);
  const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: amounts,
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        fill: false,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
      </div>
      <div className="h-64">
        <Line options={options} data={data} />
      </div>
      <div className="mt-4 flex items-center justify-center">
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {totalAmount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ReportsChart;
