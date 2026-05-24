import React from "react";
import Image from "next/image";
import Link from "next/link";
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
import {
  getBathroomCount,
  getBedroomCount,
  getLocationLabel,
  getPropertyThumbnailUrl,
  getSquareFeetRange,
} from "@/lib/property";

interface PropertyCardProps {
  property: IProperty;
  currency?: string;
}

export default function PropertyCard({
  property,
  currency = "USD",
}: PropertyCardProps) {
  const isMultiUnit = property.property_type === "multi_unit";
  const units = property.units || [];
  const availableCount = getAvailableUnitsCount(property);
  const firstUnit = units[0];
  const priceDisplay = getPropertyPriceDisplay(property, currency);
  const thumbnailUrl = getPropertyThumbnailUrl(property);
  const bedrooms = getBedroomCount(property);
  const bathrooms = getBathroomCount(property);
  const squareFeet = getSquareFeetRange(property);
  const locationLabel = getLocationLabel(property);

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="block group"
    >
      <Card className="h-full overflow-hidden rounded-lg border-zinc-200/80 bg-white py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={property.title}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-zinc-300">
              <Home className="h-12 w-12 mb-2" />
              <span className="text-sm">No image</span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <Badge className="rounded-md border-none bg-white/90 text-xs font-semibold text-zinc-800 shadow-sm backdrop-blur-sm hover:bg-white">
              {formatPropertyType(property.property_type)}
            </Badge>
          </div>

          {isMultiUnit && (
            <div className="absolute top-3 right-3">
              <Badge className="rounded-md border-none bg-zinc-900/80 text-xs text-white shadow-sm backdrop-blur-sm hover:bg-zinc-900">
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
            <span className="line-clamp-1">{locationLabel || "Listing"}</span>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0">
          <div className="text-xl font-bold text-zinc-900 mb-4">
            {priceDisplay.text}
            {priceDisplay.suffix && (
              <span className="text-sm font-normal text-zinc-500 ml-1">
                {priceDisplay.suffix}
              </span>
            )}
          </div>

          {!isMultiUnit && firstUnit && (bedrooms || bathrooms || squareFeet) && (
            <div className="flex items-center gap-4 text-zinc-500 text-sm border-t border-zinc-100 pt-3">
              {bedrooms != null && (
                <div className="flex items-center gap-1.5">
                  <Bed className="h-3.5 w-3.5" />
                  <span className="font-medium text-zinc-700">{bedrooms}</span>{" "}
                  {bedrooms === 1 ? "Bed" : "Beds"}
                </div>
              )}
              {bathrooms != null && (
                <div className="flex items-center gap-1.5">
                  <Bath className="h-3.5 w-3.5" />
                  <span className="font-medium text-zinc-700">
                    {bathrooms}
                  </span>{" "}
                  {bathrooms === 1 ? "Bath" : "Baths"}
                </div>
              )}
              {squareFeet && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <Maximize className="h-3.5 w-3.5" />
                  <span className="font-medium text-zinc-700">{squareFeet}</span>{" "}
                  sqft
                </div>
              )}
            </div>
          )}

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
    </Link>
  );
}
