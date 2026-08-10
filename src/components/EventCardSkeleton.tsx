export default function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="skeleton aspect-[16/10] w-full" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4 rounded-md" />
        <div className="skeleton h-4 w-full rounded-md" />
        <div className="skeleton h-4 w-2/3 rounded-md" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
