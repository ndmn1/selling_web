"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MdEdit, MdDelete } from "react-icons/md";
import TableCustom from "@/components/TableCustom";
import DeleteModal from "@/components/admin/_components/DeleteModal";
import Select from "@/components/Select";
import { deleteOrder, updateOrder, type Order } from "@/actions/admin-order";
import { OrderStatus } from "@prisma/client";

interface OrderListProps {
  initialOrders: Order[];
}

const OrderList = ({ initialOrders }: OrderListProps) => {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: OrderStatus, order: Order) => {
    try {
      setUpdatingOrderId(order.id);
      await updateOrder(order.id, {
        status: newStatus,
        notes: order.notes || "",
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };
  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      await deleteOrder(orderToDelete.id);
      setDeleteModalOpen(false);
      setOrderToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const statusOptions = [
    {
      label: "Chờ xử lý",
      value: OrderStatus.PENDING,
      className: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "Đã xác nhận",
      value: OrderStatus.CONFIRMED,
      className: "bg-blue-100 text-blue-800",
    },
    {
      label: "Đang xử lý",
      value: OrderStatus.PROCESSING,
      className: "bg-purple-100 text-purple-800",
    },
    {
      label: "Đang giao",
      value: OrderStatus.SHIPPING,
      className: "bg-indigo-100 text-indigo-800",
    },
    {
      label: "Đã giao",
      value: OrderStatus.DELIVERED,
      className: "bg-green-100 text-green-800",
    },
    {
      label: "Đã hủy",
      value: OrderStatus.CANCELLED,
      className: "bg-red-100 text-red-800",
    },
  ];

  const columns = [
    {
      header: "Mã đơn hàng",
      accessorKey: "id" as keyof Order,
    },
    {
      header: "Khách hàng",
      accessorKey: "user" as keyof Order,
      cell: (value: Order[keyof Order]) =>
        (value as { name: string | null; email: string })?.name || "N/A",
    },
    {
      header: "Email",
      accessorKey: "user" as keyof Order,
      cell: (value: Order[keyof Order]) =>
        (value as { name: string | null; email: string })?.email || "N/A",
    },
    {
      header: "Trạng thái",
      accessorKey: "status" as keyof Order,
      cell: (value: Order[keyof Order], order: Order) => {
        const isUpdating = updatingOrderId === order.id;

        return (
          <div className="flex items-center gap-2">
            <Select
              value={isUpdating ? "updating" : (value as string)}
              onChange={(newValue) =>
                handleStatusChange(newValue as OrderStatus, order)
              }
              options={statusOptions}
              disabled={isUpdating}
              className={`rounded-md border text-sm p-2 ${
                statusOptions.find((option) => option.value === value)
                  ?.className
              }`}
            />
          </div>
        );
      },
    },
    {
      header: "Tổng tiền",
      accessorKey: "totalAmount" as keyof Order,
      cell: (value: Order[keyof Order]) => formatPrice(value as number),
    },
    {
      header: "Thanh toán",
      accessorKey: "paymentMethod" as keyof Order,
      cell: (value: Order[keyof Order]) =>
        (value as string) === "COD" ? "Tiền mặt" : "Chuyển khoản",
    },
    {
      header: "Ngày đặt",
      accessorKey: "createdAt" as keyof Order,
      cell: (value: Order[keyof Order]) =>
        new Date(value as Date).toLocaleDateString("vi-VN"),
    },
  ];

  const actions = [
    {
      icon: <MdEdit className="w-5 h-5" />,
      label: "Chỉnh sửa",
      onClick: (order: Order) => router.push(`/admin/orders/${order.id}`),
      className: "text-blue-600 hover:text-blue-900 hover:bg-blue-100",
    },
    {
      icon: <MdDelete className="w-5 h-5" />,
      label: "Xóa",
      onClick: (order: Order) => {
        setOrderToDelete(order);
        setDeleteModalOpen(true);
      },
      className: "text-red-600 hover:text-red-900 hover:bg-red-100",
    },
  ];

  return (
    <>
      <TableCustom data={initialOrders} columns={columns} actions={actions} />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setOrderToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa đơn hàng"
        message={`Bạn có chắc chắn muốn xóa đơn hàng "${orderToDelete?.id}"? Hành động này không thể hoàn tác.`}
      />
    </>
  );
};

export default OrderList;
