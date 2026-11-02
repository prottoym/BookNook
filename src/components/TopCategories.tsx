import Link from "next/link";
import Reveal from "@/components/Reveal";

const categories = [
  {
    name: "Fiction",
    icon: "📖",
    text: "Novels, short stories and tales that carry you away.",
    color: "#2f7fc1",
  },
  {
    name: "Science",
    icon: "🔬",
    text: "Discoveries, ideas and the curious workings of the world.",
    color: "#4f7a5a",
  },
  {
    name: "History",
    icon: "🏛️",
    text: "Stories of the people and the events that shaped us.",
    color: "#b5651d",
  },
  {
    name: "Kids",
    icon: "🧸",
    text: "Picture books and adventures for the youngest readers.",
    color: "#c9a227",
  },
  {
    name: "Others",
    icon: "✨",
    text: "Poetry, biographies, hobbies and everything in between.",
    color: "#6b4f8a",
  },
];

export default function TopCategories() {
  return (
    <section className="bg-[#f6f3e6] py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading (same style as the other sections) */}
        <Reveal className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2f7fc1]">
            Find your shelf
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-[#3b3a2f] sm:text-4xl">Top Categories</h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded bg-[#2f7fc1]" />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c, i) => (
            <Reveal key={c.name} className="h-full" delay={i * 0.08}>
            <Link
              href={`/books?category=${encodeURIComponent(c.name)}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e3dfca] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* coloured spine on top of every card */}
              <span className="h-2 w-full" style={{ backgroundColor: c.color }} />

              <div className="flex flex-1 flex-col items-center p-6 text-center">
                <span
                  aria-hidden
                  className="flex h-16 w-16 items-center justify-center rounded-full text-3xl transition group-hover:scale-110"
                  style={{ backgroundColor: `${c.color}1f` }}
                >
                  {c.icon}
                </span>
                <h3 className="mt-4 font-serif text-xl font-bold text-[#3b3a2f]">{c.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#7a786a]">{c.text}</p>

                <span
                  className="mt-auto pt-5 text-sm font-semibold transition group-hover:underline"
                  style={{ color: c.color }}
                >
                  Browse {c.name} →
                </span>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}