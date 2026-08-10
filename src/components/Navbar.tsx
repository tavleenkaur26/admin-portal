import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink-900 bg-paper-100/95 backdrop-blur-md dark:border-paper-100 dark:bg-ink-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/events" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center border-2 border-ink-900 bg-brand-600 font-display text-base font-bold text-paper-50 dark:border-paper-100">
            M
          </span>
          <span className="font-display text-xl font-bold uppercase tracking-tight text-ink-900 dark:text-paper-50">
            MSC IGDTUW
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/login"
            className="hidden text-sm font-semibold uppercase tracking-wide text-ink-500 transition hover:text-brand-600 dark:text-ink-300 dark:hover:text-brand-400 sm:block"
          >
            Admin &rarr;
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}