"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProfileSidebarProps {
  activeTab: string;
}

export default function ProfileSidebar({ activeTab }: ProfileSidebarProps) {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleTabChange = (tab: string) => {
    router.push(`/profile?tab=${tab}`);
  };
  return (
    <>
      {/* Mobile Horizontal Navigation */}
      <div className="lg:hidden w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-6">
          <div className="flex justify-around items-center">
            <button
              onClick={() => handleTabChange("info")}
              className={`flex flex-col items-center space-y-1 p-2 rounded-md ${
                activeTab === "info" ? "text-orange-600" : "text-gray-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-xs text-center">Thông tin</span>
            </button>

            <button
              onClick={() => handleTabChange("orders")}
              className={`flex flex-col items-center space-y-1 p-2 rounded-md ${
                activeTab === "orders" ? "text-orange-600" : "text-gray-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="text-xs text-center">Đơn hàng</span>
            </button>

            <button
              onClick={handleSignOut}
              className="flex flex-col items-center space-y-1 p-2 rounded-md text-red-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="text-xs text-center">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Vertical Sidebar */}
      <div className="hidden lg:block w-full min-w-64 md:w-1/4 lg:w-1/5">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="py-3 px-4 bg-gray-50 border-b border-gray-200">
            <div className="font-semibold">Bảng điều khiển</div>
          </div>
          <nav className="p-2">
            <button
              onClick={() => handleTabChange("info")}
              className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${
                activeTab === "info"
                  ? "bg-orange-50 text-orange-600"
                  : "hover:bg-gray-50"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Thông tin tài khoản</span>
            </button>
            <button
              onClick={() => handleTabChange("orders")}
              className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${
                activeTab === "orders"
                  ? "bg-orange-50 text-orange-600"
                  : "hover:bg-gray-50"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span>Đơn hàng của tôi</span>
            </button>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-50 text-red-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
