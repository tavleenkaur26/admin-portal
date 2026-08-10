import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Calendar, ArrowUpRight } from "lucide-react";
import type { EventDTO } from "@/types";
import CategoryBadge from "./CategoryBadge";

export default function EventCard({ event }: { event: EventDTO }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/5 dark:border-slate-800 dark:bg-slate-900">
      <Link href={`/events/${event.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <CategoryBadge category={event.category} className="shadow-sm" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <Link href={`/events/${event.slug}`}>
          <h3 className="font-display text-lg font-semibold leading-snug text-slate-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400 line-clamp-2">
            {event.title}
          </h3>
        </Link>

        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
          {event.description}
        </p>

        <div className="mt-1 flex flex-col gap-1.5 text-sm text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="shrink-0 text-brand-500" />
            {format(new Date(event.date), "EEE, MMM d, yyyy")} &middot; {event.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="shrink-0 text-brand-500" />
            <span className="truncate">{event.venue}</span>
          </span>
        </div>

        <a
          href={event.registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98]"
        >
          Register Now
          <ArrowUpRight size={15} />
        </a>
      </div>
    </article>
  );
}
