import { CalendarCheck, CalendarClock, CalendarX2, Tag } from "lucide-react";
import type { StatsResponse } from "@/types";

const CARDS = [
  {
    key: "total" as const,
    label: "Total events",
    icon: CalendarCheck,
  },
  {
    key: "upcoming" as const,
    label: "Upcoming",
    icon: CalendarClock,
  },
  {
    key: "past" as const,
    label: "Past",
    icon: CalendarX2,
  },
];

export default function StatsBar({
  stats,
  loading,
}: {
  stats: StatsResponse | undefined;
  loading: boolean;
}) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CARDS.map(({ key, label, icon: Icon }) => (
        <div
          key={key}
          className="border-2 border-ink-900 bg-paper-50 p-4 dark:border-paper-200 dark:bg-ink-900"
        >
          <div className="mb-2 inline-flex h-8 w-8 items-center justify-center border-2 border-ink-900 bg-brand-600 text-paper-50 dark:border-paper-200">
            <Icon size={16} />
          </div>
          {loading ? (
            <div className="skeleton h-8 w-10" />
          ) : (
            <p className="font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
              {stats ? stats[key] : "—"}
            </p>
          )}
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-300">{label}</p>
        </div>
      ))}

      <div className="border-2 border-ink-900 bg-paper-50 p-4 dark:border-paper-200 dark:bg-ink-900">
        <div className="mb-2 inline-flex h-8 w-8 items-center justify-center border-2 border-ink-900 bg-accent-600 text-paper-50 dark:border-paper-200">
          <Tag size={16} />
        </div>
        {loading ? (
          <div className="skeleton h-8 w-16" />
        ) : (
          <p className="truncate font-display text-xl font-bold text-ink-900 dark:text-paper-50">
            {stats?.topCategory?.name ?? "—"}
          </p>
        )}
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-300">Top category</p>
      </div>
    </div>
  );
}