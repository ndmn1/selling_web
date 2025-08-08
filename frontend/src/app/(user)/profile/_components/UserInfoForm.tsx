"use client";

import { useState, useTransition } from "react";
import { updateUserProfile } from "@/actions/user";
import ChangePasswordForm from "./ChangePasswordForm";
import AddressManagement from "./AddressManagement";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface UserInfoFormProps {
  user: User;
}

export default function UserInfoForm({ user }: UserInfoFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      try {
        await updateUserProfile(user.id, {
          name: formData.name,
        });
        setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
      } catch (error) {
        setMessage({
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "Có lỗi xảy ra khi cập nhật thông tin",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Info Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin tài khoản</h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                disabled
                title="Email không thể thay đổi"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <ChangePasswordForm userId={user.id} />

      {/* Address Management */}
      <AddressManagement userId={user.id} />
    </div>
  );
}
