import Link from "next/link";
import type { Book } from "@/lib/books";

// Every card has the same height and the same image size, so the grid stays even
export default function BookCard({ book }: { book: Book }) {
  const notAvailable = book.availableCopies <= 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e3dfca] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-64 w-full overflow-hidden bg-[#e0dcc8]">
        {book.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#3b3a2f] p-6 text-center font-serif text-lg text-[#e8e4d0]">
            {book.title}
          </div>
        )}

        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#3b3a2f] shadow">
          {book.category}
        </span>

        {notAvailable && (
          <span className="absolute left-3 top-3 rounded bg-[#8b3a3a] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow">
            Not Available
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 font-serif text-xl font-bold text-[#3b3a2f]">{book.title}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-[#7a786a]">
          by <span className="font-medium text-[#4a493c]">{book.author}</span>
        </p>

        <div className="mt-auto pt-5">
          <Link
            href={`/books/${book._id}`}
            className="block rounded-md bg-[#0b6bcb] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0958a8]"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}