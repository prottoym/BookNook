"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Borrow } from "@/lib/books";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function BookThumb({ src, title }: { src: string; title: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={title} className="h-20 w-16 shrink-0 rounded-md object-cover shadow" />
  ) : (
    <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-md bg-[#e0dcc8] text-xs text-[#7a786a]">
      No image
    </div>
  );
}

function ReturnButton({
  busy,
  disabled,
  onClick,
}: {
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md bg-[#0b6bcb] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0958a8] disabled:opacity-60"
    >
      {busy ? "Returning..." : "Return Book"}
    </button>
  );
}

function Overdue({ returnDate, now }: { returnDate: string; now: number }) {
  if (new Date(returnDate).getTime() >= now) return null;
  return (
    <span className="ml-2 rounded bg-[#b3261e] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
      Overdue
    </span>
  );
}

export default function MyBorrows() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const email = user?.email;

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [returningId, setReturningId] = useState<string | null>(null);
  const [now] = useState(() => Date.now()); // used to flag overdue books

  // load the borrows of the logged in user (the server reads who it is from the JWT)
  useEffect(() => {
    if (!email) return;
    let ignore = false;

    apiFetch("/borrows")
      .then((data: Borrow[]) => {
        if (!ignore) setBorrows(data);
      })
      .catch((error) => {
        console.error("Failed to load your borrows:", error);
        if (!ignore) setFailed(true);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [email]);

  async function handleReturn(borrow: Borrow) {
    setReturningId(borrow._id);
    try {
      await apiFetch(`/borrows/${borrow._id}`, { method: "DELETE" });
      setBorrows((current) => current.filter((b) => b._id !== borrow._id));
      toast.success(`"${borrow.bookTitle}" returned. Thank you!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not return the book.");
    } finally {
      setReturningId(null);
    }
  }

  let content;
  if (isPending || (user && loading)) {
    content = <Spinner label="Loading your borrows..." />;
  } else if (!user) {
    content = (
      <p className="rounded-lg border border-dashed border-[#cfcab0] bg-white py-12 text-center text-[#7a786a]">
        Please{" "}
        <Link href="/login?redirect=/my-borrows" className="font-semibold text-[#0b6bcb] hover:underline">
          log in
        </Link>{" "}
        to see your borrowed books.
      </p>
    );
  } else if (failed) {
    content = (
      <p className="rounded-lg border border-dashed border-[#cfcab0] bg-white py-12 text-center text-[#7a786a]">
        We could not load your borrowed books right now. Please try again in a moment.
      </p>
    );
  } else if (borrows.length === 0) {
    content = (
      <div className="rounded-lg border border-dashed border-[#cfcab0] bg-white py-12 text-center text-[#7a786a]">
        <p>You have not borrowed any books.</p>
        <Link href="/books" className="mt-3 inline-block font-semibold text-[#0b6bcb] hover:underline">
          Browse books
        </Link>
      </div>
    );
  } else {
    content = (
      <>
        {/* Table on tablets and desktops */}
        <div className="hidden overflow-hidden rounded-xl border border-[#e3dfca] bg-white shadow-sm md:block">
          <table className="w-full text-left">
            <thead className="bg-[#e0dcc8] text-sm text-[#3b3a2f]">
              <tr>
                <th className="px-5 py-3 font-semibold">Image</th>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Borrow Date</th>
                <th className="px-5 py-3 font-semibold">Return Date</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee9d6]">
              {borrows.map((b) => (
                <tr key={b._id} className="align-middle">
                  <td className="px-5 py-4">
                    <BookThumb src={b.bookImage} title={b.bookTitle} />
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/books/${b.bookId}`}
                      className="font-serif text-lg font-bold text-[#3b3a2f] hover:text-[#0b6bcb]"
                    >
                      {b.bookTitle}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-[#4a493c]">{formatDate(b.borrowDate)}</td>
                  <td className="px-5 py-4 text-[#4a493c]">
                    {formatDate(b.returnDate)}
                    <Overdue returnDate={b.returnDate} now={now} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ReturnButton
                      busy={returningId === b._id}
                      disabled={returningId !== null}
                      onClick={() => handleReturn(b)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards on phones */}
        <div className="space-y-4 md:hidden">
          {borrows.map((b) => (
            <article key={b._id} className="rounded-xl border border-[#e3dfca] bg-white p-4 shadow-sm">
              <div className="flex gap-4">
                <BookThumb src={b.bookImage} title={b.bookTitle} />
                <div className="min-w-0">
                  <Link
                    href={`/books/${b.bookId}`}
                    className="line-clamp-2 font-serif text-lg font-bold text-[#3b3a2f]"
                  >
                    {b.bookTitle}
                  </Link>
                  <p className="mt-1 text-sm text-[#7a786a]">Borrowed: {formatDate(b.borrowDate)}</p>
                  <p className="text-sm text-[#7a786a]">
                    Return by: {formatDate(b.returnDate)}
                    <Overdue returnDate={b.returnDate} now={now} />
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <ReturnButton
                  busy={returningId === b._id}
                  disabled={returningId !== null}
                  onClick={() => handleReturn(b)}
                />
              </div>
            </article>
          ))}
        </div>
      </>
    );
  }

  return (
    <section className="bg-[#f6f3e6] py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2f7fc1]">
            On loan to you
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#3b3a2f] sm:text-4xl">My Borrows</h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded bg-[#2f7fc1]" />
        </div>

        {content}
      </div>
    </section>
  );
}