"use client";

import { Search } from "lucide-react";
import { EVENT_CATEGORIES } from "@/lib/constants";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  timeframe: string;
  onTimeframeChange: (v: string) => void;
}

export default function EventFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  timeframe,
  onTimeframeChange,
}: Props) {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search events by name, venue, or keyword..."
          className="w-full border-2 border-ink-900 bg-paper-50 py-2.5 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-paper-200 dark:bg-ink-900 dark:text-paper-50 dark:placeholder:text-ink-400"
        />
      </div>

      <div className="flex gap-3">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border-2 border-ink-900 bg-paper-50 px-3 py-2.5 text-sm font-medium text-ink-700 focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-paper-200 dark:bg-ink-900 dark:text-paper-100"
        >
          <option value="all">All categories</option>
          {EVENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={timeframe}
          onChange={(e) => onTimeframeChange(e.target.value)}
          className="border-2 border-ink-900 bg-paper-50 px-3 py-2.5 text-sm font-medium text-ink-700 focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-paper-200 dark:bg-ink-900 dark:text-paper-100"
        >
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="all">All</option>
        </select>
      </div>
    </div>
  );
}