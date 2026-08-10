import { CalendarX } from "lucide-react";

export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-ink-300 py-16 text-center dark:border-ink-700">
      <div className="mb-4 flex h-14 w-14 items-center justify-center border-2 border-ink-900 bg-paper-50 text-ink-400 dark:border-paper-200 dark:bg-ink-900 dark:text-ink-500">
        <CalendarX size={26} />
      </div>
      <h3 className="font-display text-xl font-bold text-ink-800 dark:text-paper-100">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-ink-500 dark:text-ink-400">
        {description}
      </p>
    </div>
  );
}