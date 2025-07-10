"use client"

import { ChevronLeft } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const PaginationList = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  function PaginationList({ className, ...props }, ref) {
    return <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  },
)

const PaginationListItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  function PaginationListItem({ className, ...props }, ref) {
    return <li ref={ref} className={cn("", className)} {...props} />
  },
)

const PaginationButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { isActive?: boolean; size?: string }
>(function PaginationButton({ className, isActive, size = "icon", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn("pagination-button", isActive ? "active" : "", size, className)}
      {...props}
    />
  )
})

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) => (
  <PaginationButton
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationButton>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationButton>) => (
  <PaginationButton className={className} {...props} />
)

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span className={className} {...props}>
    …
  </span>
)

// Custom hook for pagination logic
export function usePagination(
  totalItems: number,
  itemsPerPage: number,
  currentPage: number,
  onPageChange: (page: number) => void
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const goToNextPage = () => goToPage(currentPage + 1)
  const goToPreviousPage = () => goToPage(currentPage - 1)

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return {
    totalPages,
    startIndex,
    endIndex,
    currentPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    getVisiblePages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }
}

export {
  Pagination,
  PaginationList,
  PaginationEllipsis,
  PaginationListItem,
  PaginationButton,
  PaginationNext,
  PaginationPrevious,
}
