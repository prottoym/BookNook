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

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectParam = params.get("redirect");

  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const rules = [
    { label: "An uppercase letter (A-Z)", ok: /[A-Z]/.test(password) },
    { label: "A lowercase letter (a-z)", ok: /[a-z]/.test(password) },
    { label: "At least 6 characters", ok: password.length >= 6 },
  ];
  const passwordValid = rules.every((r) => r.ok);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setFormError("");

    // Do not register with an invalid password
    if (!passwordValid) {
      const message =
        "Password needs an uppercase letter, a lowercase letter and at least 6 characters.";
      setFormError(message);
      toast.error(message);
      return;
    }

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const image = String(form.get("photo") || "").trim();

    setLoading(true);
    const { error } = await authClient.signUp.email({ name, email, password, image });

    if (error) {
      const message = error.message || "Registration failed. Please try again.";
      setFormError(message);
      toast.error(message);
      setLoading(false);
      return;
    }

    toast.success("Account created! Please log in.");
    router.push(
      redirectParam ? `/login?redirect=${encodeURIComponent(safeRedirect(redirectParam))}` : "/login"
    );
  }

  return (
    <AuthShell title="Join BookNook" subtitle="Create an account to share and borrow books.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {formError && (
          <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </p>
        )}

        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[#3b3a2f]">
            Name
          </label>
          <input id="name" name="name" type="text" required autoComplete="name" placeholder="Your full name" className={inputClass} />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#3b3a2f]">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} />
        </div>

        <div>
          <label htmlFor="photo" className="mb-1.5 block text-sm font-medium text-[#3b3a2f]">
            Photo URL
          </label>
          <input id="photo" name="photo" type="url" required placeholder="https://example.com/my-photo.jpg" className={inputClass} />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#3b3a2f]">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          {(password.length > 0 || submitted) && (
            <ul className="mt-3 space-y-1 text-sm">
              {rules.map((r) => (
                <li key={r.label} className={r.ok ? "text-[#2f7a4a]" : submitted ? "text-red-600" : "text-[#7a786a]"}>
                  {r.ok ? "✓" : "•"} {r.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[#0b6bcb] px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-[#0958a8] disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-[#9a977f]">
        <span className="h-px flex-1 bg-[#e3dfca]" />
        or
        <span className="h-px flex-1 bg-[#e3dfca]" />
      </div>

      <GoogleButton callbackURL="/" label="Sign up with Google" />

      <p className="mt-7 text-center text-sm text-[#7a786a]">
        Already have an account?{" "}
        <Link
          href={redirectParam ? `/login?redirect=${encodeURIComponent(safeRedirect(redirectParam))}` : "/login"}
          className="font-semibold text-[#0b6bcb] hover:underline"
        >
          Login
        </Link>
      </p>
    </AuthShell>
  );
}