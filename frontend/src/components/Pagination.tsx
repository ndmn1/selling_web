import { getProducts } from "@/data/product";
import PaginationClient from "./PaginationClient";

interface PaginationProps {
  itemPerPage: number;
  curPage: number;
  pageParamName?: string;
}

export default async function Pagination({
  itemPerPage,
  curPage,
  pageParamName = "page",
}: PaginationProps) {
  const { total } = await getProducts(curPage, itemPerPage);

  return (
    <PaginationClient
      total={total}
      itemPerPage={itemPerPage}
      curPage={curPage}
      pageParamName={pageParamName}
    />
  );
}
