import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Calendar, ArrowUpRight } from "lucide-react";
import type { EventDTO } from "@/types";
import CategoryBadge from "./CategoryBadge";

export default function EventCard({ event }: { event: EventDTO }) {
  return (
    <article className="group flex flex-col overflow-hidden border-2 border-ink-900 bg-paper-50 transition hover:-translate-y-1 dark:border-paper-200 dark:bg-ink-900">
      <Link
        href={`/events/${event.slug}`}
        className="relative block aspect-[16/10] overflow-hidden border-b-2 border-ink-900 bg-ink-100 dark:border-paper-200 dark:bg-ink-800"
      >
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover grayscale-[15%] transition duration-300 group-hover:scale-105 group-hover:grayscale-0"
        />
        <div className="absolute left-0 top-0">
          <CategoryBadge category={event.category} className="rounded-none border-b-2 border-r-2 border-ink-900 dark:border-paper-200" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link href={`/events/${event.slug}`}>
          <h3 className="font-display text-xl font-bold leading-snug text-ink-900 transition group-hover:text-brand-600 dark:text-paper-50 dark:group-hover:text-brand-400 line-clamp-2">
            {event.title}
          </h3>
        </Link>

        <p className="line-clamp-2 text-sm text-ink-500 dark:text-ink-300">
          {event.description}
        </p>

        <div className="mt-1 flex flex-col gap-1.5 border-t border-dashed border-ink-200 pt-3 text-sm text-ink-600 dark:border-ink-700 dark:text-ink-200">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="shrink-0 text-brand-600 dark:text-brand-400" />
            {format(new Date(event.date), "EEE, MMM d, yyyy")} &middot; {event.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="shrink-0 text-brand-600 dark:text-brand-400" />
            <span className="truncate">{event.venue}</span>
          </span>
        </div>

        <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center justify-center gap-1.5 border-2 border-ink-900 bg-ink-900 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-paper-50 transition hover:bg-brand-600 hover:border-brand-600 active:scale-[0.98] dark:border-paper-100 dark:bg-paper-100 dark:text-ink-900 dark:hover:bg-brand-500 dark:hover:border-brand-500 dark:hover:text-paper-50">
          Register Now
          <ArrowUpRight size={15} />
        </a>
      </div>
    </article>
  );
}