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
    return { title: "Event not found | MSC IGDTUW" };
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
    <div className="min-h-screen bg-paper-100 dark:bg-ink-950">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Link href="/events" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-ink-500 transition hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">
          <ArrowLeft size={15} />
          Back to all events
        </Link>

        <div className="overflow-hidden border-2 border-ink-900 bg-paper-50 dark:border-paper-200 dark:bg-ink-900">
          <div className="relative aspect-[16/9] w-full border-b-2 border-ink-900 bg-ink-100 dark:border-paper-200 dark:bg-ink-800">
            <Image src={event.imageUrl} alt={event.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
          </div>

          <div className="p-6 sm:p-8">
            <CategoryBadge category={event.category} />

            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-900 dark:text-paper-50 sm:text-4xl">
              {event.title}
            </h1>

            <div className="mt-4 flex flex-col gap-2 border-b border-dashed border-ink-200 pb-6 text-sm font-medium text-ink-600 dark:border-ink-700 dark:text-ink-200 sm:flex-row sm:flex-wrap sm:gap-6">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-brand-600 dark:text-brand-400" />
                {format(new Date(event.date), "EEEE, MMMM d, yyyy")} &middot; {event.time}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-brand-600 dark:text-brand-400" />
                {event.venue}
              </span>
            </div>

            <p className="mt-6 whitespace-pre-line text-ink-600 dark:text-ink-200">
              {event.description}
            </p>

            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex w-full items-center justify-center gap-1.5 border-2 border-ink-900 bg-ink-900 px-6 py-3 text-sm font-bold uppercase tracking-wide text-paper-50 transition hover:bg-brand-600 hover:border-brand-600 active:scale-[0.98] dark:border-paper-100 dark:bg-paper-100 dark:text-ink-900 dark:hover:bg-brand-500 dark:hover:border-brand-500 dark:hover:text-paper-50 sm:w-auto">
              Register Now
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}