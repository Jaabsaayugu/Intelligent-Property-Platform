import PropertyCard from "@/components/property/PropertyCard";

type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  imageUrl?: string;
};

export default async function PropertiesPage() {
  // In real app → fetch from API
  const properties: Property[] = [
    {
      id: "1",
      title: "Modern 3 Bedroom Apartment - Westlands",
      price: 85000,
      location: "Westlands, Nairobi",
      bedrooms: 3,
      imageUrl: "/images/property-1.jpg",
    },
    // ... more mock data
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Available Properties</h1>
        <div className="text-sm text-gray-600">Showing {properties.length} results</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No properties found. Try adjusting your filters.
        </div>
      )}
    </div>
  );
}