import ProductInfo from "@/components/ProductInfo";
import RelatedProducts from "@/components/RelatedProducts";
import { getProductById, getProducts } from "@/data/product";
import { Suspense } from "react";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="bg-white py-10 mx-auto container">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductInfoWrapper productId={id} />
      </Suspense>

      <Suspense fallback={<div>Loading related products...</div>}>
        <RelatedProductsWrapper />
      </Suspense>
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
  const { products } = await getProducts(1, 5); // Get first 5 products

  return <RelatedProducts products={products} />;
}
