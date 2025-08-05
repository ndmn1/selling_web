import ProductInfo from "@/app/(user)/product/[id]/_components/ProductInfo";
import RelatedProducts from "@/app/(user)/product/[id]/_components/RelatedProducts";
import { getProductById, getProducts } from "@/data/product";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="bg-white py-10 mx-auto container">
      <ProductInfoWrapper productId={id} />

      <RelatedProductsWrapper />
    </div>
  );
}

// Server component wrapper for ProductInfo
async function ProductInfoWrapper({ productId }: { productId: string }) {
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return <ProductInfo product={product} />;
}

// Server component wrapper for RelatedProducts
async function RelatedProductsWrapper() {
  const searchParams = { page: "1", limit: "5" };
  const { products } = await getProducts(searchParams);

  return <RelatedProducts products={products} />;
}
