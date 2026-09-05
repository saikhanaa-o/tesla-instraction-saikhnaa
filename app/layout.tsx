import type { Metadata } from "next";
import Script from "next/script";
import { calEmbedScript } from "@/lib/cal-embed";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tesla — Цахилгаан ирээдүйг мэдэр",
  description: "Tesla автомашин, цэнэглэлт, эрчим хүчний шийдлүүдтэй танилцаж, жолоодож үзэх цагаа захиалаарай.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn">
      <body className="font-sans">
        <a href="#main" className="fixed top-3 left-3 z-100 -translate-y-24 rounded-md bg-white p-3 text-ink focus:translate-y-0">Үндсэн агуулга руу очих</a>
        {children}
        <Script id="cal-booking" strategy="beforeInteractive">{calEmbedScript}</Script>
      </body>
    </html>
  );
}
