"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/redirect";
import AuthShell from "@/components/AuthShell";
import GoogleButton from "@/components/GoogleButton";

const inputClass =
  "w-full rounded-md border border-[#cfcab0] bg-white px-4 py-3 text-[15px] text-[#3b3a2f] outline-none transition focus:border-[#2f7fc1] focus:ring-2 focus:ring-[#2f7fc1]/20";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectParam = params.get("redirect");
  const redirectTo = safeRedirect(redirectParam);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    setFormError("");
    setLoading(true);

    const { error } = await authClient.signIn.email({ email, password });

    if (error) {
      const message = error.message || "Login failed. Please check your email and password.";
      setFormError(message);
      toast.error(message);
      setLoading(false);
      return;
    }

    toast.success("Welcome back to BookNook!");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <AuthShell title="Log in to BookNook" subtitle="Welcome back! Pick up where you left off.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {formError && (
          <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </p>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#3b3a2f]">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[#3b3a2f]">
              Password
            </label>
            <button
              type="button"
              onClick={() => toast("Password reset is not available yet.", { icon: "ℹ️" })}
              className="text-sm text-[#0b6bcb] hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="Your password" className={inputClass} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[#0b6bcb] px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-[#0958a8] disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-[#9a977f]">
        <span className="h-px flex-1 bg-[#e3dfca]" />
        or
        <span className="h-px flex-1 bg-[#e3dfca]" />
      </div>

      <GoogleButton callbackURL={redirectTo} />

      <p className="mt-7 text-center text-sm text-[#7a786a]">
        New to BookNook?{" "}
        <Link
          href={redirectParam ? `/register?redirect=${encodeURIComponent(redirectTo)}` : "/register"}
          className="font-semibold text-[#0b6bcb] hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}