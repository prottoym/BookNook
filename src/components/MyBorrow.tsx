"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import EditBookModal from "@/components/EditBookModal";
import Spinner from "@/components/Spinner";
import { API_URL, apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Book } from "@/lib/books";

export default function MyBooks() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const email = user?.email;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  // load only the books this user added
  useEffect(() => {
    if (!email) return;
    let ignore = false;

    fetch(`${API_URL}/books?email=${encodeURIComponent(email)}&sort=newest`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json() as Promise<Book[]>;
      })
      .then((data) => {
        if (!ignore) setBooks(data);
      })
      .catch((error) => {
        console.error("Failed to load your books:", error);
        if (!ignore) setFailed(true);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [email]);

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await apiFetch(`/books/${deleting._id}`, { method: "DELETE" });
      setBooks((current) => current.filter((b) => b._id !== deleting._id)); // gone from the screen
      toast.success(`"${deleting.title}" was deleted.`);
      setDeleting(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete the book.");
    } finally {
      setDeleteBusy(false);
    }
  }

  function handleSaved(updated: Book) {
    setBooks((current) => current.map((b) => (b._id === updated._id ? updated : b)));
    setEditing(null);
  }

  let content;
  if (isPending || (user && loading)) {
    content = <Spinner label="Loading your books..." />;
  } else if (!user) {
    content = (
      <p className="rounded-lg border border-dashed border-[#cfcab0] bg-white py-12 text-center text-[#7a786a]">
        Please{" "}
        <Link href="/login?redirect=/my-books" className="font-semibold text-[#0b6bcb] hover:underline">
          log in
        </Link>{" "}
        to see your books.
      </p>
    );
  } else if (failed) {
    content = (
      <p className="rounded-lg border border-dashed border-[#cfcab0] bg-white py-12 text-center text-[#7a786a]">
        We could not load your books right now. Please try again in a moment.
      </p>
    );
  } else if (books.length === 0) {
    content = (
      <div className="rounded-lg border border-dashed border-[#cfcab0] bg-white py-12 text-center text-[#7a786a]">
        <p>You have not added any books yet.</p>
        <Link href="/add-book" className="mt-3 inline-block font-semibold text-[#0b6bcb] hover:underline">
          Add your first book
        </Link>
      </div>
    );
  } else {
    content = (
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <article
            key={book._id}
            className="flex h-full flex-col overflow-hidden rounded-xl border border-[#e3dfca] bg-white shadow-sm"
          >
            <div className="relative h-52 w-full overflow-hidden bg-[#e0dcc8]">
              {book.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#3b3a2f] p-6 text-center font-serif text-lg text-[#e8e4d0]">
                  {book.title}
                </div>
              )}
              <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#3b3a2f] shadow">
                {book.category}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="line-clamp-1 font-serif text-xl font-bold text-[#3b3a2f]">{book.title}</h3>
              <p className="mt-1 line-clamp-1 text-sm text-[#7a786a]">
                by <span className="font-medium text-[#4a493c]">{book.author}</span>
              </p>
              <p className="mt-3 text-sm text-[#7a786a]">
                Copies available:{" "}
                <span className="font-semibold text-[#3b3a2f]">
                  {book.availableCopies} of {book.totalCopies}
                </span>
              </p>

              <div className="mt-auto flex gap-3 pt-5">
                <button
                  type="button"
                  onClick={() => setEditing(book)}
                  className="flex-1 rounded-md border-2 border-[#0b6bcb] px-4 py-2 text-sm font-semibold text-[#0b6bcb] transition hover:bg-[#0b6bcb] hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(book)}
                  className="flex-1 rounded-md border-2 border-[#b3261e] px-4 py-2 text-sm font-semibold text-[#b3261e] transition hover:bg-[#b3261e] hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <section className="bg-[#f6f3e6] py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2f7fc1]">
            Your shelf
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#3b3a2f] sm:text-4xl">My Books</h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded bg-[#2f7fc1]" />
        </div>

        {content}
      </div>

      {editing && <EditBookModal book={editing} onClose={() => setEditing(null)} onSaved={handleSaved} />}

      {deleting && (
        <Modal title="Delete this book?" onClose={() => !deleteBusy && setDeleting(null)}>
          <p className="mt-4 leading-relaxed text-[#4a493c]">
            You are about to delete <strong className="text-[#3b3a2f]">{deleting.title}</strong>. It will be
            removed from the library and this cannot be undone.
          </p>
          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={() => setDeleting(null)}
              disabled={deleteBusy}
              className="flex-1 rounded-md border border-[#cfcab0] px-4 py-3 text-[15px] font-semibold text-[#3b3a2f] hover:bg-[#f6f3e6] disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteBusy}
              className="flex-1 rounded-md bg-[#b3261e] px-4 py-3 text-[15px] font-semibold text-white hover:bg-[#8f1e18] disabled:opacity-60"
            >
              {deleteBusy ? "Deleting..." : "Yes, delete"}
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}