import { z } from "zod";
import { EVENT_CATEGORIES } from "@/lib/constants";

/**
 * Single source of truth for event validation. Used both client-side
 * (react-hook-form style manual validation in EventForm) and server-side
 * (API routes) so the rules can never drift apart.
 */
export const eventFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(3000, "Description cannot exceed 3000 characters"),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Enter a valid date"),
  time: z.string().trim().min(1, "Time is required"),
  venue: z.string().trim().min(2, "Venue is required"),
  category: z.enum(EVENT_CATEGORIES, {
    errorMap: () => ({ message: "Select a valid category" }),
  }),
  imageUrl: z.string().trim().url("Upload a banner image first"),
  registrationLink: z
    .string()
    .trim()
    .url("Enter a valid URL (including https://)"),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
