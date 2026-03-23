import Link from "next/link";

const roleCards = [
  {
    title: "Buy smarter",
    subtitle: "For buyers",
    description:
      "Explore verified listings, compare neighborhoods, and move from curiosity to confidence faster.",
    href: "/login?role=buyer",
    accent: "from-sky-500 to-cyan-400",
  },
  {
    title: "List with momentum",
    subtitle: "For sellers",
    description:
      "Launch polished listings, track attention, and turn inquiries into serious conversations.",
    href: "/login?role=seller",
    accent: "from-emerald-500 to-teal-400",
  },
  {
    title: "Oversee the market",
    subtitle: "For admins",
    description:
      "Manage approvals, monitor platform activity, and keep quality high across the ecosystem.",
    href: "/login?role=admin",
    accent: "from-amber-500 to-orange-400",
  },
];

const highlights = [
  "Role-based dashboards for buyers, sellers, and administrators",
  "Structured listing creation with guided multi-step publishing",
  "Messaging and platform management built into the same system",
];

const stats = [
  { value: "360°", label: "property experience" },
  { value: "3", label: "role-specific journeys" },
  { value: "1", label: "connected platform" },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 soft-grid opacity-40" />
      <div className="absolute left-[8%] top-28 h-44 w-44 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="absolute right-[6%] top-16 h-56 w-56 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-200/30 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-800/70">
              IPPPR
            </p>
            <p className="mt-2 font-display text-lg text-slate-800">
              Intelligent Property Platform
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Sign in
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-900/10 bg-white/65 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Designed for modern property discovery, selling, and oversight
            </div>

            <h1 className="mt-8 font-display text-5xl leading-none text-slate-900 sm:text-6xl lg:text-7xl">
              Property journeys
              <span className="block text-teal-700">that feel premium from the first click.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
              A refined digital property hub where buyers browse with clarity,
              sellers publish with confidence, and administrators keep every
              interaction trustworthy.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login?role=buyer"
                className="inline-flex items-center justify-center rounded-full bg-teal-700 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-teal-800"
              >
                Explore as a buyer
              </Link>
              <Link
                href="/login?role=seller"
                className="inline-flex items-center justify-center rounded-full border border-slate-900/10 bg-white/80 px-6 py-3.5 text-base font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-white"
              >
                Start listing property
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="hero-panel rounded-3xl border border-white/60 px-5 py-4 shadow-[0_18px_60px_-28px_rgba(15,23,42,0.45)]"
                >
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-sm uppercase tracking-[0.2em] text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel relative rounded-[2rem] border border-white/60 p-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.6)] sm:p-8">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-2xl">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Live platform preview</span>
                <span>Trusted workflows</span>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                    Guided publishing
                  </p>
                  <p className="mt-3 text-2xl font-semibold">
                    From listing draft to market-ready in a clean step flow.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-400/30 to-teal-500/10 p-4">
                    <p className="text-sm text-white/70">Seller momentum</p>
                    <p className="mt-2 text-3xl font-bold">+23</p>
                    <p className="text-sm text-white/80">new inquiries</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-sky-400/30 to-cyan-500/10 p-4">
                    <p className="text-sm text-white/70">Buyer clarity</p>
                    <p className="mt-2 text-3xl font-bold">4.8k</p>
                    <p className="text-sm text-white/80">property views</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white/75 px-4 py-3 text-slate-700"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-600" />
                  <p className="text-sm leading-6">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-6 pb-20 sm:px-8 lg:px-10">
        <div className="hero-panel rounded-[2rem] border border-white/60 p-6 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.55)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-800/70">
                Choose your path
              </p>
              <h2 className="mt-3 font-display text-3xl text-slate-900 sm:text-4xl">
                Built for every side of the property ecosystem.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Step into the experience that matches your role and get to the
              right dashboard with less friction.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {roleCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative overflow-hidden rounded-[1.75rem] border border-slate-900/8 bg-white p-6 shadow-[0_16px_60px_-35px_rgba(15,23,42,0.55)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-34px_rgba(15,23,42,0.5)]"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.accent}`}
                />
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {card.subtitle}
                </p>
                <h3 className="mt-5 text-2xl font-semibold text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  {card.description}
                </p>
                <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition group-hover:gap-3">
                  Continue
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
