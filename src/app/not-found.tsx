import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page Not Found" };

const spines = ["#2f7fc1", "#c9a227", "#8b3a3a", "#4f7a5a", "#6b4f8a"];

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="max-w-lg text-center">
        <div className="mb-6 flex items-end justify-center gap-1.5" aria-hidden>
          {spines.map((c, i) => (
            <span
              key={c}
              className="w-6 rounded-t-sm shadow"
              style={{
                backgroundColor: c,
                height: 70 + (i % 3) * 18,
                transform: i === 3 ? "rotate(14deg)" : undefined,
                transformOrigin: "bottom right",
              }}
            />
          ))}
        </div>

        <p className="font-serif text-7xl font-bold text-[#2f7fc1]">404</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[#3b3a2f]">
          This page is missing from our shelves
        </h1>
        <p className="mt-3 text-[#7a786a]">
          The page you are looking for may have been moved, returned or never existed.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#0b6bcb] px-7 py-3 font-semibold text-white shadow transition hover:bg-[#0958a8]"
        >
          <span aria-hidden>←</span> Back to Home
        </Link>
      </div>
    </section>
  );
}