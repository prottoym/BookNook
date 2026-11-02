import Link from "next/link";
import Reveal from "@/components/Reveal";

const steps = [
  {
    title: "Join BookNook",
    icon: "🪪",
    text: "Create a free account with your email or Google in less than a minute.",
  },
  {
    title: "Find a book",
    icon: "🔎",
    text: "Search the shelves by title or category and open any book to read about it.",
  },
  {
    title: "Borrow it",
    icon: "📚",
    text: "Pick a return date, confirm, and the book is yours for a few days.",
  },
  {
    title: "Return it",
    icon: "🔄",
    text: "Done reading? Press Return Book and the next reader can enjoy it.",
  },
];

export default function HowItWork() {
  return (
    <section className="bg-[#e0dcc8] py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading (same style as the other sections) */}
        <Reveal className="mb-14 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2f7fc1]">
            Simple as 1, 2, 3, 4
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-[#3b3a2f] sm:text-4xl">
            How Borrowing Works
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded bg-[#2f7fc1]" />
        </Reveal>

        <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* dashed line that links the steps on desktop */}
          <span
            aria-hidden
            className="absolute left-[12%] right-[12%] top-6 hidden border-t-2 border-dashed border-[#a9a58a] lg:block"
          />

          {steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 0.1}
              className="relative flex h-full flex-col items-center rounded-xl border border-[#cfcab0] bg-[#f6f3e6] px-6 pb-8 pt-10 text-center shadow-sm"
            >
              <span className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#e0dcc8] bg-[#2f7fc1] font-serif text-xl font-bold text-white shadow">
                {i + 1}
              </span>
              <span aria-hidden className="text-4xl">
                {step.icon}
              </span>
              <h3 className="mt-4 font-serif text-xl font-bold text-[#3b3a2f]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6b6a58]">{step.text}</p>
            </Reveal>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-md bg-[#0b6bcb] px-8 py-3 font-semibold text-white shadow transition hover:bg-[#0958a8]"
          >
            Start Browsing <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}