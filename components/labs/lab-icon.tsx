import type { LabId } from "@/lib/labs/types";

export function LabIcon({ id }: { id: LabId }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {id === "water-01" ? (
        <>
          <path d="M24 5C20 12 12 19 12 27a12 12 0 0 0 24 0c0-8-8-15-12-22Z" />
          <path d="M18 28a6 6 0 0 0 6 6M7 42h34" />
        </>
      ) : id === "power-01" ? (
        <>
          <path d="m28 4-17 23h12l-3 17 17-25H25l3-15Z" />
          <path d="M7 10v8M3 14h8M38 33v8M34 37h8" />
        </>
      ) : (
        <>
          <rect x="12" y="5" width="24" height="31" rx="6" />
          <path d="M12 22h24M18 11h12M18 36l-5 8M30 36l5 8M16 40h16" />
          <circle cx="18" cy="29" r="1.5" />
          <circle cx="30" cy="29" r="1.5" />
        </>
      )}
    </svg>
  );
}
