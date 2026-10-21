"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  rowsPerPageOptions?: number[];
  itemLabel?: string;
  className?: string;
}

/**
 * Komponen UI Bar Navigasi Pagination Reusable untuk Tabel Admin CMS
 */
export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 20, 50],
  itemLabel = "data",
  className = "",
}: TablePaginationProps) {
  const safeCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  // Helper kalkulasi tombol nomor halaman dengan window cerdas
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (safeCurrentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (safeCurrentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={`flex flex-col items-center justify-between gap-4 border-t-2 border-[#1E2024]/10 bg-muted/20 px-4 py-3.5 sm:flex-row dark:border-[#F4F1EA]/10 ${className}`}
    >
      {/* Kiri: Selector Baris per Halaman & Info Jumlah Data */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <label
            htmlFor="table-rows-select"
            className="font-bold text-[#1E2024] dark:text-[#F4F1EA]"
          >
            Baris per halaman:
          </label>
          <select
            id="table-rows-select"
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="h-8 rounded-md border-2 border-[#1E2024] bg-card px-2.5 text-xs font-black text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] transition-all hover:bg-muted/40 focus:border-primary focus:outline-none dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)]"
          >
            {rowsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          {totalItems === 0 ? (
            <span>0 {itemLabel}</span>
          ) : (
            <span>
              Menampilkan{" "}
              <strong className="text-[#1E2024] dark:text-[#F4F1EA]">
                {startIndex + 1}
              </strong>{" "}
              -{" "}
              <strong className="text-[#1E2024] dark:text-[#F4F1EA]">
                {endIndex}
              </strong>{" "}
              dari{" "}
              <strong className="text-[#1E2024] dark:text-[#F4F1EA]">
                {totalItems}
              </strong>{" "}
              {itemLabel}
            </span>
          )}
        </div>
      </div>

      {/* Kanan: Navigasi Tombol Pagination */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={safeCurrentPage <= 1}
          aria-label="Halaman pertama"
          className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-[#1E2024] bg-card text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:pointer-events-none disabled:opacity-40 dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)]"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
          aria-label="Halaman sebelumnya"
          className="flex h-8 items-center gap-1 rounded-md border-2 border-[#1E2024] bg-card px-2.5 text-xs font-bold text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:pointer-events-none disabled:opacity-40 dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)]"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageItem, idx) => {
            if (pageItem === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-8 w-6 items-center justify-center text-xs font-bold text-muted-foreground select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(pageItem);
            const isActive = safeCurrentPage === pageNum;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`flex h-8 min-w-[32px] items-center justify-center rounded-md border-2 px-2 text-xs font-mono font-black transition-all ${
                  isActive
                    ? "border-[#1E2024] bg-primary text-white shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)]"
                    : "border-transparent bg-transparent text-[#1E2024] hover:border-[#1E2024] hover:bg-muted/40 dark:text-[#F4F1EA] dark:hover:border-[#F4F1EA]"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= totalPages}
          aria-label="Halaman berikutnya"
          className="flex h-8 items-center gap-1 rounded-md border-2 border-[#1E2024] bg-card px-2.5 text-xs font-bold text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:pointer-events-none disabled:opacity-40 dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)]"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={safeCurrentPage >= totalPages}
          aria-label="Halaman terakhir"
          className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-[#1E2024] bg-card text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:pointer-events-none disabled:opacity-40 dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)]"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Custom hook untuk mengelola state pagination client-side pada tabel data
 */
export function usePagination<T>(data: T[], defaultRowsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultRowsPerPage);

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);

  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  const goToPage = (page: number) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(clamped);
  };

  const handleRowsPerPageChange = (newSize: number) => {
    setRowsPerPage(newSize);
    setCurrentPage(1);
  };

  return {
    currentPage: safeCurrentPage,
    rowsPerPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    paginatedData,
    goToPage,
    setRowsPerPage: handleRowsPerPageChange,
    resetPage: () => setCurrentPage(1),
  };
}
