import type { Product } from "@/types/product";
import ProductItem from "./ProductItem";
interface ProductGridProps {
  data: Promise<Product[]>;
}

export default async function ProductGrid({ data }: ProductGridProps) {
  const products = (await data) as Product[];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductItem product={product} key={product.id} />
      ))}
    </div>
  );
}
