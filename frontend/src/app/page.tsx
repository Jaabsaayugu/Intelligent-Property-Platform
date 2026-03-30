import Link from "next/link";
import MarketingShell from "@/components/marketing/MarketingShell";

const heroStats = [
  { value: "250+", label: "listings staged for confident discovery" },
  { value: "3", label: "focused journeys for buyers, sellers, and admins" },
  { value: "24/7", label: "digital access to tours, reviews, and inquiries" },
];

const roleCards = [
  {
    eyebrow: "For buyers",
    title: "See homes with more context before you commit.",
    description:
      "Move from browsing to booking with clearer details, review history, direct messaging, and guided next steps.",
    href: "/login?role=buyer",
    accent: "from-sky-500 to-cyan-400",
  },
  {
    eyebrow: "For sellers",
    title: "Present each property like it deserves attention.",
    description:
      "Publish polished listings, answer serious questions, schedule tours, and manage purchase intent in one place.",
    href: "/login?role=seller",
    accent: "from-emerald-500 to-teal-400",
  },
  {
    eyebrow: "For admins",
    title: "Keep the marketplace elegant, trusted, and active.",
    description:
      "Moderate reviews, oversee platform flow, and maintain a credible experience across every listing interaction.",
    href: "/login?role=admin",
    accent: "from-amber-500 to-orange-400",
  },
];

const experienceCards = [
  {
    title: "Thoughtful discovery",
    text: "Hero imagery, guided property details, and clearer decision points give the marketplace a more premium feel.",
  },
  {
    title: "Real interaction",
    text: "Messaging, booking, reviews, and tours turn the platform into a practical property workflow instead of a static catalogue.",
  },
  {
    title: "Trusted presentation",
    text: "Structured sections and refined layout help every role feel like they are working inside a serious real-estate product.",
  },
];

export default function Home() {
  return (
    <MarketingShell>
      <section className="grid gap-10 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pt-14">
        <div className="max-w-3xl">
          <h1 className="mt-7 font-display text-5xl leading-[0.95] text-slate-950 sm:text-6xl lg:text-7xl">
            Find, present, and manage property in a space that feels
            <span className="block text-teal-700">more premium from the first view.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
            The platform is designed to make listings feel trustworthy, navigation feel
            deliberate, and every next step feel easier for buyers, sellers, and admins.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Start your account
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-slate-900/10 bg-white/80 px-6 py-3.5 text-base font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-white"
            >
              Learn more about the platform
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="hero-panel rounded-[1.75rem] border border-white/60 px-5 py-5 shadow-[0_18px_60px_-28px_rgba(15,23,42,0.45)]"
              >
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <div className="hero-panel overflow-hidden rounded-[2rem] border border-white/60 p-3 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.6)]">
              <img
                src="https://images.pexels.com/photos/33146175/pexels-photo-33146175.jpeg"
                alt="Elegant modern property exterior"
                className="h-[320px] w-full rounded-[1.5rem] object-cover sm:h-[360px]"
              />
            </div>
          </div>

          <div className="hero-panel overflow-hidden rounded-[2rem] border border-white/60 p-3 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.55)]">
            <img
              src="https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg"
              alt="Interior living room with refined styling"
              className="h-[250px] w-full rounded-[1.5rem] object-cover"
            />
          </div>

          <div className="hero-panel overflow-hidden rounded-[2rem] border border-white/60 p-3 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.55)]">
            <img
              src="https://images.pexels.com/photos/7937750/pexels-photo-7937750.jpeg"
              alt="Professional property consultation"
              className="h-[250px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-3">
        {experienceCards.map((card) => (
          <div
            key={card.title}
            className="hero-panel rounded-[1.9rem] border border-white/60 px-6 py-7 shadow-[0_18px_65px_-35px_rgba(15,23,42,0.45)]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-800/70">
              Experience
            </p>
            <h2 className="mt-4 font-display text-3xl text-slate-900">{card.title}</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">{card.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 hero-panel rounded-[2.2rem] border border-white/60 p-6 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.55)] sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal-800/70">
              Choose your role
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-900 sm:text-4xl">
              Every side of the property journey gets its own thoughtful starting point.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600">
            Whether you are discovering homes, showcasing them, or moderating the
            experience, the platform is shaped to support your exact workflow.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {roleCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative overflow-hidden rounded-[1.8rem] border border-slate-900/8 bg-white p-6 shadow-[0_16px_60px_-35px_rgba(15,23,42,0.55)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-34px_rgba(15,23,42,0.5)]"
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.accent}`} />
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                {card.eyebrow}
              </p>
              <h3 className="mt-5 text-2xl font-semibold leading-tight text-slate-900">
                {card.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{card.description}</p>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition group-hover:gap-3">
                Enter this experience
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="hero-panel rounded-[2rem] border border-white/60 p-7 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-800/70">
            Visual confidence
          </p>
          <h2 className="mt-4 font-display text-4xl text-slate-950">
            A cleaner market presence helps serious buyers stay longer.
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Beautiful imagery and structured sections create trust quickly. That first
            impression matters when someone is comparing homes, deciding to message, or
            booking a physical tour.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-slate-950 px-5 py-6 text-white">
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Listings</p>
              <p className="mt-3 text-2xl font-semibold">Sharper first impressions</p>
            </div>
            <div className="rounded-[1.5rem] bg-white px-5 py-6 text-slate-900 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.5)]">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Trust</p>
              <p className="mt-3 text-2xl font-semibold">More clarity before inquiry</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="hero-panel overflow-hidden rounded-[2rem] border border-white/60 p-3 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.55)] sm:translate-y-10">
            <img
              src="https://images.pexels.com/photos/11582332/pexels-photo-11582332.jpeg"
              alt="Bright house exterior with inviting landscaping"
              className="h-[360px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
          <div className="hero-panel overflow-hidden rounded-[2rem] border border-white/60 p-3 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.55)]">
            <img
              src="https://images.pexels.com/photos/8482510/pexels-photo-8482510.jpeg"
              alt="Confident home buyer reviewing options"
              className="h-[360px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mt-16 mb-4 rounded-[2.2rem] bg-slate-950 px-6 py-10 text-white shadow-[0_26px_80px_-45px_rgba(15,23,42,0.8)] sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Next steps
            </p>
            <h2 className="mt-3 font-display text-4xl">
              Explore the story behind the platform or open a direct line with your team.
            </h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Visit the about page
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
