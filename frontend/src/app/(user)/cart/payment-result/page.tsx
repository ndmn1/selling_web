"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface PaymentResult {
  status: "success" | "failed" | "error";
  orderId?: string;
  amount?: string;
  transactionNo?: string;
  code?: string;
  message?: string;
}

export default function PaymentResultPage() {
  const [result, setResult] = useState<PaymentResult | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get("status") as PaymentResult["status"];
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const transactionNo = searchParams.get("transactionNo");
    const code = searchParams.get("code");
    const message = searchParams.get("message");

    setResult({
      status,
      orderId: orderId || undefined,
      amount: amount || undefined,
      transactionNo: transactionNo || undefined,
      code: code || undefined,
      message: message || undefined,
    });
  }, [searchParams]);

  const getStatusColor = () => {
    switch (result?.status) {
      case "success":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "error":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = () => {
    switch (result?.status) {
      case "success":
        return "✅";
      case "failed":
        return "❌";
      case "error":
        return "⚠️";
      default:
        return "❓";
    }
  };

  const getStatusTitle = () => {
    switch (result?.status) {
      case "success":
        return "Thanh toán thành công!";
      case "failed":
        return "Thanh toán thất bại!";
      case "error":
        return "Có lỗi xảy ra!";
      default:
        return "Đang xử lý...";
    }
  };

  const getStatusMessage = () => {
    if (result?.message) {
      return result.message;
    }

    switch (result?.status) {
      case "success":
        return "Đơn hàng của bạn đã được thanh toán thành công. Chúng tôi sẽ xử lý và giao hàng trong thời gian sớm nhất.";
      case "failed":
        return "Thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.";
      case "error":
        return "Có lỗi xảy ra trong quá trình xử lý thanh toán. Vui lòng liên hệ với chúng tôi để được hỗ trợ.";
      default:
        return "Đang xử lý thông tin thanh toán...";
    }
  };

  const formatAmount = (amount: string) => {
    const numAmount = parseInt(amount) / 100; // VNPay returns amount in cents
    return new Intl.NumberFormat("vi-VN").format(numAmount) + " VND";
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">{getStatusIcon()}</div>
          <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
            {getStatusTitle()}
          </h1>
          <p className="text-gray-600 mb-6">{getStatusMessage()}</p>

          {result.orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2">Thông tin giao dịch:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Mã đơn hàng:</span>
                  <span className="font-mono">{result.orderId}</span>
                </div>
                {result.amount && (
                  <div className="flex justify-between">
                    <span>Số tiền:</span>
                    <span className="font-semibold">
                      {formatAmount(result.amount)}
                    </span>
                  </div>
                )}
                {result.transactionNo && (
                  <div className="flex justify-between">
                    <span>Mã giao dịch:</span>
                    <span className="font-mono">{result.transactionNo}</span>
                  </div>
                )}
                {result.code && result.status !== "success" && (
                  <div className="flex justify-between">
                    <span>Mã lỗi:</span>
                    <span className="font-mono text-red-600">
                      {result.code}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {result.status === "success" && (
              <Link
                href={`/profile/orders/${result.orderId}`}
                className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xem đơn hàng
              </Link>
            )}

            {result.status === "failed" && (
              <button
                onClick={() => router.back()}
                className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại thanh toán
              </button>
            )}

            <Link
              href="/"
              className="block w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
