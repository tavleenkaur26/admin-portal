import mongoose, { Schema, model, models } from "mongoose";
import { EVENT_CATEGORIES, type EventCategory } from "@/lib/constants";

export { EVENT_CATEGORIES };
export type { EventCategory };

export interface IEvent {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  category: EventCategory;
  imageUrl: string;
  registrationLink: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    // Stored as a Date (date-only, time held separately in `time`) so we can
    // reliably query/sort "upcoming vs past" and group events by day.
    date: {
      type: Date,
      required: [true, "Date is required"],
      index: true,
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: EVENT_CATEGORIES,
      required: [true, "Category is required"],
      index: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Banner image is required"],
    },
    registrationLink: {
      type: String,
      required: [true, "Registration link is required"],
    },
  },
  { timestamps: true }
);

// Compound text index to support the public-page search bonus feature
EventSchema.index({ title: "text", description: "text", venue: "text" });

export default models.Event || model<IEvent>("Event", EventSchema);
