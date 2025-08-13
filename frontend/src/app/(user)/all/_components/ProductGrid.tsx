import ProductItem from "./ProductItem";
import { getProducts } from "@/data/product";

interface ProductGridProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function ProductGrid({ searchParams }: ProductGridProps) {
  const { products } = await getProducts(searchParams);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductItem product={product} key={product.id} />
      ))}
    </div>
  );
}
