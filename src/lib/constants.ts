export const EVENT_CATEGORIES = [
  "Workshop",
  "Hackathon",
  "Seminar",
  "Competition",
  "Talk",
  "Bootcamp",
  "Meetup",
  "Other",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];