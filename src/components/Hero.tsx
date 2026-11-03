"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

// A real book from the database (only what the banner needs)
export type HeroBook = { _id: string; title: string; image: string };

type Book = { color: string; label: string; w: number };

type Slide = {
  eyebrow: string;
  title: string;
  text: string;
  bg: string;
  accent: string;
  lying: Book[];
  standing: { color: string; h: number; rotate?: number }[];
};

const slides: Slide[] = [
  {
    eyebrow: "Welcome to BookNook",
    title: "Find your next great read",
    text: "Explore books shared by real readers in your community and borrow your next favourite story.",
    bg: "#3b3a2f",
    accent: "#6fb1e8",
    lying: [
      { color: "#2f7fc1", label: "Atlas", w: 250 },
      { color: "#c9a227", label: "Stories", w: 220 },
      { color: "#8b3a3a", label: "Poems", w: 240 },
    ],
    standing: [
      { color: "#4f7a5a", h: 110 },
      { color: "#e0dcc8", h: 130 },
      { color: "#b5651d", h: 100, rotate: 14 },
    ],
  },
  {
    eyebrow: "Share your shelf",
    title: "Let your books travel",
    text: "Add the books you have finished and lend them to readers who are looking for exactly that title.",
    bg: "#1f4e79",
    accent: "#f2d675",
    lying: [
      { color: "#e0dcc8", label: "Novel", w: 240 },
      { color: "#b5651d", label: "Memoir", w: 260 },
      { color: "#6b4f8a", label: "Fantasy", w: 225 },
      { color: "#c9a227", label: "Classic", w: 245 },
    ],
    standing: [
      { color: "#8b3a3a", h: 120 },
      { color: "#4f7a5a", h: 105 },
      { color: "#2f7fc1", h: 135, rotate: 12 },
    ],
  },
  {
    eyebrow: "Borrow with ease",
    title: "Borrow, read, return",
    text: "Request a book in one click and keep track of everything you have borrowed from a single place.",
    bg: "#3f5d48",
    accent: "#f5e6a8",
    lying: [
      { color: "#c9a227", label: "Mystery", w: 255 },
      { color: "#8b3a3a", label: "History", w: 230 },
    ],
    standing: [
      { color: "#e0dcc8", h: 125 },
      { color: "#2f7fc1", h: 110 },
      { color: "#6b4f8a", h: 135 },
      { color: "#b5651d", h: 100, rotate: 15 },
    ],
  },
];

// Three real covers fanned out on a shelf
function CoverFan({ books }: { books: HeroBook[] }) {
  const [left, middle, right] = books;
  const spots = [
    { book: left, className: "left-1.5 z-10 -rotate-[7deg]" },
    { book: right, className: "right-1.5 z-10 rotate-[7deg]" },
    { book: middle, className: "left-[80px] z-20" },
  ];

  return (
    <div className="relative mx-auto h-[360px] w-[330px]">
      {/* soft circle */}
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />

      {spots.map(({ book, className }) => (
        <Link
          key={book._id}
          href={`/books/${book._id}`}
          title={book.title}
          className={`absolute top-[30px] h-[250px] w-[170px] origin-bottom overflow-hidden rounded-sm bg-[#e0dcc8] shadow-[6px_10px_18px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-2 ${className}`}
        >
          {book.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center bg-[#3b3a2f] p-4 text-center font-serif text-lg text-[#e8e4d0]">
              {book.title}
            </span>
          )}
        </Link>
      ))}

      {/* the shelf they stand on */}
      <div className="absolute left-1/2 top-[280px] z-30 h-3 w-[310px] -translate-x-1/2 rounded-sm bg-[#8a6a43] shadow-md" />
    </div>
  );
}

function BookArt({ slide }: { slide: Slide }) {
  return (
    <div className="relative mx-auto h-[360px] w-[330px]">
      {/* soft circle */}
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />

      {/* lying stack */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col-reverse items-center">
        {slide.lying.map((b, i) => (
          <div
            key={i}
            className="relative flex h-10 items-center justify-center rounded-sm text-[11px] font-serif tracking-widest text-white/80 shadow-lg"
            style={{
              width: b.w,
              backgroundColor: b.color,
              marginLeft: i % 2 ? 14 : -10,
              borderTop: "3px solid rgba(255,255,255,.25)",
              borderBottom: "3px solid rgba(0,0,0,.25)",
              color: b.color === "#e0dcc8" ? "#3b3a2f" : undefined,
            }}
          >
            {b.label.toUpperCase()}
          </div>
        ))}
      </div>

      {/* standing books on top of the stack */}
      <div
        className="absolute left-1/2 flex -translate-x-1/2 items-end gap-1"
        style={{ bottom: 24 + slide.lying.length * 40 }}
      >
        {slide.standing.map((b, i) => (
          <div
            key={i}
            className="relative w-8 origin-bottom-right rounded-t-sm shadow-lg"
            style={{
              height: b.h,
              backgroundColor: b.color,
              transform: b.rotate ? `rotate(${b.rotate}deg)` : undefined,
              marginLeft: b.rotate ? 6 : 0,
              boxShadow: "inset -4px 0 0 rgba(0,0,0,.18)",
            }}
          >
            <span className="absolute inset-x-0 top-4 h-1 bg-white/40" />
            <span className="absolute inset-x-0 top-7 h-1 bg-white/25" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero({ books = [] }: { books?: HeroBook[] }) {
  // Each slide shows 3 different books. Without 3 books we keep the drawn book stack.
  const coversFor = (slideIndex: number) =>
    books.length >= 3
      ? [0, 1, 2].map((k) => books[(slideIndex * 3 + k) % books.length])
      : null;

  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={900}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        navigation
        className="hero-swiper"
        style={
          {
            "--swiper-navigation-color": "#ffffff",
            "--swiper-navigation-size": "22px",
            "--swiper-pagination-color": "#ffffff",
            "--swiper-pagination-bullet-inactive-color": "#ffffff",
            "--swiper-pagination-bullet-inactive-opacity": "0.4",
          } as React.CSSProperties
        }
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative overflow-hidden"
              style={{ backgroundColor: s.bg }}
            >
              {/* subtle dotted texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,.35) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />

              <div className="relative mx-auto grid min-h-[540px] max-w-6xl items-center gap-8 px-6 pb-16 pt-12 md:grid-cols-2 md:px-12">
                <div className="text-white">
                  <span
                    className="inline-block rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ borderColor: s.accent, color: s.accent }}
                  >
                    {s.eyebrow}
                  </span>
                  <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                    {s.title}
                  </h1>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
                    {s.text}
                  </p>
                  <Link
                    href="/books"
                    className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#0b6bcb] px-7 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[#0958a8]"
                  >
                    Browse Books
                    <span aria-hidden>→</span>
                  </Link>
                </div>

                <div className="hidden md:block">
                  {coversFor(i) ? <CoverFan books={coversFor(i)!} /> : <BookArt slide={s} />}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
