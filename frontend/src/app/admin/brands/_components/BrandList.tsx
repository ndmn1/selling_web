"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MdEdit, MdDelete } from "react-icons/md";
import TableCustom from "@/components/TableCustom";
import DeleteModal from "@/components/admin/_components/DeleteModal";
import { deleteBrandWithImage, type Brand } from "@/actions/brand";

interface BrandListProps {
  initialBrands: Brand[];
}

const BrandList = ({ initialBrands }: BrandListProps) => {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  const handleConfirmDelete = async () => {
    if (!brandToDelete) return;

    try {
      await deleteBrandWithImage(brandToDelete.id, brandToDelete.logo);
      setDeleteModalOpen(false);
      setBrandToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  const columns = [
    {
      header: "Logo",
      accessorKey: "logo" as keyof Brand,
      cell: (value: Brand[keyof Brand]) =>
        value ? (
          <img
            src={value as string}
            alt="Brand logo"
            className="w-10 h-10 object-contain rounded"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            N/A
          </div>
        ),
    },
    {
      header: "Tên thương hiệu",
      accessorKey: "name" as keyof Brand,
    },
    {
      header: "Mô tả",
      accessorKey: "description" as keyof Brand,
      cell: (value: Brand[keyof Brand]) =>
        (value as string) || "Không có mô tả",
    },
    {
      header: "Số sản phẩm",
      accessorKey: "_count" as keyof Brand,
      cell: (value: Brand[keyof Brand]) =>
        (value as { products: number })?.products || 0,
    },
    {
      header: "Ngày tạo",
      accessorKey: "createdAt" as keyof Brand,
      cell: (value: Brand[keyof Brand]) =>
        new Date(value as Date).toLocaleDateString("vi-VN"),
    },
  ];

  const actions = [
    {
      icon: <MdEdit className="w-5 h-5" />,
      label: "Chỉnh sửa",
      onClick: (brand: Brand) => router.push(`/admin/brands/${brand.id}`),
      className: "text-blue-600 hover:text-blue-900 hover:bg-blue-100",
    },
    {
      icon: <MdDelete className="w-5 h-5" />,
      label: "Xóa",
      onClick: (brand: Brand) => {
        setBrandToDelete(brand);
        setDeleteModalOpen(true);
      },
      className: "text-red-600 hover:text-red-900 hover:bg-red-100",
    },
  ];

  return (
    <>
      <TableCustom data={initialBrands} columns={columns} actions={actions} />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setBrandToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa thương hiệu"
        message={`Bạn có chắc chắn muốn xóa thương hiệu "${brandToDelete?.name}"? Hành động này không thể hoàn tác.`}
      />
    </>
  );
};

export default BrandList;
