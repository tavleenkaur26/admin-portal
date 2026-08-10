import slugify from "slugify";
import Event, { type IEvent } from "@/models/Event";

/**
 * Generates a unique, URL-safe slug from an event title. If the base slug
 * already exists (e.g. two events titled "Intro to AI"), appends a short
 * numeric suffix until it's unique. Used for the /events/[slug] detail pages.
 */
export async function generateUniqueSlug(
  title: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(title, { lower: true, strict: true });
  let candidate = base;
  let counter = 1;

  while (true) {
    const existing = await Event.findOne({ slug: candidate }).lean<IEvent>();
    if (!existing || (excludeId && String(existing._id) === excludeId)) {
      return candidate;
    }
    counter += 1;
    candidate = `${base}-${counter}`;
  }
}
