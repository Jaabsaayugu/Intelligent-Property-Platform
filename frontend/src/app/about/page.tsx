import MarketingShell from "@/components/marketing/MarketingShell";

const coreValues = [
  {
    title: "Innovation",
    text: "Driving the future of real estate through AI and automation.",
  },
  {
    title: "Transparency",
    text: "Delivering data-backed, honest solutions.",
  },
  {
    title: "Empowerment",
    text: "Enabling smart decisions for buyers and investors.",
  },
  {
    title: "Sustainability",
    text: "Promoting responsible, scalable housing solutions.",
  },
];

const services = [
  "AI Property Finder: Personalized home and land recommendations",
  "Investment Analyzer: Predict Return On Investment on real estate opportunities using machine learning",
  "Virtual Site Visits & Tours: Visit your property to be in the comfort of your seat",
  "Smart Listing Portal: trustworthy, intelligent, and user-centric. Our portal offers more than just ads - it delivers verified, data-rich experiences that empower buyers, renters, and investors with the insights they need to make smart decisions.",
  "Affordable Housing Projects: Tech-backed development & smart homes",
  "Data-driven Market Insights for agents, developers & investors",
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <section className="grid gap-8 pt-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:pt-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal-800/70">
            About Us
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[0.96] text-slate-950 sm:text-6xl">
            AfReaLTY DATAHOMES LTD
            <span className="block text-teal-700">Unlocking Africa&apos;s Property Future</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            AfReaLTY Datahomes is an AI-powered real estate platform revolutionizing
            property discovery, investment, and housing development in Africa. By
            combining machine learning, data analytics, and smart digital tools, we
            simplify decision-making for homebuyers, investors, and developers -
            delivering faster, smarter, and more affordable real estate experiences
            across the continent.
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

      <section className="mt-16 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="hero-panel rounded-[2rem] border border-white/60 p-7 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-800/70">
            Vision Statement
          </p>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            "To revolutionize African real estate through intelligent, data-driven
            technologies - making property investment smarter, faster, and more
            accessible for all."
          </p>
        </div>

        <div className="rounded-[2rem] bg-slate-950 px-7 py-8 text-white shadow-[0_24px_80px_-45px_rgba(15,23,42,0.78)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Mission Statement
          </p>
          <p className="mt-4 text-lg leading-8 text-white/85">
            "We leverage artificial intelligence and digital platforms to build a
            trusted, tech-driven real estate ecosystem that empowers individuals to
            acquire smart, affordable housing solutions for a growing market."
          </p>
        </div>
      </section>

      <section className="mt-16 grid gap-5 sm:grid-cols-2">
        <div className="hero-panel overflow-hidden rounded-[2rem] border border-white/60 p-3 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)]">
          <img
            src="https://images.pexels.com/photos/8293718/pexels-photo-8293718.jpeg"
            alt="Modern property technology workflow"
            className="h-[320px] w-full rounded-[1.5rem] object-cover"
          />
        </div>
        <div className="hero-panel overflow-hidden rounded-[2rem] border border-white/60 p-3 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)]">
          <img
            src="https://images.pexels.com/photos/7578931/pexels-photo-7578931.jpeg"
            alt="Real estate planning and development discussion"
            className="h-[320px] w-full rounded-[1.5rem] object-cover"
          />
        </div>
      </section>

      <section className="mt-16 hero-panel rounded-[2.2rem] border border-white/60 p-7 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.55)] sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal-800/70">
            Core Values
          </p>
          <h2 className="mt-3 font-display text-4xl text-slate-950">
            The principles guiding AfReaLTY Datahomes.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {coreValues.map((value) => (
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

      <section className="mt-16 hero-panel rounded-[2.2rem] border border-white/60 p-7 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.55)] sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal-800/70">
            Products & Services
          </p>
          <h2 className="mt-3 font-display text-4xl text-slate-950">
            Smart tools and solutions built for Africa&apos;s real estate future.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {services.map((service) => (
            <div
              key={service}
              className="rounded-[1.75rem] border border-slate-900/8 bg-white px-6 py-6 shadow-[0_16px_55px_-34px_rgba(15,23,42,0.45)]"
            >
              <p className="text-base leading-7 text-slate-700">{service}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
