"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

// yyyy-mm-dd in the user's own time zone (what <input type="date"> wants)
function toInputDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function inDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export default function BorrowButton({
  bookId,
  bookTitle,
  availableCopies,
}: {
  bookId: string;
  bookTitle: string;
  availableCopies: number;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [returnDate, setReturnDate] = useState(() => toInputDate(inDays(7)));

  // close the modal with the Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (availableCopies <= 0) {
    return (
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-md bg-[#cfcab0] px-6 py-3 text-base font-semibold text-[#6b6a58] sm:w-auto"
      >
        Not Available
      </button>
    );
  }

  function handleOpen() {
    if (isPending) return;
    if (!user) {
      toast.error("Please log in to borrow a book.");
      router.push(`/login?redirect=${encodeURIComponent(`/books/${bookId}`)}`);
      return;
    }
    setOpen(true);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/borrows", {
        method: "POST",
        body: JSON.stringify({ bookId, returnDate }),
      });
      toast.success(`You borrowed "${bookTitle}". Happy reading!`);
      setOpen(false);
      router.push("/my-borrows");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not borrow this book.");
      router.refresh(); // update the copies count if someone else took the last one
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-[#cfcab0] bg-white px-4 py-3 text-[15px] text-[#3b3a2f] outline-none focus:border-[#2f7fc1] focus:ring-2 focus:ring-[#2f7fc1]/20";

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="w-full rounded-md bg-[#0b6bcb] px-6 py-3 text-base font-semibold text-white shadow transition hover:bg-[#0958a8] sm:w-auto"
      >
        Borrow This Book
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="borrow-title"
            className="w-full max-w-md rounded-xl bg-white p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="borrow-title" className="font-serif text-2xl font-bold text-[#3b3a2f]">
              Borrow this book
            </h2>
            <p className="mt-1 line-clamp-1 text-sm text-[#7a786a]">{bookTitle}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="borrow-name" className="mb-1.5 block text-sm font-medium text-[#3b3a2f]">
                  Your name
                </label>
                <input id="borrow-name" value={user?.name ?? ""} readOnly className={`${inputClass} bg-[#f6f3e6]`} />
              </div>

              <div>
                <label htmlFor="borrow-email" className="mb-1.5 block text-sm font-medium text-[#3b3a2f]">
                  Your email
                </label>
                <input id="borrow-email" value={user?.email ?? ""} readOnly className={`${inputClass} bg-[#f6f3e6]`} />
              </div>

              <div>
                <label htmlFor="borrow-return" className="mb-1.5 block text-sm font-medium text-[#3b3a2f]">
                  Return date
                </label>
                <input
                  id="borrow-return"
                  type="date"
                  required
                  value={returnDate}
                  min={toInputDate(inDays(1))}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-md border border-[#cfcab0] px-4 py-3 text-[15px] font-semibold text-[#3b3a2f] hover:bg-[#f6f3e6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-md bg-[#0b6bcb] px-4 py-3 text-[15px] font-semibold text-white hover:bg-[#0958a8] disabled:opacity-60"
                >
                  {loading ? "Borrowing..." : "Confirm Borrow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}