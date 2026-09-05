"use client";

import Image from "next/image";
import { useState } from "react";
import { BookingLink } from "./booking-link";

const navigation = [
  ["Автомашин", "#vehicles"],
  ["Цэнэглэлт", "#charging"],
  ["Эрчим хүч", "#energy"],
  ["Танилцах", "#discover"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur-xl" onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); document.getElementById("menu-toggle")?.focus(); } }}>
      <div className="page-width flex h-18 items-center justify-between gap-4">
        <a href="#top" aria-label="Tesla — нүүр хуудас" onClick={() => setOpen(false)}><Image src="/assets/logo.png" alt="Tesla" width={118} height={16} className="h-auto w-24 sm:w-28" /></a>
        <nav aria-label="Үндсэн цэс" className="hidden items-center gap-1 lg:flex">
          {navigation.map(([label, href]) => <a key={href} href={href} className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-surface">{label}</a>)}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <BookingLink className="inline-flex min-h-10 items-center rounded-md bg-ink px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-accent sm:px-5 sm:text-sm" />
          <button id="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Цэс хаах" : "Цэс нээх"} onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-md bg-surface lg:hidden">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={open ? "m6 6 12 12M6 18 18 6" : "M4 8h16M4 16h16"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
      <nav id="mobile-menu" aria-label="Гар утасны цэс" hidden={!open} className="border-t border-black/5 bg-white px-5 py-4 lg:hidden">
        {navigation.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-4 text-sm hover:bg-surface">{label}</a>)}
      </nav>
    </header>
  );
}
