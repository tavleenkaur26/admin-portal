"use client";

import { useRef, useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ImagePlus, Loader2, X } from "lucide-react";
import { eventFormSchema, type EventFormValues } from "@/lib/validations";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { EVENT_CATEGORIES } from "@/lib/constants";
import type { EventDTO } from "@/types";

interface Props {
  mode: "create" | "edit";
  initialData?: EventDTO;
}

const emptyForm: EventFormValues = {
  title: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  category: "Workshop",
  imageUrl: "",
  registrationLink: "",
};

export default function EventForm({ mode, initialData }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<EventFormValues>(
    initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          date: initialData.date.slice(0, 10),
          time: initialData.time,
          venue: initialData.venue,
          category: initialData.category,
          imageUrl: initialData.imageUrl,
          registrationLink: initialData.registrationLink,
        }
      : emptyForm
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof EventFormValues>(
    key: K,
    value: EventFormValues[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      updateField("imageUrl", url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const parsed = eventFormSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitting(true);
    try {
      const url =
        mode === "create"
          ? "/api/events"
          : `/api/events/${initialData!._id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong");
      }

      toast.success(mode === "create" ? "Event created" : "Event updated");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-brand-900";
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";
  const errorClass = "mt-1 text-xs text-rose-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Image upload */}
      <div>
        <label className={labelClass}>Banner Image</label>
        {form.imageUrl ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <Image src={form.imageUrl} alt="Banner preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => updateField("imageUrl", "")}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white transition hover:bg-slate-900"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-brand-400 hover:text-brand-500 disabled:opacity-60 dark:border-slate-700"
          >
            {uploading ? (
              <>
                <Loader2 size={22} className="animate-spin" />
                <span className="text-sm">Uploading...</span>
              </>
            ) : (
              <>
                <ImagePlus size={22} />
                <span className="text-sm">Click to upload banner image</span>
                <span className="text-xs text-slate-400">PNG, JPG up to 5MB</span>
              </>
            )}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {errors.imageUrl && <p className={errorClass}>{errors.imageUrl}</p>}
      </div>

      <div>
        <label className={labelClass}>Event Title</label>
        <input
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="e.g. Intro to Machine Learning Workshop"
          className={inputClass}
        />
        {errors.title && <p className={errorClass}>{errors.title}</p>}
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={5}
          placeholder="What's this event about?"
          className={inputClass}
        />
        {errors.description && <p className={errorClass}>{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
            className={inputClass}
          />
          {errors.date && <p className={errorClass}>{errors.date}</p>}
        </div>
        <div>
          <label className={labelClass}>Time</label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => updateField("time", e.target.value)}
            className={inputClass}
          />
          {errors.time && <p className={errorClass}>{errors.time}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Venue</label>
          <input
            value={form.venue}
            onChange={(e) => updateField("venue", e.target.value)}
            placeholder="e.g. Auditorium, Block C"
            className={inputClass}
          />
          {errors.venue && <p className={errorClass}>{errors.venue}</p>}
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select
            value={form.category}
            onChange={(e) =>
              updateField("category", e.target.value as EventFormValues["category"])
            }
            className={inputClass}
          >
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <p className={errorClass}>{errors.category}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Registration Link</label>
        <input
          value={form.registrationLink}
          onChange={(e) => updateField("registrationLink", e.target.value)}
          placeholder="https://forms.gle/..."
          className={inputClass}
        />
        {errors.registrationLink && (
          <p className={errorClass}>{errors.registrationLink}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting
            ? "Saving..."
            : mode === "create"
            ? "Create Event"
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
