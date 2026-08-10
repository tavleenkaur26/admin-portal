import { CalendarCheck, CalendarClock, CalendarX2, Tag } from "lucide-react";
import type { StatsResponse } from "@/types";

const CARDS = [
  {
    key: "total" as const,
    label: "Total events",
    icon: CalendarCheck,
    color: "text-brand-600 bg-brand-50 dark:bg-brand-950 dark:text-brand-400",
  },
  {
    key: "upcoming" as const,
    label: "Upcoming",
    icon: CalendarClock,
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    key: "past" as const,
    label: "Past",
    icon: CalendarX2,
    color: "text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400",
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
      {CARDS.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
            <Icon size={16} />
          </div>
          {loading ? (
            <div className="skeleton h-7 w-10 rounded-md" />
          ) : (
            <p className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
              {stats ? stats[key] : "—"}
            </p>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      ))}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-900/40 dark:text-accent-400">
          <Tag size={16} />
        </div>
        {loading ? (
          <div className="skeleton h-7 w-16 rounded-md" />
        ) : (
          <p className="truncate font-display text-lg font-semibold text-slate-900 dark:text-white">
            {stats?.topCategory?.name ?? "—"}
          </p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400">Top category</p>
      </div>
    </div>
  );
}
