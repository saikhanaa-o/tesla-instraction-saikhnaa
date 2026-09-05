export function Arrow({ className = "", direction = "right" }: { className?: string; direction?: "right" | "left" | "down" }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" className={`${direction === "left" ? "rotate-180" : direction === "down" ? "rotate-90" : ""} ${className}`}>
      <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
