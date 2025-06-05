import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface OrderPageProps {
  params: {
    id: string;
  };
}

async function getOrder(orderId: string, userId: string) {
  const order = await db.order.findUnique({
    where: {
      id: orderId,
      userId: userId, // Ensure user can only see their own orders
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return order;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const order = await getOrder(params.id, session.user.id);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600">
            The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
          <p>
            Thank you for your order. Order ID: <strong>{order.id}</strong>
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Order Information</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm ${
                      order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "CONFIRMED"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "DELIVERED"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span>{" "}
                  {order.paymentMethod}
                </p>
                <p>
                  <span className="font-medium">Total Amount:</span>{" "}
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Order Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </p>
                {order.voucherCode && (
                  <p>
                    <span className="font-medium">Voucher Used:</span>{" "}
                    {order.voucherCode}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">
                Shipping Information
              </h2>
              <div className="space-y-2">
                {order.shippingAddress && (
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {order.shippingAddress}
                  </p>
                )}
                {order.phoneNumber && (
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {order.phoneNumber}
                  </p>
                )}
                {order.notes && (
                  <p>
                    <span className="font-medium">Notes:</span> {order.notes}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <img
                    src={item.product.mainImage}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.product.brand}
                    </p>
                    <p className="text-sm">Size: {item.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.price)}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/all"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
