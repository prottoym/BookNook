"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { API_URL, apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

type Stats = { added: number | null; borrowed: number | null };

const quickLinks = [
  { href: "/add-book", label: "Add a Book", text: "Share a book with the community" },
  { href: "/my-books", label: "My Books", text: "Edit or remove the books you added" },
  { href: "/my-borrows", label: "My Borrows", text: "See and return the books you borrowed" },
];

export default function Profile() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const email = user?.email;

  const [stats, setStats] = useState<Stats>({ added: null, borrowed: null });

  // two small numbers for the profile: books added and books borrowed
  useEffect(() => {
    if (!email) return;
    let ignore = false;

    fetch(`${API_URL}/books?email=${encodeURIComponent(email)}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json() as Promise<unknown[]>;
      })
      .then((books) => {
        if (!ignore) setStats((s) => ({ ...s, added: books.length }));
      })
      .catch((error) => console.error("Could not count your books:", error));

    apiFetch("/borrows")
      .then((borrows: unknown[]) => {
        if (!ignore) setStats((s) => ({ ...s, borrowed: borrows.length }));
      })
      .catch((error) => console.error("Could not count your borrows:", error));

    return () => {
      ignore = true;
    };
  }, [email]);

  if (isPending) {
    return (
      <section className="bg-[#f6f3e6]">
        <Spinner label="Loading your profile..." />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="bg-[#f6f3e6] px-4 py-24 text-center">
        <p className="mx-auto max-w-md rounded-lg border border-dashed border-[#cfcab0] bg-white px-6 py-12 text-[#7a786a]">
          Please{" "}
          <Link href="/login?redirect=/profile" className="font-semibold text-[#0b6bcb] hover:underline">
            log in
          </Link>{" "}
          to see your profile.
        </p>
      </section>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : null;

  return (
    <section className="bg-[#f6f3e6] px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-xl border border-[#e3dfca] bg-white shadow-sm">
          {/* banner made of book spines */}
          <div className="flex h-28">
            {["#2f7fc1", "#c9a227", "#8b3a3a", "#4f7a5a", "#6b4f8a", "#b5651d", "#2f7fc1", "#c9a227"].map(
              (color, i) => (
                <span key={i} className="flex-1" style={{ backgroundColor: color }} />
              )
            )}
          </div>

          <div className="px-6 pb-10 sm:px-10">
            {/* avatar overlapping the banner */}
            <div className="-mt-14 flex justify-center">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#2f7fc1] font-serif text-4xl font-bold text-white shadow-lg">
                  {user.name?.charAt(0).toUpperCase() || "B"}
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <h1 className="font-serif text-3xl font-bold text-[#3b3a2f]">{user.name}</h1>
              <p className="mt-1 text-[#7a786a]">{user.email}</p>
              {memberSince && (
                <p className="mt-2 text-sm text-[#7a786a]">Member since {memberSince}</p>
              )}
            </div>

            {/* stats */}
            <dl className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-[#faf8f0] p-5 text-center">
                <dd className="font-serif text-3xl font-bold text-[#2f7fc1]">{stats.added ?? "-"}</dd>
                <dt className="mt-1 text-sm text-[#7a786a]">Books added</dt>
              </div>
              <div className="rounded-lg bg-[#faf8f0] p-5 text-center">
                <dd className="font-serif text-3xl font-bold text-[#2f7fc1]">{stats.borrowed ?? "-"}</dd>
                <dt className="mt-1 text-sm text-[#7a786a]">Books borrowed now</dt>
              </div>
            </dl>

            {/* quick links */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {quickLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex flex-col rounded-lg border border-[#e3dfca] p-4 transition hover:-translate-y-0.5 hover:border-[#2f7fc1] hover:shadow"
                >
                  <span className="font-semibold text-[#0b6bcb]">{l.label}</span>
                  <span className="mt-1 text-sm text-[#7a786a]">{l.text}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}