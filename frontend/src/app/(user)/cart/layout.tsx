import { CartSummaryProvider } from "@/context/CartSummaryProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CartSummaryProvider>{children}</CartSummaryProvider>;
}
