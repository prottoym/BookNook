import Link from "next/link";

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
    label: "Facebook",
    href: "https://facebook.com",
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: (
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
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
              style={{ height: s.h, backgroundColor: s.c, minWidth: 10 }}
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
            A cozy corner to share your shelf, borrow great reads and meet fellow book lovers.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#6b6a58] text-[#e8e4d0] transition hover:border-[#2f7fc1] hover:bg-[#2f7fc1] hover:text-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
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
            <li>📍 House 12, Road 5, Dhanmondi, Dhaka</li>
            <li>
              ✉️{" "}
              <a href="mailto:hello@booknook.com" className="hover:text-white">
                hello@booknook.com
              </a>
            </li>
            <li>
              📞{" "}
              <a href="tel:+8801700000000" className="hover:text-white">
                +880 1700-000000
              </a>
            </li>
            <li>🕘 Sat – Thu, 9:00 AM – 8:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#55543f]">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-[#b5b19a]">
          © {new Date().getFullYear()} BookNook. All rights reserved.
        </p>
      </div>
    </footer>
  );
}