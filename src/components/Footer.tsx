
import Link from "next/link";
import CurrentYear from "@/components/CurrentYear";

const spines = [
  { h: 44, c: "#2f7fc1" },
  { h: 58, c: "#c9a227" },
  { h: 38, c: "#8b3a3a" },
  { h: 52, c: "#4f7a5a" },
  { h: 46, c: "#e0dcc8" },
  { h: 60, c: "#2f7fc1" },
  { h: 40, c: "#b5651d" },
  { h: 54, c: "#6b4f8a" },
  { h: 36, c: "#c9a227" },
  { h: 50, c: "#4f7a5a" },
  { h: 62, c: "#8b3a3a" },
  { h: 42, c: "#e0dcc8" },
  { h: 56, c: "#2f7fc1" },
  { h: 48, c: "#b5651d" },
  { h: 38, c: "#6b4f8a" },
  { h: 58, c: "#c9a227" },
  { h: 44, c: "#4f7a5a" },
  { h: 52, c: "#8b3a3a" },
  { h: 40, c: "#2f7fc1" },
  { h: 60, c: "#e0dcc8" },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/prottoym",
    filled: true,
    icon: (
      <path d="M12 .297a12 12 0 0 0-3.793 23.388c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.301 1.23a11.5 11.5 0 0 1 6.01 0c2.291-1.553 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.234 1.91 1.234 3.221 0 4.61-2.807 5.625-5.479 5.921.43.372.814 1.102.814 2.222v3.293c0 .319.216.694.825.576A12 12 0 0 0 12 .297z" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/prottoy-modak",
    filled: true,
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM6.814 20.452H3.861V9h2.953v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#3b3a2f] text-[#e8e4d0]">
      {/* Bookshelf strip */}
      <div className="bg-[#e0dcc8]">
        <div className="mx-auto flex max-w-6xl items-end gap-1 overflow-hidden px-4 pt-4">
          {spines.map((s, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: s.h,
                backgroundColor: s.c,
                minWidth: 10,
              }}
            />
          ))}
        </div>
        <div className="h-2 bg-[#2a291f]" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 -rotate-6 items-center justify-center rounded-md bg-[#2f7fc1] text-lg font-bold text-white">
              B
            </span>
            <span className="font-serif text-2xl tracking-wide">
              Book<span className="font-bold text-[#6fb1e8]">Nook</span>
            </span>
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#cfcab0]">
            A cozy corner to share your shelf, borrow great reads and meet
            fellow book lovers.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-serif text-lg text-white">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[#cfcab0] transition hover:pl-1 hover:text-white"
                >
                  → {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-serif text-lg text-white">Contact</h3>

          <ul className="mt-4 space-y-3 text-sm text-[#cfcab0]">
            <li>
              ✉️{" "}
              <a
                href="mailto:prottoymodakprottoy@booknook.com"
                className="hover:text-white"
              >
                prottoymodakprottoy@booknook.com
              </a>
            </li>
          </ul>

          {/* Social Links */}
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#6b6a58] text-[#e8e4d0] transition hover:border-[#2f7fc1] hover:bg-[#2f7fc1] hover:text-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={s.filled ? "currentColor" : "none"}
                  stroke={s.filled ? "none" : "currentColor"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#55543f]">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-[#b5b19a]">
          © <CurrentYear /> BookNook. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
