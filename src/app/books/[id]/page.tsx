import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { notFound } from "next/navigation";
import BorrowButton from "@/components/BorrowButton";
import Spinner from "@/components/Spinner";
import type { Book } from "@/lib/books";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = { params: Promise<{ id: string }> };

// Returns the book, null when it does not exist, or throws when the server is down
async function getBook(id: string): Promise<Book | null> {
  const res = await fetch(`${API_URL}/books/${id}`, { cache: "no-store" });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Server responded with ${res.status}`);
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const book = await getBook(id);
    return { title: book ? book.title : "Book Not Found" };
  } catch {
    return { title: "Book Details" };
  }
}

// The book itself. It reads the URL and the server, so it sits inside <Suspense>
// and a spinner shows while it loads.
async function BookDetails({ params }: Props) {
  const { id } = await params;

  let book: Book | null = null;
  try {
    book = await getBook(id);
  } catch (error) {
    if ((error as { digest?: string })?.digest === "HANGING_PROMISE_REJECTION") throw error; // not a real failure, let Next.js handle it
    console.error("Failed to load the book:", error);
    return (
      <section className="bg-[#f6f3e6] px-4 py-24 text-center">
        <p className="mx-auto max-w-md rounded-lg border border-dashed border-[#cfcab0] bg-white px-6 py-12 text-[#7a786a]">
          We could not load this book right now. Please try again in a moment.
        </p>
      </section>
    );
  }

  if (!book) notFound();

  const addedOn = new Date(book.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="bg-[#f6f3e6] py-12">
      <div className="mx-auto max-w-6xl px-4">
        <Link href="/books" className="text-sm font-medium text-[#0b6bcb] hover:underline">
          ← Back to all books
        </Link>

        <Reveal className="mt-6 grid gap-10 overflow-hidden rounded-xl border border-[#e3dfca] bg-white p-6 shadow-sm md:grid-cols-[360px_1fr] md:p-10">
          {/* Cover */}
          <div className="mx-auto w-full max-w-sm md:mx-0">
            <div className="overflow-hidden rounded-lg bg-[#e0dcc8] shadow-[8px_10px_20px_rgba(59,58,47,0.3)]">
              {book.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={book.image} alt={book.title} className="h-[480px] w-full object-cover" />
              ) : (
                <div className="flex h-[480px] items-center justify-center bg-[#3b3a2f] p-8 text-center font-serif text-2xl text-[#e8e4d0]">
                  {book.title}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <span className="w-fit rounded-full bg-[#e0dcc8] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#3b3a2f]">
              {book.category}
            </span>

            <h1 className="mt-4 font-serif text-3xl font-bold text-[#3b3a2f] sm:text-4xl">{book.title}</h1>
            <p className="mt-2 text-lg text-[#7a786a]">
              by <span className="font-medium text-[#4a493c]">{book.author}</span>
            </p>

            <div className="my-6 h-1 w-16 rounded bg-[#2f7fc1]" />

            <h2 className="font-serif text-xl font-bold text-[#3b3a2f]">About this book</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-[#4a493c]">{book.description}</p>

            <dl className="mt-8 grid gap-4 rounded-lg bg-[#faf8f0] p-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-[#7a786a]">Added by</dt>
                <dd className="mt-1 font-semibold text-[#3b3a2f]">{book.userName}</dd>
                <dd className="truncate text-xs text-[#7a786a]">{book.userEmail}</dd>
              </div>
              <div>
                <dt className="text-[#7a786a]">Added on</dt>
                <dd className="mt-1 font-semibold text-[#3b3a2f]">{addedOn}</dd>
              </div>
              <div>
                <dt className="text-[#7a786a]">Copies available</dt>
                <dd className="mt-1 font-semibold text-[#3b3a2f]">
                  {book.availableCopies} of {book.totalCopies}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <BorrowButton
                bookId={book._id}
                bookTitle={book.title}
                availableCopies={book.availableCopies}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function BookDetailsPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="bg-[#f6f3e6]">
          <Spinner label="Loading book..." />
        </div>
      }
    >
      <BookDetails params={params} />
    </Suspense>
  );
}
