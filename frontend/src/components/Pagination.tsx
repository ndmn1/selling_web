import { getProducts } from "@/data/product";
import PaginationClient from "./PaginationClient";
import type { SearchParams } from "@/app/(user)/all/page";

interface PaginationProps {
  searchParams: SearchParams;
  itemPerPage: number;
  curPage: number;
  pageParamName?: string;
}

export default async function Pagination({
  searchParams,
  itemPerPage,
  curPage,
  pageParamName = "page",
}: PaginationProps) {
  const { total } = await getProducts(searchParams);

  return (
    <PaginationClient
      total={total}
      itemPerPage={itemPerPage}
      curPage={curPage}
      pageParamName={pageParamName}
    />
  );
}
