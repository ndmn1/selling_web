import ProductGrid from "@/app/(user)/all/_components/ProductGrid";
import SideBarServer from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import { Suspense } from "react";
import Loading from "./loading";

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};
export default async function ProductsPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const curPage = Number(searchParams.page) || 1;
  const itemPerPage = 1; // Show 12 items per page

  // Create a new searchParams object with the limit
  const fullSearchParams = {
    ...searchParams,
    limit: itemPerPage.toString(),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 relative">
          <Suspense fallback={<Loading />}>
            <SideBarServer />
          </Suspense>
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 uppercase mb-4">
                TẤT CẢ SẢN PHẨM
              </h1>
            </div>
            <Suspense key={JSON.stringify(searchParams)} fallback={<Loading />}>
              <ProductGrid searchParams={fullSearchParams} />
              <Pagination
                searchParams={fullSearchParams}
                itemPerPage={itemPerPage}
                curPage={curPage}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
