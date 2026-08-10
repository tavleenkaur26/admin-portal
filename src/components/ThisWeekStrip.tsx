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
    <section className="mb-12 animate-fade-in">
      <div className="mb-5 flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping bg-brand-500 opacity-75" />
          <span className="relative inline-flex h-3 w-3 bg-brand-600" />
        </span>
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink-900 dark:text-paper-50">
          Happening This Week
        </h2>
        <span className="hidden h-px flex-1 bg-ink-900 dark:bg-paper-200 sm:block" />
      </div>

      <div className="scrollbar-thin -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {thisWeek.map((event) => {
          const today = isSameDay(new Date(event.date), now);
          return (
            <Link
              key={event._id}
              href={`/events/${event.slug}`}
              className="group relative w-64 shrink-0 snap-start overflow-hidden border-2 border-ink-900 bg-paper-50 transition hover:-translate-y-1 dark:border-paper-200 dark:bg-ink-900"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-ink-900 bg-ink-100 dark:border-paper-200 dark:bg-ink-800">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  sizes="256px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                {today && (
                  <span className="absolute left-0 top-0 border-b-2 border-r-2 border-ink-900 bg-brand-600 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-paper-50 dark:border-paper-200">
                    Today
                  </span>
                )}
              </div>
              <div className="space-y-1.5 p-3">
                <CategoryBadge category={event.category} />
                <h3 className="line-clamp-1 font-display text-base font-bold text-ink-900 dark:text-paper-50">
                  {event.title}
                </h3>
                <p className="text-xs font-medium text-ink-500 dark:text-ink-300">
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