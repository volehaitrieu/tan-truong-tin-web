"use client";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="h-11 rounded bg-brand px-4 font-semibold text-white">
      In phiếu
    </button>
  );
}
