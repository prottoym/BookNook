"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];

const privateLinks = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="inline-flex h-9 w-9 -rotate-6 items-center justify-center rounded-md bg-[#2f7fc1] text-lg font-bold text-white shadow">
        B
      </span>
      <span className="font-serif text-2xl tracking-wide text-[#3b3a2f]">
        Book<span className="font-bold text-[#2f7fc1]">Nook</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setDropOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const links = user ? [...publicLinks, ...privateLinks] : publicLinks;

  const handleLogout = async () => {
    await authClient.signOut();
    setDropOpen(false);
    router.push("/");
    router.refresh();
  };

  const linkClass = (href) =>
    `rounded-md px-3 py-2 text-[15px] transition-colors hover:bg-[#d3cfb8] ${
      pathname === href ? "bg-[#d3cfb8] font-semibold text-[#3b3a2f]" : "text-[#4a493c]"
    }`;

  return (
    <header className="sticky top-0 z-50">
      {/* Top strip */}
      <div className="bg-[#3b3a2f] text-sm text-[#e8e4d0]">
        <div className="mx-auto flex h-10 max-w-6xl items-center justify-between px-4">
          <span className="font-serif tracking-wide">Read. Share. Borrow.</span>
          <span className="hidden sm:block">Your community library, online</span>
        </div>
      </div>

      {/* Main bar */}
      <nav className="border-b border-[#cfcab0] bg-[#e0dcc8]">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4">
          <Logo />

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass(l.href)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-[#d3cfb8]" />
            ) : user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen((o) => !o)}
                  className="block h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow focus:outline-none focus:ring-2 focus:ring-[#2f7fc1]"
                  aria-label="User menu"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.image || "https://i.ibb.co/2kR7xvZ/avatar.png"}
                    alt={user.name || "User"}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-lg border border-[#e3dfca] bg-white shadow-lg">
                    <div className="border-b border-[#eee9d6] bg-[#faf8f0] px-4 py-3">
                      <p className="truncate font-semibold text-[#3b3a2f]">{user.name}</p>
                      <p className="truncate text-xs text-[#7a786a]">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2.5 text-sm text-[#3b3a2f] hover:bg-[#f3f0e1]"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-[#f3f0e1]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-3 sm:flex">
                <Link href="/login" className="px-2 text-[15px] text-[#4a493c] hover:underline">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-[#0b6bcb] px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-[#0958a8]"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-md p-2 text-[#3b3a2f] hover:bg-[#d3cfb8] lg:hidden"
              aria-label="Toggle menu"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-[#cfcab0] bg-[#e0dcc8] px-4 pb-4 lg:hidden">
            <ul className="flex flex-col gap-1 pt-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={`block ${linkClass(l.href)}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {!user && !isPending && (
              <div className="mt-3 flex gap-3">
                <Link
                  href="/login"
                  className="flex-1 rounded-md border border-[#3b3a2f] px-4 py-2.5 text-center text-[15px] text-[#3b3a2f]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex-1 rounded-md bg-[#0b6bcb] px-4 py-2.5 text-center text-[15px] font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}