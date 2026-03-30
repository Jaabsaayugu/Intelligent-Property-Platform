import MarketingShell from "@/components/marketing/MarketingShell";
import ContactInquiryForm from "@/components/marketing/ContactInquiryForm";

const contactCards = [
  {
    title: "General inquiries",
    value: "afrealtydatahomes@gmail.com",
    text: "Use this for product questions, onboarding help, and feature clarification.",
  },
  {
    title: "Sales and partnerships",
    value: "0799715875",
    text: "Reach out when you want to discuss platform rollout, partnerships, or collaboration.",
  },
  {
    title: "Office hours",
    value: "24/7 service",
    text: "Support is structured to help teams move quickly without feeling rushed.",
  },
];

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="grid gap-8 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pt-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal-800/70">
            Contact
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[0.96] text-slate-950 sm:text-6xl">
            Start the conversation in a space that feels
            <span className="block text-teal-700">as polished as the product.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            Whether you are exploring the platform, preparing a launch, or improving the
            marketplace experience, this page gives you a simple and presentable place to
            reach out.
          </p>
        </div>

        <div className="hero-panel overflow-hidden rounded-[2rem] border border-white/60 p-3 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.58)]">
          <img
            src="https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg"
            alt="Inviting modern interior space"
            className="h-[360px] w-full rounded-[1.5rem] object-cover"
          />
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="grid gap-6">
            {contactCards.map((card) => (
              <div
                key={card.title}
                className="hero-panel rounded-[1.8rem] border border-white/60 px-6 py-7 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.45)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {card.title}
                </p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">{card.value}</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">{card.text}</p>
              </div>
            ))}
          </div>

          <div className="hero-panel rounded-[2rem] border border-white/60 p-7 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-800/70">
              Send a message
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-950">
              Send your inquiry straight to the admin team.
            </h2>
            <ContactInquiryForm />
          </div>
        </div>

        <div className="grid gap-5">
          <div className="hero-panel overflow-hidden rounded-[2rem] border border-white/60 p-3 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)]">
            <img
              src="https://images.pexels.com/photos/33146175/pexels-photo-33146175.jpeg"
              alt="Striking modern property frontage"
              className="h-[280px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
          <div className="hero-panel overflow-hidden rounded-[2rem] border border-white/60 p-3 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)]">
            <img
              src="https://images.pexels.com/photos/7937750/pexels-photo-7937750.jpeg"
              alt="Confident property consultation"
              className="h-[280px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
