"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Shows the current year. The server always sends 2026, and the browser then switches to
// the real year, so the page can still be prerendered (no `new Date()` on the server).
export default function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => 2026
  );
  return <>{year}</>;
}