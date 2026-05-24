import React from "react";
import { Badge } from "@/components/ui/badge";
import { IProperty } from "@/lib/types";
import PropertyCard from "./property-card";

interface PropertyGridProps {
  properties: IProperty[] | null;
  currency?: string;
}

export default function PropertyGrid({
  properties,
  currency = "USD",
}: PropertyGridProps) {
  const hasProperties = properties && properties.length > 0;

  return (
    <section id="properties" className="py-20 md:py-28 px-4 bg-zinc-50/50">
      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-2">
              Available Properties
            </h2>
            <p className="text-zinc-500 text-lg">
              Browse through our current active listings.
            </p>
          </div>
          <Badge
            variant="outline"
            className="px-4 py-1.5 text-sm self-start md:self-auto border-zinc-200 text-zinc-600"
          >
            {properties?.length || 0} Listings
          </Badge>
        </div>

        {/* Grid */}
        {!hasProperties ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-zinc-200">
            <p className="text-zinc-400 text-lg">
              No properties available at the moment.
            </p>
            <p className="text-zinc-400 text-sm mt-2">
              Check back soon for new listings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                currency={currency}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
