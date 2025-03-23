"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import Link from "next/link"
import clsx from "clsx"

interface PaginationProps {
  total: number
  itemPerPage: number
  curPage: number
  pageParamName?: string
}

export default function Pagination({ total, itemPerPage, curPage, pageParamName = "page" }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const totalPages = useMemo(() => {
    return Math.ceil(total / itemPerPage)
  }, [total, itemPerPage])

  // Generate array of page numbers to display
  const pageNumbers = useMemo(() => {
    const pages = []
    const maxVisiblePages = 5 // Maximum number of page buttons to show

    // Always show first page
    pages.push(1)

    let startPage = Math.max(2, curPage - 1)
    let endPage = Math.min(totalPages - 1, curPage + 1)

    // Adjust start and end to always show up to maxVisiblePages
    if (endPage - startPage + 1 < maxVisiblePages - 2) {
      // -2 for first and last pages
      if (curPage < totalPages / 2) {
        endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3)
      } else {
        startPage = Math.max(2, endPage - maxVisiblePages + 3)
      }
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push("...")
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("...")
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }, [curPage, totalPages])

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(pageParamName, page.toString())
    return `?${params.toString()}`
  }

  const handlePageChange = (page: number) => {
    if (page === curPage) return

    const params = new URLSearchParams(searchParams.toString())
    params.set(pageParamName, page.toString())
    router.push(`?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center space-x-2 py-4" aria-label="Pagination">
      <button
        onClick={() => curPage > 1 && handlePageChange(curPage - 1)}
        disabled={curPage <= 1}
        className={clsx(
          "inline-flex h-10 w-10 items-center justify-center rounded-md text-sm",
          curPage <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-100",
        )}
        aria-label="Previous page"
      >
        <span aria-hidden="true">&lt;</span>
      </button>

      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="text-gray-500">
            ...
          </span>
        ) : (
          <Link
            key={`page-${page}`}
            href={createPageUrl(page as number)}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(page as number)
            }}
            className={clsx(
              "inline-flex h-10 w-10 items-center justify-center rounded-full text-sm",
              curPage === page ? "bg-gray-200 font-medium text-gray-900" : "text-gray-500 hover:bg-gray-100",
            )}
            aria-current={curPage === page ? "page" : undefined}
          >
            {page}
          </Link>
        ),
      )}

      <button
        onClick={() => curPage < totalPages && handlePageChange(curPage + 1)}
        disabled={curPage >= totalPages}
        className={clsx(
          "inline-flex h-10 w-10 items-center justify-center rounded-md text-sm",
          curPage >= totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-100",
        )}
        aria-label="Next page"
      >
        <span aria-hidden="true">&gt;</span>
      </button>
    </nav>
  )
}

