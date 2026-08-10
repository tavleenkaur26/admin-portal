"use client";

import { useEffect, useMemo, useState } from "react";
import { format, isToday, isTomorrow } from "date-fns";
import useSWR from "swr";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import EmptyState from "@/components/EmptyState";
import EventFilters from "@/components/EventFilters";
import Pagination from "@/components/Pagination";
import ThisWeekStrip from "@/components/ThisWeekStrip";
import type { EventDTO, EventsResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/** Human-friendly group label for a date, used as section headers below. */
function groupLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEEE, MMMM d");
}

function groupByDate(events: EventDTO[]): [string, EventDTO[]][] {
  const groups = new Map<string, EventDTO[]>();
  for (const event of events) {
    const label = groupLabel(new Date(event.date));
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(event);
  }
  return Array.from(groups.entries());
}

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [timeframe, setTimeframe] = useState("upcoming");
  const [page, setPage] = useState(1);

  // Debounce search input so we're not hitting the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, timeframe]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (category !== "all") params.set("category", category);
    params.set("timeframe", timeframe);
    params.set("page", String(page));
    params.set("limit", "9");
    return params.toString();
  }, [debouncedSearch, category, timeframe, page]);

  const { data, isLoading } = useSWR<EventsResponse>(
    `/api/events?${query}`,
    fetcher,
    { keepPreviousData: true }
  );

  const events = data?.events ?? [];
  const grouped = groupByDate(events);
  const isFiltering = Boolean(debouncedSearch) || category !== "all";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Events
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Workshops, hackathons, talks, and everything else the MSC IGDTUW
            is running.
          </p>
        </div>

        {timeframe === "upcoming" && !isFiltering && page === 1 && (
          <ThisWeekStrip events={events} />
        )}

        <EventFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            title="No events found"
            description={
              isFiltering
                ? "Try a different search term or clear your filters."
                : "There's nothing here yet — check back soon."
            }
          />
        ) : (
          <div className="space-y-10">
            {grouped.map(([label, group]) => (
              <section key={label} className="animate-slide-up">
                <h2 className="mb-4 font-display text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {label}
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {data && (
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>
    </div>
  );
}
