"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, LayoutDashboard } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper-100 dark:bg-ink-950">
      <header className="sticky top-0 z-40 border-b-2 border-ink-900 bg-paper-100/95 backdrop-blur-md dark:border-paper-100 dark:bg-ink-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center border-2 border-ink-900 bg-brand-600 text-paper-50 dark:border-paper-100">
              <LayoutDashboard size={16} />
            </span>
            <span className="font-display text-xl font-bold uppercase tracking-tight text-ink-900 dark:text-paper-50">
              Admin Dashboard
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/events" className="hidden text-sm font-semibold uppercase tracking-wide text-ink-500 transition hover:text-brand-600 dark:text-ink-300 dark:hover:text-brand-400 sm:block">
              View public site
            </Link>
            <ThemeToggle />
            <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="flex items-center gap-1.5 border-2 border-ink-900 px-3 py-1.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-900 hover:text-paper-50 dark:border-paper-200 dark:text-paper-100 dark:hover:bg-paper-100 dark:hover:text-ink-900">
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}