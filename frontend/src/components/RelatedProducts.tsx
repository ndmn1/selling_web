import ProductItem from "@/components/ProductItem";

function RelatedProducts() {
  return (
    <div className="mt-12 px-4 md:px-6">
      <h2 className="text-xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <ProductItem
            key={item}
            product={{
              id: "1",
              name: "Nike Vomero 18",
              brand: "Nike",
              mainImage: "/images/vomero-main.png",
              price: 4259000,
              salePrice: 4259000,
              discount: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;
