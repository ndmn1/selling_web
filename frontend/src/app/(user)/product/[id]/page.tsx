import ProductInfo from "@/components/ProductInfo";
import RelatedProducts from "@/components/RelatedProducts";
import { Suspense } from "react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="bg-white py-10 mx-auto container">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductInfo
          data={
            new Promise((resolve) => {
              setTimeout(
                () =>
                  resolve({
                    id: id,
                    name: "Nike Vomero 18",
                    brand: "Nike",
                    mainImage: "/images/vomero-main.png",
                    images: [
                      "/images/vomero-main.png",
                      "/images/vomero-1.png",
                      "/images/vomero-2.png",
                    ],
                    price: 4259000,
                    salePrice: 4259000,
                    discount: 0,
                    description:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla augue nec est tristique auctor. Donec non est at libero.",
                    sizes: [
                      {
                        size: "S",
                        stock: 5,
                      },
                      {
                        size: "M",
                        stock: 10,
                      },
                      {
                        size: "L",
                        stock: 0,
                      },
                    ],
                  }),
                1000
              );
            })
          }
        />
      </Suspense>

      <Suspense fallback={<div>LoadingRelate...</div>}>
        <RelatedProducts />
      </Suspense>
    </div>
  );
}
