import type { Metadata } from "next";
import Link from "next/link";
import BookCard from "@/components/BookCard";
import { CATEGORIES, type Book } from "@/lib/books";

export const metadata: Metadata = { title: "All Books" };

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getBooks(search: string, category: string) {
  try {
    const query = new URLSearchParams({ sort: "newest" });
    if (search) query.set("search", search);
    if (category) query.set("category", category);

    const res = await fetch(`${API_URL}/books?${query.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);

    const books: Book[] = await res.json();
    return { books, failed: false };
  } catch (error) {
    console.error("Failed to load books:", error);
    return { books: [] as Book[], failed: true };
  }
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search = "", category = "" } = await searchParams;
  const { books, failed } = await getBooks(search.trim(), category);
  const filtering = Boolean(search.trim() || category);

  return (
    <section className="bg-[#f6f3e6] py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading (same style as the other sections) */}
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2f7fc1]">
            The whole library
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#3b3a2f] sm:text-4xl">All Books</h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded bg-[#2f7fc1]" />
        </div>

        {/* Search + category filter. A plain GET form, so it works without JavaScript */}
        <form action="/books" method="get" className="mx-auto mb-10 flex max-w-3xl flex-col gap-3 sm:flex-row">
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search by book title"
            aria-label="Search by book title"
            className="flex-1 rounded-md border border-[#cfcab0] bg-white px-4 py-3 text-[15px] text-[#3b3a2f] outline-none focus:border-[#2f7fc1] focus:ring-2 focus:ring-[#2f7fc1]/20"
          />
          <select
            name="category"
            defaultValue={category}
            aria-label="Filter by category"
            className="rounded-md border border-[#cfcab0] bg-white px-4 py-3 text-[15px] text-[#3b3a2f] outline-none focus:border-[#2f7fc1]"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md bg-[#0b6bcb] px-7 py-3 text-[15px] font-semibold text-white transition hover:bg-[#0958a8]"
          >
            Search
          </button>
        </form>

        {failed ? (
          <p className="rounded-lg border border-dashed border-[#cfcab0] bg-white py-12 text-center text-[#7a786a]">
            We could not load the books right now. Please try again in a moment.
          </p>
        ) : books.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#cfcab0] bg-white py-12 text-center text-[#7a786a]">
            <p>{filtering ? "No books match your search." : "No books yet. Be the first to add one!"}</p>
            {filtering && (
              <Link href="/books" className="mt-3 inline-block font-semibold text-[#0b6bcb] hover:underline">
                Show all books
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-[#7a786a]">
              Showing {books.length} {books.length === 1 ? "book" : "books"}
            </p>
            {/* 3 cards per row on desktop */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}