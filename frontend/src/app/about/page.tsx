import MarketingShell from "@/components/marketing/MarketingShell";

const values = [
  {
    title: "Clarity first",
    text: "Buyers should understand a property faster, sellers should present it better, and admins should oversee it with less friction.",
  },
  {
    title: "Trust through structure",
    text: "Messaging, tours, reviews, and purchase interest belong in one connected flow so users do not lose confidence between steps.",
  },
  {
    title: "Presentation matters",
    text: "A marketplace that looks intentional makes every listing feel more credible and every interaction feel more professional.",
  },
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <section className="grid gap-8 pt-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:pt-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal-800/70">
            About the platform
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[0.96] text-slate-950 sm:text-6xl">
            AfREALTY DATAHOMES is built to make digital property experiences feel
            <span className="block text-teal-700">confident, refined, and useful.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            AfREALTY DATAHOMES brings discovery, listing management, buyer
            communication, and moderation into a cleaner product story. The goal is not
            just more features. It is a better feeling while using them.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="hero-panel overflow-hidden rounded-[2rem] border border-white/60 p-3 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] sm:translate-y-8">
            <img
              src="https://images.pexels.com/photos/11582332/pexels-photo-11582332.jpeg"
              alt="Beautiful residential property exterior"
              className="h-[360px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
          <div className="hero-panel overflow-hidden rounded-[2rem] border border-white/60 p-3 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)]">
            <img
              src="https://images.pexels.com/photos/8482510/pexels-photo-8482510.jpeg"
              alt="Prospective buyer discussing housing options"
              className="h-[360px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mt-16 hero-panel rounded-[2.2rem] border border-white/60 p-7 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.55)] sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal-800/70">
            What we believe
          </p>
          <h2 className="mt-3 font-display text-4xl text-slate-950">
            Good property software should reduce uncertainty, not add more of it.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-[1.75rem] border border-slate-900/8 bg-white px-6 py-7 shadow-[0_16px_55px_-34px_rgba(15,23,42,0.45)]"
            >
              <h3 className="text-2xl font-semibold text-slate-900">{value.title}</h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <div className="hero-panel rounded-[2rem] border border-white/60 p-7 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-800/70">
            Vision
          </p>
          <h2 className="mt-4 font-display text-4xl text-slate-950">
            One platform where discovery, trust, and action live together.
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Buyers should be able to inspect a property, ask questions, read reviews,
            schedule tours, and express purchase intent without feeling like they are
            jumping between disconnected systems. Sellers should have a clear place to
            manage those conversations. Admins should keep the public experience healthy
            without slowing everyone down.
          </p>
        </div>

        <div className="rounded-[2rem] bg-slate-950 px-7 py-8 text-white shadow-[0_24px_80px_-45px_rgba(15,23,42,0.78)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
            The outcome
          </p>
          <ul className="mt-6 space-y-4 text-base leading-7 text-white/80">
            <li>More attractive listings that invite real interest.</li>
            <li>Buyer workflows that feel clear from first click to physical visit.</li>
            <li>Seller tools that support follow-up, tours, and conversion.</li>
            <li>Administrative oversight that keeps reviews and content trustworthy.</li>
          </ul>
        </div>
      </section>
    </MarketingShell>
  );
}
