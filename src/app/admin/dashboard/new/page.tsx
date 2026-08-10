import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EventForm from "@/components/EventForm";

export default function NewEventPage() {
  return (
    <div>
      <Link
        href="/admin/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <ArrowLeft size={15} />
        Back to dashboard
      </Link>

      <h1 className="mb-6 font-display text-2xl font-semibold text-slate-900 dark:text-white">
        Add New Event
      </h1>

      <EventForm mode="create" />
    </div>
  );
}
