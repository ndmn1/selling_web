"use client";

import React from "react";
import { MdStar, MdStarBorder } from "react-icons/md";
import type { TopProduct } from "@/actions/statistics";

interface TopSellingProductsProps {
  products: TopProduct[];
}

const TopSellingProducts = ({ products }: TopSellingProductsProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderStars = (rating: number = 4, maxRating: number = 5) => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <span key={i}>
          {i <= rating ? (
            <MdStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
          ) : (
            <MdStarBorder className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
          )}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Top selling Products
        </h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-blue-50 rounded-xl p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1 truncate">
                  {product.name}
                </h4>
                <div className="flex items-center space-x-1 mb-1 sm:mb-2">
                  {renderStars()}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Sold: {product.totalSold}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No top selling products found
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSellingProducts;
