"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MdEdit, MdDelete } from "react-icons/md";
import TableCustom from "@/components/TableCustom";
import DeleteModal from "@/components/admin/DeleteModal";
import { deleteProductWithImages, type Product } from "@/actions/product";
import { Size } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

interface ProductListProps {
  initialProducts: Product[];
}

const ProductList = ({ initialProducts }: ProductListProps) => {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductWithImages(
        productToDelete.id,
        productToDelete.mainImage,
        productToDelete.images
      );
      setDeleteModalOpen(false);
      setProductToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const columns = [
    {
      header: "Hình ảnh",
      accessorKey: "mainImage" as keyof Product,
      cell: (value: Product[keyof Product]) =>
        value ? (
          <Image
            src={value as string}
            alt="Product image"
            className="w-16 h-16 object-cover rounded"
            width={64}
            height={64}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            N/A
          </div>
        ),
    },
    {
      header: "Tên sản phẩm",
      accessorKey: "name" as keyof Product,
    },
    {
      header: "Thương hiệu",
      accessorKey: "brand" as keyof Product,
      cell: (value: Product[keyof Product]) =>
        (value as { name: string })?.name || "N/A",
    },
    {
      header: "Giá",
      accessorKey: "price" as keyof Product,
      cell: (value: Product[keyof Product]) => formatCurrency(value as number),
    },
    {
      header: "Giảm giá",
      accessorKey: "discount" as keyof Product,
      cell: (value: Product[keyof Product]) => `${value as number}%`,
    },
    {
      header: "Số size",
      accessorKey: "sizes" as keyof Product,
      cell: (value: Product[keyof Product]) => (value as Size[])?.length || 0,
    },
    {
      header: "Ngày tạo",
      accessorKey: "createdAt" as keyof Product,
      cell: (value: Product[keyof Product]) =>
        new Date(value as Date).toLocaleDateString("vi-VN"),
    },
  ];

  const actions = [
    {
      icon: <MdEdit className="w-5 h-5" />,
      label: "Chỉnh sửa",
      onClick: (product: Product) =>
        router.push(`/admin/products/${product.id}`),
      className: "text-blue-600 hover:text-blue-900 hover:bg-blue-100",
    },
    {
      icon: <MdDelete className="w-5 h-5" />,
      label: "Xóa",
      onClick: (product: Product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
      },
      className: "text-red-600 hover:text-red-900 hover:bg-red-100",
    },
  ];

  return (
    <>
      <TableCustom data={initialProducts} columns={columns} actions={actions} />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${productToDelete?.name}"? Hành động này không thể hoàn tác.`}
      />
    </>
  );
};

export default ProductList;
