"use client";
import ProductItem from "@/components/ProductItem";
import { Product } from "@/types/product";

function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <div className="mt-12 px-4 md:px-6">
      <h2 className="text-xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;
