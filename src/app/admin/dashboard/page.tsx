"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import toast from "react-hot-toast";
import { Plus, Search } from "lucide-react";
import StatsBar from "@/components/StatsBar";
import AdminEventRow from "@/components/AdminEventRow";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import ConfirmDialog from "@/components/ConfirmDialog";
import { EVENT_CATEGORIES } from "@/lib/constants";
import type { EventsResponse, StatsResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboardPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [timeframe, setTimeframe] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

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
    params.set("limit", "8");
    return params.toString();
  }, [debouncedSearch, category, timeframe, page]);

  const eventsKey = `/api/events?${query}`;
  const { data, isLoading } = useSWR<EventsResponse>(eventsKey, fetcher, {
    keepPreviousData: true,
  });
  const { data: stats, isLoading: statsLoading } = useSWR<StatsResponse>("/api/events/stats", fetcher);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/events/${deleteTarget}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Event deleted");
      mutate(eventsKey);
      mutate("/api/events/stats");
    } catch {
      toast.error("Failed to delete event");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function handleDuplicate(id: string) {
    setDuplicatingId(id);
    try {
      const res = await fetch(`/api/events/${id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Event duplicated — edit the copy to update its date");
      mutate(eventsKey);
      mutate("/api/events/stats");
    } catch {
      toast.error("Failed to duplicate event");
    } finally {
      setDuplicatingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 border-b-2 border-ink-900 pb-6 dark:border-paper-100 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-paper-50">Events</h1>
          <p className="text-sm text-ink-500 dark:text-ink-300">Manage all events shown on the public page</p>
        </div>
        <Link href="/admin/dashboard/new" className="inline-flex items-center justify-center gap-1.5 border-2 border-ink-900 bg-brand-600 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-paper-50 transition hover:bg-brand-700 dark:border-paper-100">
          <Plus size={16} />
          Add Event
        </Link>
      </div>

      <StatsBar stats={stats} loading={statsLoading} />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your events..." className="w-full border-2 border-ink-900 bg-paper-50 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-paper-200 dark:bg-ink-900 dark:text-paper-50" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border-2 border-ink-900 bg-paper-50 px-3 py-2.5 text-sm font-medium dark:border-paper-200 dark:bg-ink-900 dark:text-paper-100">
          <option value="all">All categories</option>
          {EVENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="border-2 border-ink-900 bg-paper-50 px-3 py-2.5 text-sm font-medium dark:border-paper-200 dark:bg-ink-900 dark:text-paper-100">
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-24 w-full border-2 border-ink-900 dark:border-paper-200" />
          ))}
        </div>
      ) : data?.events.length === 0 ? (
        <EmptyState title="No events yet" description="Click 'Add Event' to create your first event." />
      ) : (
        <div className="space-y-3">
          {data?.events.map((event) => (
            <AdminEventRow key={event._id} event={event} onDelete={() => setDeleteTarget(event._id)} onDuplicate={() => handleDuplicate(event._id)} duplicating={duplicatingId === event._id} />
          ))}
        </div>
      )}

      {data && <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onChange={setPage} />}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this event?"
        description="This action can't be undone. The event will be permanently removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}