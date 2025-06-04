import ProductGrid from "@/app/(user)/all/_components/ProductGrid";
import Sidebar from "@/components/SideBar";
import Pagination from "@/components/Pagination";
import { Suspense } from "react";
import Loading from "./loading";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function ProductsPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const curPage = Number(searchParams.page) || 1;
  const itemPerPage = 1; // Changed to show more items per page

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
            <Suspense key={JSON.stringify(searchParams)} fallback={<Loading />}>
              <ProductGrid page={curPage} limit={itemPerPage} />
              <Pagination itemPerPage={itemPerPage} curPage={curPage} />
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
