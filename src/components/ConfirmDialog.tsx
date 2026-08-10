"use client";

import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 px-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm border-2 border-ink-900 bg-paper-50 p-6 dark:border-paper-200 dark:bg-ink-900">
        <div className="mb-4 flex h-11 w-11 items-center justify-center border-2 border-ink-900 bg-brand-600 text-paper-50 dark:border-paper-200">
          <AlertTriangle size={20} />
        </div>
        <h3 className="font-display text-lg font-bold text-ink-900 dark:text-paper-50">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">
          {description}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border-2 border-ink-900 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-100 dark:border-paper-200 dark:text-paper-100 dark:hover:bg-ink-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 border-2 border-ink-900 bg-brand-600 py-2.5 text-sm font-bold uppercase tracking-wide text-paper-50 transition hover:bg-brand-700 disabled:opacity-60 dark:border-paper-200"
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}