"use client";

import { useState, useCallback } from "react";
import { PAGINATION_DEFAULTS } from "@/lib/constants";

export interface UsePaginationReturn {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

export function usePagination(
  initialPage: number = PAGINATION_DEFAULTS.page,
  initialPageSize: number = PAGINATION_DEFAULTS.pageSize,
): UsePaginationReturn {
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  }, [initialPage, initialPageSize]);

  return { page, pageSize, setPage, setPageSize, nextPage, prevPage, reset };
}
