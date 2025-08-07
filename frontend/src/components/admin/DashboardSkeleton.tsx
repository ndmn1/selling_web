import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="flex space-x-4">
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          </div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gray-200 rounded-xl h-80"></div>
        <div className="bg-gray-200 rounded-xl h-80"></div>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2 bg-gray-200 rounded-xl h-96"></div>
        <div className="bg-gray-200 rounded-xl h-96"></div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
