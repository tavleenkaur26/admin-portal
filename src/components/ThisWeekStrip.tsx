import Link from "next/link";
import Image from "next/image";
import { format, isSameDay } from "date-fns";
import type { EventDTO } from "@/types";
import CategoryBadge from "./CategoryBadge";

/**
 * Highlights events happening in the next 7 days as a horizontally
 * scrollable strip above the main grouped grid. This is a deliberate UX
 * choice: a flat chronological list of "upcoming events" buries the things
 * that actually need a decision *this week*. Surfacing them separately
 * mirrors how real events platforms (Luma, Eventbrite) reduce the "what's
 * happening soon" question to a glance.
 */
export default function ThisWeekStrip({ events }: { events: EventDTO[] }) {
  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(now.getDate() + 7);

  const thisWeek = events.filter((e) => {
    const d = new Date(e.date);
    return d >= new Date(now.toDateString()) && d <= weekFromNow;
  });

  if (thisWeek.length === 0) return null;

  return (
    <section className="mb-10 animate-fade-in">
      <div className="mb-4 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-500" />
        </span>
        <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
          Happening this week
        </h2>
      </div>

      <div className="scrollbar-thin -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {thisWeek.map((event) => {
          const today = isSameDay(new Date(event.date), now);
          return (
            <Link
              key={event._id}
              href={`/events/${event.slug}`}
              className="group relative w-64 shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  sizes="256px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                {today && (
                  <span className="absolute left-2 top-2 rounded-full bg-accent-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow">
                    Today
                  </span>
                )}
              </div>
              <div className="space-y-1.5 p-3">
                <CategoryBadge category={event.category} />
                <h3 className="line-clamp-1 font-display text-sm font-semibold text-slate-900 dark:text-white">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {format(new Date(event.date), "EEE, MMM d")} &middot; {event.time}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
