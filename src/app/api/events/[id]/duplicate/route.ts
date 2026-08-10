import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Event, { type IEvent } from "@/models/Event";
import { generateUniqueSlug } from "@/lib/slug";

type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/events/[id]/duplicate
 * Protected. Clones an existing event as a starting point for a recurring
 * event (e.g. a weekly workshop) so the admin doesn't have to re-enter every
 * field. The clone gets a fresh slug ("-copy" suffix) and its date bumped to
 * today, since re-using the original date/slug would be confusing.
 */
export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
    }

    await connectDB();
    const original = await Event.findById(id).lean<IEvent>();

    if (!original) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const newTitle = `${original.title} (Copy)`;
    const slug = await generateUniqueSlug(newTitle);

    const clone = await Event.create({
      title: newTitle,
      slug,
      description: original.description,
      date: new Date(),
      time: original.time,
      venue: original.venue,
      category: original.category,
      imageUrl: original.imageUrl,
      registrationLink: original.registrationLink,
    });

    return NextResponse.json({ event: clone }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events/[id]/duplicate error:", error);
    return NextResponse.json(
      { error: "Failed to duplicate event" },
      { status: 500 }
    );
  }
}
