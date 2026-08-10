import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";

/**
 * GET /api/events/stats
 * Protected. Powers the admin dashboard stats bar: total events, how many
 * are upcoming vs past, and the most popular category. Computed with a
 * single aggregation pipeline rather than fetching all events and counting
 * in JS, so it stays cheap as the collection grows.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const [totals, categoryBreakdown] = await Promise.all([
      Event.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            upcoming: {
              $sum: { $cond: [{ $gte: ["$date", now] }, 1, 0] },
            },
            past: {
              $sum: { $cond: [{ $lt: ["$date", now] }, 1, 0] },
            },
          },
        },
      ]),
      Event.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),
    ]);

    const base = totals[0] ?? { total: 0, upcoming: 0, past: 0 };
    const topCategory = categoryBreakdown[0]
      ? { name: categoryBreakdown[0]._id, count: categoryBreakdown[0].count }
      : null;

    return NextResponse.json({
      total: base.total,
      upcoming: base.upcoming,
      past: base.past,
      topCategory,
    });
  } catch (error) {
    console.error("GET /api/events/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
