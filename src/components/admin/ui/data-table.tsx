"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Inbox,
  Loader2,
} from "lucide-react";

/**
 * Definisi Kolom DataTable
 */
export interface ColumnDef<T> {
  /** Identifier unik kolom */
  key: string;
  /** Label judul kolom (string atau ReactNode) */
  header: React.ReactNode;
  /** Fungsi accessor nilai dari data item (opsional jika menggunakan render) */
  accessor?: (item: T) => React.ReactNode;
  /** Custom renderer untuk cell (menerima data item dan row index) */
  render?: (item: T, index: number) => React.ReactNode;
  /** Alignment teks: left | center | right */
  align?: "left" | "center" | "right";
  /** Custom className untuk <td> */
  className?: string;
  /** Custom className untuk <th> */
  headerClassName?: string;
}

/**
 * Props Komponen DataTable
 */
export interface DataTableProps<T> {
  /** Array data dinamis yang akan ditampilkan */
  data: T[];
  /** Konfigurasi kolom */
  columns: ColumnDef<T>[];
  /** Custom extractor untuk key tiap baris (default menggunakan item.id jika ada, atau index) */
  keyExtractor?: (item: T, index: number) => string | number;
  /** Jumlah baris per halaman default (default: 10) */
  defaultRowsPerPage?: 10 | 20 | 50;
  /** Tampilkan opsi pencarian client-side (default: false) */
  searchable?: boolean;
  /** Placeholder text untuk input search */
  searchPlaceholder?: string;
  /** Fungsi pencarian custom (opsional, jika tidak ada akan mencari di seluruh string value) */
  searchFilter?: (item: T, query: string) => boolean;
  /** Teks/komponen saat data kosong */
  emptyMessage?: React.ReactNode;
  /** Indikator loading */
  isLoading?: boolean;
  /** Custom className untuk container tabel */
  className?: string;
  /** Action bar tambahan di sebelah search / atas tabel (opsional) */
  actionHeader?: React.ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  defaultRowsPerPage = 10,
  searchable = false,
  searchPlaceholder = "Cari data...",
  searchFilter,
  emptyMessage = "Tidak ada data yang ditemukan",
  isLoading = false,
  className = "",
  actionHeader,
}: DataTableProps<T>) {
  // State Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultRowsPerPage);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Opsi baris per halaman yang diwajibkan: 10, 20, 50
  const rowsPerPageOptions = [10, 20, 50];

  // Filter data berdasarkan search query jika mode searchable aktif
  const filteredData = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase().trim();

    if (searchFilter) {
      return data.filter((item) => searchFilter(item, query));
    }

    // Default search: scan semua value string/number di dalam object
    return data.filter((item) => {
      return Object.values(item).some((val) => {
        if (val === null || val === undefined) return false;
        if (typeof val === "string" || typeof val === "number") {
          return String(val).toLowerCase().includes(query);
        }
        return false;
      });
    });
  }, [data, searchable, searchQuery, searchFilter]);

  // Total halaman
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  // Amankan halaman aktif (clamped) tanpa cascading setState di useEffect
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // Hitung slice data untuk halaman aktif
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
  const currentData = useMemo(() => {
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, startIndex, endIndex]);

  // Handler navigasi
  const goToPage = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clampedPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setRowsPerPage(newSize);
    setCurrentPage(1); // Reset selalu ke halaman pertama saat ganti rows per page
  };

  // Helper kalkulasi tombol nomor halaman dengan pagination window
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Selalu sertakan halaman 1
      pages.push(1);

      if (safeCurrentPage > 3) {
        pages.push("...");
      }

      // Halaman tengah
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (safeCurrentPage < totalPages - 2) {
        pages.push("...");
      }

      // Selalu sertakan halaman terakhir
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={`flex flex-col gap-4 rounded-xl border-[3px] border-[#1E2024] bg-card p-4 sm:p-5 shadow-[4px_4px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)] ${className}`}
    >
      {/* Top Toolbar: Search & Action Header */}
      {(searchable || actionHeader) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {searchable ? (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-lg border-2 border-[#1E2024] bg-muted/40 pl-9 pr-3.5 text-xs sm:text-sm font-medium text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:border-[#F4F1EA] dark:bg-muted/20 dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)]"
              />
            </div>
          ) : (
            <div />
          )}

          {actionHeader && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {actionHeader}
            </div>
          )}
        </div>
      )}

      {/* Table Container dengan Responsive Scroll */}
      <div className="overflow-x-auto rounded-lg border-2 border-[#1E2024] dark:border-[#F4F1EA]">
        <table className="w-full text-left text-xs sm:text-sm">
          {/* Header */}
          <thead className="border-b-2 border-[#1E2024] bg-muted/80 font-mono text-xs uppercase tracking-wider text-[#1E2024] dark:border-[#F4F1EA] dark:bg-muted/40 dark:text-[#F4F1EA]">
            <tr>
              {columns.map((col) => {
                const alignClass =
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                      ? "text-right"
                      : "text-left";

                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 font-black ${alignClass} ${col.headerClassName || ""}`}
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y-2 divide-[#1E2024]/10 dark:divide-[#F4F1EA]/10">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-xs font-mono font-bold">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="h-8 w-8 text-muted-foreground/60" />
                    <div className="text-sm font-bold">{emptyMessage}</div>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-xs text-primary underline hover:opacity-80"
                      >
                        Reset pencarian
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map((item, rowIndex) => {
                const rowKey = keyExtractor
                  ? keyExtractor(item, startIndex + rowIndex)
                  : item.id ?? startIndex + rowIndex;

                return (
                  <tr
                    key={String(rowKey)}
                    className="transition-colors hover:bg-muted/40 dark:hover:bg-muted/20"
                  >
                    {columns.map((col) => {
                      const alignClass =
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                            ? "text-right"
                            : "text-left";

                      // Resolusi konten cell
                      let cellContent: React.ReactNode = null;
                      if (col.render) {
                        cellContent = col.render(item, startIndex + rowIndex);
                      } else if (col.accessor) {
                        cellContent = col.accessor(item);
                      } else {
                        cellContent = item[col.key] as React.ReactNode;
                      }

                      return (
                        <td
                          key={col.key}
                          className={`px-4 py-3.5 align-middle ${alignClass} ${col.className || ""}`}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Pagination Bar */}
      <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
        {/* Info & Rows Per Page Selector */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
          {/* Dropdown Rows Per Page */}
          <div className="flex items-center gap-2">
            <label htmlFor="rows-per-page-select" className="font-bold text-[#1E2024] dark:text-[#F4F1EA]">
              Baris per halaman:
            </label>
            <select
              id="rows-per-page-select"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="h-8 rounded-md border-2 border-[#1E2024] bg-card px-2.5 text-xs font-black text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] transition-all hover:bg-muted/40 focus:border-primary focus:outline-none dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)]"
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Menampilkan X-Y dari Total */}
          <div>
            {totalItems === 0 ? (
              <span>0 data</span>
            ) : (
              <span>
                Menampilkan <strong className="text-[#1E2024] dark:text-[#F4F1EA]">{startIndex + 1}</strong>
                {" - "}
                <strong className="text-[#1E2024] dark:text-[#F4F1EA]">{endIndex}</strong> dari{" "}
                <strong className="text-[#1E2024] dark:text-[#F4F1EA]">{totalItems}</strong> data
              </span>
            )}
          </div>
        </div>

        {/* Pagination Navigation Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* First Page Button */}
          <button
            type="button"
            onClick={() => goToPage(1)}
            disabled={safeCurrentPage <= 1 || isLoading}
            aria-label="Halaman pertama"
            className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-[#1E2024] bg-card text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:pointer-events-none disabled:opacity-40 dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)]"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>

          {/* Previous Button */}
          <button
            type="button"
            onClick={() => goToPage(safeCurrentPage - 1)}
            disabled={safeCurrentPage <= 1 || isLoading}
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
                  onClick={() => goToPage(pageNum)}
                  disabled={isLoading}
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

          {/* Next Button */}
          <button
            type="button"
            onClick={() => goToPage(safeCurrentPage + 1)}
            disabled={safeCurrentPage >= totalPages || isLoading}
            aria-label="Halaman berikutnya"
            className="flex h-8 items-center gap-1 rounded-md border-2 border-[#1E2024] bg-card px-2.5 text-xs font-bold text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:pointer-events-none disabled:opacity-40 dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)]"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          {/* Last Page Button */}
          <button
            type="button"
            onClick={() => goToPage(totalPages)}
            disabled={safeCurrentPage >= totalPages || isLoading}
            aria-label="Halaman terakhir"
            className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-[#1E2024] bg-card text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:pointer-events-none disabled:opacity-40 dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)]"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
