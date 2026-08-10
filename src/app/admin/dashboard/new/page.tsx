import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EventForm from "@/components/EventForm";

export default function NewEventPage() {
  return (
    <div>
      <Link href="/admin/dashboard" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-ink-500 transition hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">
        <ArrowLeft size={15} />
        Back to dashboard
      </Link>

      <h1 className="mb-6 font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
        Add New Event
      </h1>

      <EventForm mode="create" />
    </div>
  );
}