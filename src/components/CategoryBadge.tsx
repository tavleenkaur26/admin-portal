import type { EventCategory } from "@/lib/constants";

const COLORS: Record<EventCategory, string> = {
  Workshop: "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300",
  Hackathon: "bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300",
  Seminar: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  Competition: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  Talk: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  Bootcamp: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Meetup: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300",
  Other: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export default function CategoryBadge({
  category,
  className = "",
}: {
  category: EventCategory;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${COLORS[category]} ${className}`}
    >
      {category}
    </span>
  );
}
