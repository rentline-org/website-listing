"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMapContext } from "./map-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatUnitType } from "@/lib/format";
import { ChevronLeft, ChevronRight, Home, MapPin } from "lucide-react";
import type { IProperty, IUnitData } from "@/lib/types";
import Image from "next/image";

function getAvailableUnits(property: IProperty): IUnitData[] {
  return (property.units || []).filter((unit) => unit.is_available);
}

function getPrimaryUnit(property: IProperty): IUnitData | null {
  const available = getAvailableUnits(property);
  return available[0] || property.units?.[0] || null;
}

function getPropertyPriceLabel(property: IProperty): string {
  if (property.sale_price != null) {
    return `$${property.sale_price.toLocaleString()}`;
  }

  const primaryUnit = getPrimaryUnit(property);
  if (!primaryUnit) return "Price on request";

  if (primaryUnit.rent_price != null) {
    return `$${primaryUnit.rent_price.toLocaleString()}/mo`;
  }

  if (primaryUnit.sale_price != null) {
    return `$${primaryUnit.sale_price.toLocaleString()}`;
  }

  return "Price on request";
}

function getThumbnailUrl(property: IProperty): string | null {
  const primaryUnit = getPrimaryUnit(property);
  const isMultiUnit = property.property_type === "multi_unit";

  return isMultiUnit
    ? property.thumbnail?.url || primaryUnit?.thumbnail?.url || null
    : primaryUnit?.thumbnail?.url || property.thumbnail?.url || null;
}

function getListingSubtitle(property: IProperty): string {
  const units = property.units || [];
  const firstUnit = getPrimaryUnit(property);

  if (property.property_type === "multi_unit") {
    return `${units.length} units available`;
  }

  if (property.property_type === "land") {
    return "Land";
  }

  if (firstUnit?.bedrooms != null && firstUnit?.bathrooms != null) {
    return `${firstUnit.bedrooms} bed · ${firstUnit.bathrooms} bath`;
  }

  if (firstUnit?.bedrooms != null) {
    return `${firstUnit.bedrooms} bed`;
  }

  if (firstUnit?.bathrooms != null) {
    return `${firstUnit.bathrooms} bath`;
  }

  return formatUnitType(firstUnit?.unit_type || property.property_type);
}

function getLocationLabel(property: IProperty): string {
  return [property.city, property.state].filter(Boolean).join(", ");
}

export default function PropertyCarousel() {
  const { filteredProperties, selectedProperty, setSelectedProperty } =
    useMapContext();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, filteredProperties.length]);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = Math.max(280, el.clientWidth * 0.75);
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }, []);

  const cards = useMemo(() => filteredProperties, [filteredProperties]);

  if (cards.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-0 right-0 z-10 px-4 pointer-events-none">
      <div className="relative group">
        {canScrollLeft && (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => scroll("left")}
            className="absolute -left-2 md:left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg border border-zinc-200 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-auto hover:bg-zinc-50"
            aria-label="Scroll listings left"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 pb-4 px-1 sm:px-6 snap-x snap-mandatory no-scrollbar pointer-events-auto"
        >
          {cards.map((property) => {
            const isSelected = selectedProperty?.id === property.id;
            const units = property.units || [];
            const firstUnit = getPrimaryUnit(property);

            const thumbnailUrl = getThumbnailUrl(property);
            const priceDisplay = getPropertyPriceLabel(property);
            const locationLabel = getLocationLabel(property);
            const subtitle = getListingSubtitle(property);

            return (
              <Card
                key={property.id}
                onClick={() => setSelectedProperty(property)}
                className={`shrink-0 w-[320px] py-0 snap-start cursor-pointer overflow-hidden transition-all duration-200 border ${
                  isSelected
                    ? "ring-2 ring-zinc-900 shadow-xl scale-[1.02] border-zinc-900"
                    : "shadow-md hover:shadow-lg border-zinc-200"
                }`}
              >
                <div className="flex h-28">
                  <div className="relative w-2/5 h-full border-r border-zinc-100 bg-zinc-100">
                    {thumbnailUrl ? (
                      <Image
                        src={thumbnailUrl}
                        alt={property.title}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-100 text-zinc-300">
                        <Home className="mb-1 h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <CardContent className="w-3/5 p-3 flex flex-col justify-between">
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">
                          {locationLabel || "Listing"}
                        </span>
                      </div>

                      <h4 className="truncate text-sm font-bold text-zinc-900">
                        {property.title}
                      </h4>

                      <p className="mt-1 truncate text-xs text-zinc-500">
                        {subtitle}
                      </p>

                      {property.property_type === "multi_unit" && (
                        <p className="mt-1 truncate text-xs text-zinc-500">
                          {units.length} total units
                        </p>
                      )}

                      {/* {property.property_type !== "multi_unit" && firstUnit && (
                        <p className="mt-1 truncate text-xs text-zinc-500">
                          {firstUnit.square_feet != null
                            ? `${firstUnit.square_feet.toLocaleString()} sqft`
                            : "Available now"}
                        </p>
                      )} */}
                    </div>

                    <div className="mt-2">
                      <p className="text-sm font-extrabold text-zinc-900">
                        {priceDisplay}
                      </p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>

        {canScrollRight && (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => scroll("right")}
            className="absolute -right-2 md:right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg border border-zinc-200 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-auto hover:bg-zinc-50"
            aria-label="Scroll listings right"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
