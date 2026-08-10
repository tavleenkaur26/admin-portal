"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Copy, Pencil, Trash2, ExternalLink } from "lucide-react";
import type { EventDTO } from "@/types";
import CategoryBadge from "./CategoryBadge";

export default function AdminEventRow({
  event,
  onDelete,
  onDuplicate,
  duplicating,
}: {
  event: EventDTO;
  onDelete: () => void;
  onDuplicate: () => void;
  duplicating: boolean;
}) {
  const isPast = new Date(event.date) < new Date(new Date().toDateString());

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 sm:h-16 sm:w-24">
        <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-medium text-slate-900 dark:text-white">
            {event.title}
          </h3>
          <CategoryBadge category={event.category} />
          {isPast && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Past
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {format(new Date(event.date), "MMM d, yyyy")} &middot; {event.time} &middot;{" "}
          {event.venue}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <Link
          href={`/events/${event.slug}`}
          target="_blank"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-slate-800"
          title="View public page"
        >
          <ExternalLink size={16} />
        </Link>
        <button
          onClick={onDuplicate}
          disabled={duplicating}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-brand-600 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800"
          title="Duplicate event"
        >
          <Copy size={16} />
        </button>
        <Link
          href={`/admin/dashboard/edit/${event._id}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-slate-800"
          title="Edit event"
        >
          <Pencil size={16} />
        </Link>
        <button
          onClick={onDelete}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950"
          title="Delete event"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
