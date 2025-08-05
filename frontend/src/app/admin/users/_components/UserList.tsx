"use client";

import React, { useState } from "react";
import { MdEdit, MdDelete, MdLock } from "react-icons/md";
import TableCustom from "@/components/TableCustom";
import DeleteModal from "@/components/admin/_components/DeleteModal";
import UserModal from "./UserModal";
import ResetPasswordModal from "./ResetPasswordModal";
import { deleteUser, type User } from "@/actions/admin-user";
import { useRouter } from "next/navigation";

interface UserListProps {
  initialUsers: User[];
}

export default function UserList({ initialUsers }: UserListProps) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(
    null
  );

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleResetPassword = (user: User) => {
    setUserToResetPassword(user);
    setResetPasswordModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      setDeleteModalOpen(false);
      setUserToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const columns = [
    {
      header: "Tên",
      accessorKey: "name" as keyof User,
      cell: (value: User[keyof User]) => (value || "N/A").toString(),
    },
    {
      header: "Email",
      accessorKey: "email" as keyof User,
      cell: (value: User[keyof User]) => value?.toString() || "N/A",
    },
    {
      header: "Vai trò",
      accessorKey: "role" as keyof User,
      cell: (value: User[keyof User]) =>
        (value === "ADMIN" ? "Quản trị viên" : "Người dùng").toString(),
    },
    {
      header: "Ngày tạo",
      accessorKey: "createdAt" as keyof User,
      cell: (value: User[keyof User]) => {
        if (!value) return "N/A";
        return new Date(value as Date).toLocaleDateString("vi-VN").toString();
      },
    },
  ];

  const actions = [
    {
      icon: <MdEdit className="w-5 h-5" />,
      label: "Chỉnh sửa",
      onClick: handleEdit,
      className: "text-blue-600 hover:text-blue-900 hover:bg-blue-100",
    },
    {
      icon: <MdLock className="w-5 h-5" />,
      label: "Đặt lại mật khẩu",
      onClick: handleResetPassword,
      className: "text-yellow-600 hover:text-yellow-900 hover:bg-yellow-100",
    },
    {
      icon: <MdDelete className="w-5 h-5" />,
      label: "Xóa",
      onClick: handleDelete,
      className: "text-red-600 hover:text-red-900 hover:bg-red-100",
    },
  ];

  return (
    <>
      <TableCustom data={initialUsers} columns={columns} actions={actions} />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng "${
          userToDelete?.name || userToDelete?.email
        }"? Hành động này không thể hoàn tác.`}
      />

      <UserModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setUserToEdit(null);
        }}
        user={userToEdit || undefined}
      />

      {userToResetPassword && (
        <ResetPasswordModal
          isOpen={resetPasswordModalOpen}
          onClose={() => {
            setResetPasswordModalOpen(false);
            setUserToResetPassword(null);
          }}
          user={userToResetPassword}
        />
      )}
    </>
  );
}
