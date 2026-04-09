"use client";

import Image from "next/image";
import Link from "next/link";

export default function GlobalBrandBadge() {
  return (
    <Link
      href="/"
      className="fixed left-4 top-4 z-50 flex items-center gap-3 rounded-full border border-white/70 bg-white/88 px-3 py-2 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.65)] backdrop-blur"
      aria-label="Afrealty Datahomes home"
    >
      <Image
        src="/afrealty-datahomes-logo.png"
        alt="Afrealty Datahomes"
        width={34}
        height={34}
        className="h-8 w-8 rounded-full object-cover"
        priority
      />
      <div className="hidden sm:block">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Afrealty
        </p>
        <p className="text-sm font-semibold text-slate-900">Datahomes</p>
      </div>
    </Link>
  );
}
