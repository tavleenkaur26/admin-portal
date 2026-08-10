"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center border-2 border-ink-900 text-ink-700 transition hover:bg-ink-900 hover:text-paper-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-700 dark:border-paper-200 dark:text-paper-100 dark:hover:bg-paper-100 dark:hover:text-ink-900"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, idx) => {
        const prev = pages[idx - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {showEllipsis && <span className="px-1 text-ink-400">&hellip;</span>}
            <button
              onClick={() => onChange(p)}
              className={`flex h-9 w-9 items-center justify-center border-2 text-sm font-bold transition ${
                p === page
                  ? "border-ink-900 bg-brand-600 text-paper-50 dark:border-paper-200"
                  : "border-ink-900 text-ink-700 hover:bg-ink-900 hover:text-paper-50 dark:border-paper-200 dark:text-paper-100 dark:hover:bg-paper-100 dark:hover:text-ink-900"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center border-2 border-ink-900 text-ink-700 transition hover:bg-ink-900 hover:text-paper-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-700 dark:border-paper-200 dark:text-paper-100 dark:hover:bg-paper-100 dark:hover:text-ink-900"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}