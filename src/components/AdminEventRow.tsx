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
    <div className="flex flex-col gap-4 border-2 border-ink-900 bg-paper-50 p-4 transition hover:border-brand-600 dark:border-paper-200 dark:bg-ink-900 dark:hover:border-brand-400 sm:flex-row sm:items-center">
      <div className="relative h-32 w-full shrink-0 overflow-hidden border-2 border-ink-900 bg-ink-100 dark:border-paper-200 dark:bg-ink-800 sm:h-16 sm:w-24">
        <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-display font-bold text-ink-900 dark:text-paper-50">
            {event.title}
          </h3>
          <CategoryBadge category={event.category} />
          {isPast && (
            <span className="border border-ink-300 px-2 py-0.5 text-xs font-semibold uppercase text-ink-500 dark:border-ink-600 dark:text-ink-400">
              Past
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
          {format(new Date(event.date), "MMM d, yyyy")} &middot; {event.time} &middot;{" "}
          {event.venue}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Link
          href={`/events/${event.slug}`}
          target="_blank"
          className="flex h-9 w-9 items-center justify-center text-ink-500 transition hover:bg-ink-900 hover:text-paper-50 dark:text-ink-400 dark:hover:bg-paper-100 dark:hover:text-ink-900"
          title="View public page"
        >
          <ExternalLink size={16} />
        </Link>
        <button
          onClick={onDuplicate}
          disabled={duplicating}
          className="flex h-9 w-9 items-center justify-center text-ink-500 transition hover:bg-ink-900 hover:text-paper-50 disabled:opacity-50 dark:text-ink-400 dark:hover:bg-paper-100 dark:hover:text-ink-900"
          title="Duplicate event"
        >
          <Copy size={16} />
        </button>
        <Link
          href={`/admin/dashboard/edit/${event._id}`}
          className="flex h-9 w-9 items-center justify-center text-ink-500 transition hover:bg-ink-900 hover:text-paper-50 dark:text-ink-400 dark:hover:bg-paper-100 dark:hover:text-ink-900"
          title="Edit event"
        >
          <Pencil size={16} />
        </Link>
        <button
          onClick={onDelete}
          className="flex h-9 w-9 items-center justify-center text-ink-500 transition hover:bg-brand-600 hover:text-paper-50 dark:text-ink-400"
          title="Delete event"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}