import { getProducts } from "@/data/product";
import PaginationClient from "./PaginationClient";

interface PaginationProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
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
