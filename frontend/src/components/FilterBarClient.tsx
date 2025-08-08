"use client";
import { useState, ReactNode } from "react";
import { FaArrowUp } from "react-icons/fa";

interface SideBarClientProps {
  sidebarContent: ReactNode;
}

export default function SideBarClient({ sidebarContent }: SideBarClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Filter toggle button for mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed z-20 bottom-6 right-6 bg-cyan-400 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        aria-label="Toggle filters"
      >
        <FaArrowUp className="w-6 h-6" />
      </button>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar - hidden on mobile by default, shown when sidebarOpen is true */}
      <div
        className={`
            fixed md:relative top-16 md:top-0 left-0 h-full w-3/4 md:w-1/4 lg:w-1/5 
            bg-white z-20 transform transition-transform duration-300 ease-in-out
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
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
