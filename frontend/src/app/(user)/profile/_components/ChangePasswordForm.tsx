"use client";

import { useState, useTransition } from "react";
import { changePassword } from "@/actions/user";

export default function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Mật khẩu mới và xác nhận mật khẩu không khớp",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
      return;
    }

    startTransition(async () => {
      try {
        await changePassword(formData.oldPassword, formData.newPassword);
        setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        setMessage({
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "Có lỗi xảy ra khi đổi mật khẩu",
        });
      }
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Đổi mật khẩu</h3>

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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              value={formData.oldPassword}
              onChange={(e) =>
                setFormData({ ...formData, oldPassword: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
          </button>
        </div>
      </form>
    </div>
  );
}
