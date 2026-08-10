import type { EventCategory } from "@/lib/constants";

const COLORS: Record<EventCategory, string> = {
  Workshop: "bg-brand-500 text-paper-50",
  Hackathon: "bg-accent-600 text-paper-50",
  Seminar: "bg-ink-700 text-paper-50",
  Competition: "bg-brand-800 text-paper-50",
  Talk: "bg-accent-800 text-paper-50",
  Bootcamp: "bg-brand-600 text-paper-50",
  Meetup: "bg-ink-500 text-paper-50",
  Other: "bg-ink-400 text-paper-50",
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
      className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${COLORS[category]} ${className}`}
    >
      {category}
    </span>
  );
}