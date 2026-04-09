import Link from "next/link";

type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  imageUrl?: string;
};

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-34px_rgba(15,23,42,0.5)]">
        <div className="relative h-52 overflow-hidden bg-slate-100">
          {property.imageUrl ? (
            <img
              src={property.imageUrl}
              alt={property.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200">
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                No image
              </span>
            </div>
          )}

          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-sm backdrop-blur">
            Buyer view
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="line-clamp-2 text-xl font-semibold text-slate-900 transition-colors group-hover:text-[#0f2747]">
            {property.title}
          </h3>

          <p className="mt-3 text-2xl font-bold text-[#0f2747]">
            KSh {property.price.toLocaleString()}
          </p>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p className="line-clamp-2 leading-6">{property.location}</p>
            <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                {property.bedrooms} Bed{property.bedrooms !== 1 ? "s" : ""}
              </span>
              <span className="text-sm font-semibold text-[#0f2747] transition-transform duration-300 group-hover:translate-x-1">
                View details
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
