import Link from "next/link";
import Reveal from "@/components/Reveal";
import { connection } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
};

async function getLatestBooks(): Promise<Book[]> {
  try {
    // The Express server runs sort({ createdAt: -1 }).limit(6) on MongoDB
    const res = await fetch(`${API_URL}/books?sort=newest&limit=6`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    const docs: Partial<Book>[] = await res.json();

    return docs.map((d) => ({
      _id: String(d._id),
      title: d.title ?? "Untitled",
      author: d.author ?? "Unknown author",
      category: d.category ?? "General",
      image: d.image ?? "",
    }));
  } catch (error) {
    console.error("Failed to load new arrivals:", error);
    return [];
  }
}

export default async function NewArrivals() {
  // The latest books change all the time, so load them on every visit
  await connection();
  const books = await getLatestBooks();

  return (
    <section className="bg-[#f6f3e6] py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading */}
        <Reveal className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2f7fc1]">
            Fresh on the shelf
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-[#3b3a2f] sm:text-4xl">
            New Arrivals
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded bg-[#2f7fc1]" />
        </Reveal>

        {books.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[#cfcab0] bg-white py-12 text-center text-[#7a786a]">
            No books yet. Be the first to add one!
          </p>
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book, i) => (
              <Reveal key={book._id} delay={(i % 3) * 0.1}>
              <article className="group">
                {/* Cover sitting on a shelf */}
                <div className="relative">
                  <div className="flex h-72 items-end justify-center rounded-t-lg bg-[#e0dcc8] px-6 pt-6">
                    {book.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={book.image}
                        alt={book.title}
                        className="h-full w-48 max-w-full rounded-sm object-cover shadow-[6px_8px_16px_rgba(59,58,47,0.35)] transition duration-300 group-hover:-translate-y-2 group-hover:rotate-[-1.5deg]"
                      />
                    ) : (
                      <div className="flex h-full w-48 items-center justify-center rounded-sm bg-[#3b3a2f] p-4 text-center font-serif text-[#e8e4d0] shadow-lg">
                        {book.title}
                      </div>
                    )}
                  </div>
                  {/* shelf ledge */}
                  <div className="h-3 rounded-b-sm bg-[#8a6a43] shadow-md" />

                  {i < 2 && (
                    <span className="absolute left-3 top-3 rounded bg-[#c9a227] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow">
                      New
                    </span>
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#3b3a2f] shadow">
                    {book.category}
                  </span>
                </div>

                {/* Info */}
                <div className="mt-5 text-center">
                  <h3 className="line-clamp-1 font-serif text-xl font-bold text-[#3b3a2f]">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#7a786a]">
                    by <span className="font-medium text-[#4a493c]">{book.author}</span>
                  </p>
                  <Link
                    href={`/books/${book._id}`}
                    className="mt-4 inline-block rounded-md border-2 border-[#0b6bcb] px-6 py-2 text-sm font-semibold text-[#0b6bcb] transition hover:bg-[#0b6bcb] hover:text-white"
                  >
                    View Details
                  </Link>
                </div>
              </article>
              </Reveal>
            ))}
          </div>
        )}

        {/* See all */}
        <div className="mt-14 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-md bg-[#0b6bcb] px-8 py-3 font-semibold text-white shadow transition hover:bg-[#0958a8]"
          >
            See All Books <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}