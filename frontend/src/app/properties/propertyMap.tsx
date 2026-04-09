"use client";

import PropertyMapPanel from "@/components/maps/PropertyMapPanel";

type Property = {
  id: string;
  title: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
  city?: string;
  county?: string | null;
};

export default function PropertyMap({ properties }: { properties: Property[] }) {
  const activeProperty = properties[0];

  if (!activeProperty) {
    return null;
  }

  return (
    <PropertyMapPanel
      title={activeProperty.title}
      address={[activeProperty.address, activeProperty.city, activeProperty.county]
        .filter(Boolean)
        .join(", ")}
      latitude={activeProperty.latitude}
      longitude={activeProperty.longitude}
    />
  );
}
