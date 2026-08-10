"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { loginSchema } from "@/lib/validations";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Welcome back!");
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-100 px-4 dark:bg-ink-950">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border-2 border-ink-900 bg-brand-600 text-paper-50 dark:border-paper-200">
            <LockKeyhole size={24} />
          </div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            Restricted Access
          </p>
          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-paper-50">
            Admin Login
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
            MSC IGDTUW Events Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 border-2 border-ink-900 bg-paper-50 p-6 dark:border-paper-200 dark:bg-ink-900">
          <div>
            <label className="mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink-700 dark:text-paper-100">
              Email
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@mscsociety.com" className="w-full border-2 border-ink-900 bg-paper-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-paper-200 dark:bg-ink-800 dark:text-paper-50" />
            {errors.email && <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-400">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink-700 dark:text-paper-100">
              Password
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full border-2 border-ink-900 bg-paper-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-paper-200 dark:bg-ink-800 dark:text-paper-50" />
            {errors.password && <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-400">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 border-2 border-ink-900 bg-brand-600 py-2.5 text-sm font-bold uppercase tracking-wide text-paper-50 transition hover:bg-brand-700 disabled:opacity-60 dark:border-paper-200">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}