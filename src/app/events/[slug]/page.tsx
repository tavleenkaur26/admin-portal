import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import Navbar from "@/components/Navbar";
import CategoryBadge from "@/components/CategoryBadge";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getEvent(slug: string) {
  await connectDB();
  const event = await Event.findOne({ slug }).lean();
  return event ? JSON.parse(JSON.stringify(event)) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return { title: "Event not found | MSc Society" };
  }

  return {
    title: `${event.title} | MSc Society Events`,
    description: event.description.slice(0, 155),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 155),
      images: [{ url: event.imageUrl }],
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
        >
          <ArrowLeft size={15} />
          Back to all events
        </Link>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>

          <div className="p-6 sm:p-8">
            <CategoryBadge category={event.category} />

            <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {event.title}
            </h1>

            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:flex-wrap sm:gap-6">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-brand-500" />
                {format(new Date(event.date), "EEEE, MMMM d, yyyy")} &middot;{" "}
                {event.time}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-brand-500" />
                {event.venue}
              </span>
            </div>

            <p className="mt-6 whitespace-pre-line text-slate-600 dark:text-slate-300">
              {event.description}
            </p>

            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98] sm:w-auto"
            >
              Register Now
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
