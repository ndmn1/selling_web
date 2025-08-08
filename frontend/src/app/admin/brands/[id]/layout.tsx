import React, { Suspense } from "react";
import LoadingCircle from "@/components/LoadingCircle";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return <Suspense fallback={<LoadingCircle />}>{children}</Suspense>;
}
