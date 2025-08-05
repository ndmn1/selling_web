"use client";

import React, { useState, useEffect } from "react";
import { getUserProfile } from "@/actions/user";
import { getUserOrders } from "@/actions/order";
import ProfileSidebar from "./_components/ProfileSidebar";
import UserInfoForm from "./_components/UserInfoForm";
import OrdersList from "./_components/OrdersList";
import { Order } from "@/types/order";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user profile and orders in parallel
        const [userResult, ordersResult] = await Promise.all([
          getUserProfile(),
          getUserOrders(),
        ]);

        setUser(userResult);

        setOrders(ordersResult);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-950 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Có lỗi xảy ra</h3>
          <p className="mt-1 text-gray-500">
            {error || "Không thể tải thông tin tài khoản"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Tài khoản của tôi</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - handles both mobile and desktop */}
          <ProfileSidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Main Content */}
          <div className="w-full flex-1">
            {/* User Info Tab */}
            {activeTab === "info" && <UserInfoForm user={user} />}

            {/* Orders Tab */}
            {activeTab === "orders" && <OrdersList orders={orders} />}
          </div>
        </div>
      </div>
    </div>
  );
}
