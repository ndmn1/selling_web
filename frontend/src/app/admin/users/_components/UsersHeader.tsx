"use client";

import React, { useState } from "react";
import UserModal from "./UserModal";

export default function UsersHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Thêm người dùng
      </button>
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
