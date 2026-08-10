import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import { eventFormSchema } from "@/lib/validations";
import { generateUniqueSlug } from "@/lib/slug";

/**
 * GET /api/events
 * Public. Supports query params:
 *  - q: text search across title/description/venue
 *  - category: filter by category
 *  - timeframe: "upcoming" | "past" | "all" (default "upcoming")
 *  - page, limit: pagination (defaults 1, 9)
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category");
    const timeframe = searchParams.get("timeframe") ?? "upcoming";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 9));

    const filter: Record<string, unknown> = {};

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (timeframe === "upcoming") {
      filter.date = { $gte: now };
    } else if (timeframe === "past") {
      filter.date = { $lt: now };
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (q) {
      filter.$text = { $search: q };
    }

    const sortOrder = timeframe === "past" ? -1 : 1;

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ date: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Event.countDocuments(filter),
    ]);

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events
 * Protected. Creates a new event.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const parsed = eventFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const slug = await generateUniqueSlug(parsed.data.title);

    const event = await Event.create({
      ...parsed.data,
      slug,
      date: new Date(parsed.data.date),
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
