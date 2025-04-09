"use client";
import { RangleFilter } from "./RangeFilter";
import { SingleFilter } from "./SingleFilter";
import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
// Price filter options
const priceOptions = [
  { id: "price-1", label: "Giá dưới 1.000.000đ", min: 0, max: 1000000 },
  {
    id: "price-2",
    label: "1.000.000đ - 2.000.000đ",
    min: 1000000,
    max: 2000000,
  },
  {
    id: "price-3",
    label: "2.000.000đ - 3.000.000đ",
    min: 2000000,
    max: 3000000,
  },
  {
    id: "price-4",
    label: "3.000.000đ - 5.000.000đ",
    min: 3000000,
    max: 5000000,
  },
  {
    id: "price-5",
    label: "5.000.000đ - 10.000.000đ",
    min: 5000000,
    max: 10000000,
  },
];

// Brand filter options
const brandOptions = [
  { id: "adidas", label: "Adidas", value: "adidas" },
  { id: "asics", label: "Asics", value: "asics" },
  { id: "champion", label: "Champion", value: "champion" },
  { id: "converse", label: "Converse", value: "converse" },
  { id: "dasc", label: "DASC", value: "dasc" },
];

// Size filter options
const sizeOptions = [
  { id: "35.0", label: "35.0VN", value: "35.0" },
  { id: "36.0", label: "36.0VN", value: "36.0" },
  { id: "37.0", label: "37.0VN", value: "37.0" },
  { id: "38.0", label: "38.0VN", value: "38.0" },
  { id: "39.0", label: "39.0VN", value: "39.0" },
  { id: "40.0", label: "40.0VN", value: "40.0" },
];
export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <>
      {/* Filter toggle button for mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed z-50 bottom-6 right-6 bg-cyan-400 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        aria-label="Toggle filters"
      >
        <FaArrowUp className="w-6 h-6" />
      </button>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar - hidden on mobile by default, shown when sidebarOpen is true */}
      <div
        className={`
            fixed md:relative top-16 md:top-0 left-0 h-full w-3/4 md:w-1/4 lg:w-1/5 
            bg-white z-40 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 md:block overflow-y-auto
          `}
      >
        <div className="p-4 md:p-0">
          <div className="flex justify-between items-center md:hidden mb-4">
            <h2 className="font-bold text-lg">Bộ lọc</h2>
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close filters"
            >
             <FaArrowUp className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-6">
            <RangleFilter title="GIÁ THÀNH" options={priceOptions} />

            <SingleFilter
              title="THƯƠNG HIỆU"
              options={brandOptions}
              searchParamName="brand"
            />
            <SingleFilter
              title="SIZE"
              options={sizeOptions}
              searchParamName="size"
            />
          </div>
        </div>
      </div>
    </>
  );
}
