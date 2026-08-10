export default function EventCardSkeleton() {
  return (
    <div className="overflow-hidden border-2 border-ink-900 bg-paper-50 dark:border-paper-200 dark:bg-ink-900">
      <div className="skeleton aspect-[16/10] w-full border-b-2 border-ink-900 dark:border-paper-200" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-10 w-full" />
      </div>
    </div>
  );
}