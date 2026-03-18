import Image from "next/image";
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
    <Link href={`/properties/${property.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48">
          {property.imageUrl ? (
            <Image
              src={property.imageUrl}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {property.title}
          </h3>

          <p className="text-2xl font-bold text-indigo-700 mt-2">
            KSh {property.price.toLocaleString()}
          </p>

          <div className="mt-3 flex items-center text-sm text-gray-600">
            <span>{property.location}</span>
            <span className="mx-2">•</span>
            <span>{property.bedrooms} Bed{property.bedrooms !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}