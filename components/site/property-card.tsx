import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, MapPin, Maximize, Home, Layers } from "lucide-react";
import { IProperty } from "@/lib/types";
import {
  formatPropertyType,
  formatUnitType,
  getPropertyPriceDisplay,
  getAvailableUnitsCount,
} from "@/lib/format";
import Image from "next/image";

interface PropertyCardProps {
  property: IProperty;
  subdomain: string;
  currency?: string;
}

export default function PropertyCard({
  property,
  subdomain,
  currency = "USD",
}: PropertyCardProps) {
  const isMultiUnit = property.property_type === "multi_unit";
  const units = property.units || [];
  const availableCount = getAvailableUnitsCount(property);
  const firstUnit = units[0];
  const priceDisplay = getPropertyPriceDisplay(property, currency);

  // Use property thumbnail for multi-unit, and unit thumbnail for single-unit
  const thumbnailUrl = isMultiUnit
    ? property.thumbnail?.url || firstUnit?.thumbnail?.url || null
    : firstUnit?.thumbnail?.url || property.thumbnail?.url || null;

  return (
    <a
      href={`/${subdomain}/properties/${property.slug}`}
      className="block group"
    >
      <Card className="overflow-hidden rounded-2xl border-zinc-200/80 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
        {/* Image */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={property.title}
              width={300}
              height={300}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-zinc-300">
              <Home className="h-12 w-12 mb-2" />
              <span className="text-sm">No image</span>
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <Badge className="bg-white/90 text-zinc-800 hover:bg-white backdrop-blur-sm border-none shadow-sm text-xs font-semibold">
              {formatPropertyType(property.property_type)}
            </Badge>
          </div>

          {/* Available units count for multi-unit */}
          {isMultiUnit && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-zinc-900/80 text-white hover:bg-zinc-900 backdrop-blur-sm border-none shadow-sm text-xs">
                <Layers className="h-3 w-3 mr-1" />
                {availableCount} available
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-lg font-bold line-clamp-1 text-zinc-900 group-hover:text-zinc-700 transition-colors">
            {property.title}
          </CardTitle>
          <div className="flex items-center text-zinc-500 text-sm mt-1">
            <MapPin className="h-3.5 w-3.5 mr-1.5 shrink-0" />
            <span className="line-clamp-1">
              {property.city}, {property.state}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0">
          {/* Price */}
          <div className="text-xl font-bold text-zinc-900 mb-4">
            {priceDisplay.text}
            {priceDisplay.suffix && (
              <span className="text-sm font-normal text-zinc-500 ml-1">
                {priceDisplay.suffix}
              </span>
            )}
          </div>

          {/* Single unit stats */}
          {!isMultiUnit && firstUnit && (
            <div className="flex items-center gap-4 text-zinc-500 text-sm border-t border-zinc-100 pt-3">
              {firstUnit.bedrooms != null && (
                <div className="flex items-center gap-1.5">
                  <Bed className="h-3.5 w-3.5" />
                  <span className="font-medium text-zinc-700">
                    {firstUnit.bedrooms}
                  </span>{" "}
                  {firstUnit.bedrooms === 1 ? "Bed" : "Beds"}
                </div>
              )}
              {firstUnit.bathrooms != null && (
                <div className="flex items-center gap-1.5">
                  <Bath className="h-3.5 w-3.5" />
                  <span className="font-medium text-zinc-700">
                    {firstUnit.bathrooms}
                  </span>{" "}
                  {firstUnit.bathrooms === 1 ? "Bath" : "Baths"}
                </div>
              )}
              {firstUnit.square_feet != null && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <Maximize className="h-3.5 w-3.5" />
                  <span className="font-medium text-zinc-700">
                    {firstUnit.square_feet.toLocaleString()}
                  </span>{" "}
                  sqft
                </div>
              )}
            </div>
          )}

          {/* Multi-unit summary */}
          {isMultiUnit && units.length > 0 && (
            <div className="border-t border-zinc-100 pt-3 space-y-1.5">
              {units.slice(0, 3).map((unit) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs border-zinc-200 text-zinc-600 font-normal"
                    >
                      {formatUnitType(unit.unit_type)}
                    </Badge>
                    <span className="text-zinc-600 line-clamp-1">
                      {unit.name}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      unit.is_available ? "text-emerald-600" : "text-zinc-400"
                    }`}
                  >
                    {unit.is_available ? "Available" : "Occupied"}
                  </span>
                </div>
              ))}
              {units.length > 3 && (
                <p className="text-xs text-zinc-400 pt-1">
                  +{units.length - 3} more units
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  );
}
