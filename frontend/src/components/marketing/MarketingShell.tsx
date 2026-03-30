import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type MarketingShellProps = {
  children: ReactNode;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function MarketingShell({ children }: MarketingShellProps) {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 soft-grid opacity-35" />
      <div className="absolute left-[6%] top-24 h-52 w-52 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="absolute right-[8%] top-10 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-200/20 blur-3xl" />

      <div className="relative mx-auto min-h-screen w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <header className="hero-panel rounded-full border border-white/60 px-5 py-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.55)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="flex items-center gap-4">
              <div className="hero-panel flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/60 bg-white/80">
                <Image
                  src="/afrealty-datahomes-logo.png"
                  alt="AfREALTY DATAHOMES logo"
                  width={56}
                  height={56}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal-800/70">
                  AfREALTY DATAHOMES
                </p>
                <p className="mt-1 font-display text-xl text-slate-900">
                  Unlocking Africa&apos;s Property Future
                </p>
              </div>
            </Link>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full px-4 py-2 transition hover:bg-white/80 hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <Link
                  href="/register"
                  className="rounded-full border border-slate-900/10 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                >
                  Create account
                </Link>
                <Link
                  href="/login"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </header>

        {children}

        <footer className="mt-16 rounded-[2rem] border border-white/60 bg-slate-950 px-6 py-8 text-white shadow-[0_24px_80px_-45px_rgba(15,23,42,0.75)] sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300">
                AfREALTY DATAHOMES
              </p>
              <h2 className="mt-3 font-display text-3xl">
                A calmer, more premium way to discover, present, and manage property.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                Buyers get clarity, sellers get momentum, and administrators get a cleaner
                operational view of the marketplace.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-white/80 sm:grid-cols-2">
              <Link href="/" className="rounded-2xl bg-white/10 px-4 py-3 transition hover:bg-white/15">
                Home
              </Link>
              <Link href="/about" className="rounded-2xl bg-white/10 px-4 py-3 transition hover:bg-white/15">
                About
              </Link>
              <Link href="/contact" className="rounded-2xl bg-white/10 px-4 py-3 transition hover:bg-white/15">
                Contact
              </Link>
              <Link href="/buyer/properties" className="rounded-2xl bg-white/10 px-4 py-3 transition hover:bg-white/15">
                Browse listings
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
