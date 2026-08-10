import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { ArrowLeft } from "lucide-react";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import EventForm from "@/components/EventForm";
import type { EventDTO } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const event = await Event.findById(id).lean();

  if (!event) notFound();

  const eventDTO: EventDTO = JSON.parse(JSON.stringify(event));

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
        Edit Event
      </h1>

      <EventForm mode="edit" initialData={eventDTO} />
    </div>
  );
}
