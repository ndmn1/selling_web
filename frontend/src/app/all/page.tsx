// import ProductGrid from "@/components/product-grid"
// import Sidebar from "@/components/sidebar"
// import Header from "@/components/header"
// import Pagination from "@/components/pagination"
// import { products } from "@/data/products"
import ProductGrid from "@/components/ProductGrid";
import Sidebar from "@/components/SideBar";
import Pagination from "@/components/Pagination";
import { products } from "@/data/product";
import { Suspense } from "react";
import Loading from "./loading";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function ProductsPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const curPage = Number(searchParams.page) || 1;
  const itemPerPage = 3;
  const start = (curPage - 1) * itemPerPage;
  const end = curPage * itemPerPage;
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 relative">
          <Sidebar />
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 uppercase">
                TẤT CẢ SẢN PHẨM
              </h1>
            </div>
            <Suspense key={JSON.stringify(searchParams)} fallback={<Loading/>}>
              <ProductGrid
                data={
                  new Promise((resolve) => {
                    setTimeout(() => resolve(products.slice(start, end)), 1000);
                  })
                }
              />
              <Pagination
                total={products.length}
                itemPerPage={itemPerPage}
                curPage={curPage}
              />
            </Suspense>
            {/* <div className="mt-8">
              <Pagination />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
