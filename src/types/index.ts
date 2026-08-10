import type { EventCategory } from "@/lib/constants";

export interface EventDTO {
  _id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: EventCategory;
  imageUrl: string;
  registrationLink: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EventsResponse {
  events: EventDTO[];
  pagination: PaginationInfo;
}

export interface StatsResponse {
  total: number;
  upcoming: number;
  past: number;
  topCategory: { name: string; count: number } | null;
}
