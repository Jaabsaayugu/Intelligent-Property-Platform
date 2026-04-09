"use client";

type PropertyMapPanelProps = {
  title: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  className?: string;
};

const getLocationQuery = (
  title: string,
  address: string,
  latitude?: number | null,
  longitude?: number | null
) => {
  if (typeof latitude === "number" && typeof longitude === "number") {
    return `${latitude},${longitude}`;
  }

  return `${title}, ${address}`;
};

export default function PropertyMapPanel({
  title,
  address,
  latitude,
  longitude,
  className = "",
}: PropertyMapPanelProps) {
  const locationQuery = getLocationQuery(title, address, latitude, longitude);
  const encodedQuery = encodeURIComponent(locationQuery);
  const embedSrc = `https://www.google.com/maps?q=${encodedQuery}&z=15&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodedQuery}`;
  const neighborhoodHref = `https://www.openstreetmap.org/search?query=${encodedQuery}`;

  return (
    <div className={`rounded-[2rem] border border-white/60 bg-white/75 p-4 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.55)] ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Map navigation
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            Explore the neighborhood
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{address}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={neighborhoodHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Check neighborhood
          </a>
          <a
            href={directionsHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#0f2747] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b1d35]"
          >
            Get directions
          </a>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100">
        <iframe
          title={`${title} map`}
          src={embedSrc}
          className="h-[320px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
