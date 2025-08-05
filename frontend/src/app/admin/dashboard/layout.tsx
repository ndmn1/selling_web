import React, { Suspense } from "react";
import DashboardSkeleton from "../../../components/admin/_components/DashboardSkeleton";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-4 sm:p-6">
      <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>
    </div>
  );
}
