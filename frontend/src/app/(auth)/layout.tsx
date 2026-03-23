export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <div className="absolute inset-0 soft-grid opacity-35" />
      <div className="absolute left-[8%] top-20 h-48 w-48 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="absolute right-[6%] top-16 h-64 w-64 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="absolute bottom-12 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-200/25 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:block">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-800/70">
              Secure Access
            </p>
            <h1 className="mt-6 font-display text-5xl leading-none text-slate-900 xl:text-6xl">
              Enter the platform
              <span className="block text-teal-700">through a calmer, clearer gateway.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
              Sign in to manage listings, explore the market, and move across
              your workflow with the same polished experience as the homepage.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Buyer", detail: "Discover verified spaces" },
                { label: "Seller", detail: "Publish with confidence" },
                { label: "Admin", detail: "Keep quality high" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="hero-panel rounded-3xl border border-white/60 px-5 py-5 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.45)]"
                >
                  <p className="text-lg font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-xl justify-self-center lg:justify-self-end">
          <div className="hero-panel rounded-[2rem] border border-white/60 p-4 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.6)] sm:p-6">
            <div className="rounded-[1.75rem] bg-white/80 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
