"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  Bed,
  CalendarDays,
  CheckCircle2,
  ImageIcon,
  Maximize,
  PawPrint,
  Sofa,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatUnitType } from "@/lib/format";
import { formatAvailableFrom, getUnitPriceDisplay } from "@/lib/property";
import type { IUnitData } from "@/lib/types";

interface PropertyUnitsSectionProps {
  units: IUnitData[];
  currency?: string;
  contactHref: string;
}

type UnitFilter = "available" | "all";

export default function PropertyUnitsSection({
  units,
  currency = "USD",
  contactHref,
}: PropertyUnitsSectionProps) {
  const availableUnits = useMemo(
    () => units.filter((unit) => unit.is_available),
    [units],
  );
  const [filter, setFilter] = useState<UnitFilter>(
    availableUnits.length > 0 ? "available" : "all",
  );

  const visibleUnits = useMemo(() => {
    const source = filter === "available" ? availableUnits : units;

    return [...source].sort((a, b) => {
      if (a.is_available === b.is_available) {
        return a.name.localeCompare(b.name);
      }

      return a.is_available ? -1 : 1;
    });
  }, [availableUnits, filter, units]);

  if (units.length === 0) {
    return null;
  }

  return (
    <section id="units" className="border-t border-zinc-200 bg-zinc-50 px-4 py-14 md:py-20">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge
              variant="outline"
              className="mb-3 rounded-md border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              Multi-unit inventory
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
              Units in this property
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
              Compare floor plans, pricing, availability, and amenities without
              leaving the property page.
            </p>
          </div>

          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as UnitFilter)}
          >
            <TabsList className="grid h-10 w-full grid-cols-2 rounded-lg bg-white p-1 shadow-sm md:w-[240px]">
              <TabsTrigger value="available">
                Available ({availableUnits.length})
              </TabsTrigger>
              <TabsTrigger value="all">All ({units.length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {visibleUnits.length > 0 ? (
          <div className="grid gap-5">
            {visibleUnits.map((unit) => {
              const price = getUnitPriceDisplay(unit, currency);
              const availableFrom = formatAvailableFrom(unit.available_from);

              return (
                <Card
                  key={unit.id}
                  className="rounded-lg border-zinc-200 bg-white py-0 shadow-sm transition hover:shadow-md"
                >
                  <div className="grid md:grid-cols-[240px_1fr]">
                    <div className="relative min-h-52 bg-zinc-100 md:min-h-full">
                      {unit.thumbnail?.url ? (
                        <Image
                          src={unit.thumbnail.url}
                          alt={unit.name}
                          fill
                          sizes="(min-width: 768px) 240px, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-52 flex-col items-center justify-center text-zinc-300">
                          <ImageIcon className="mb-2 h-8 w-8" />
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </div>

                    <CardContent className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:items-start">
                      <div>
                        <div className="mb-3 flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="rounded-md border-zinc-200 text-zinc-600"
                          >
                            {formatUnitType(unit.unit_type)}
                          </Badge>
                          <Badge
                            className={
                              unit.is_available
                                ? "rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : "rounded-md bg-zinc-200 text-zinc-700 hover:bg-zinc-200"
                            }
                          >
                            {unit.is_available ? "Available" : "Occupied"}
                          </Badge>
                        </div>

                        <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
                          {unit.name}
                        </h3>
                        {unit.description && (
                          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
                            {unit.description}
                          </p>
                        )}

                        <div className="mt-5 flex flex-wrap gap-2 text-sm text-zinc-600">
                          {unit.bedrooms != null && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                              <Bed className="h-4 w-4 text-zinc-400" />
                              {unit.bedrooms} bed
                            </span>
                          )}
                          {unit.bathrooms != null && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                              <Bath className="h-4 w-4 text-zinc-400" />
                              {unit.bathrooms} bath
                            </span>
                          )}
                          {unit.square_feet != null && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                              <Maximize className="h-4 w-4 text-zinc-400" />
                              {unit.square_feet.toLocaleString()} sqft
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                            <Sofa className="h-4 w-4 text-zinc-400" />
                            {unit.is_furnished ? "Furnished" : "Unfurnished"}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                            <PawPrint className="h-4 w-4 text-zinc-400" />
                            {unit.is_pet_friendly ? "Pets ok" : "Ask pets"}
                          </span>
                          {availableFrom && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                              <CalendarDays className="h-4 w-4 text-zinc-400" />
                              {availableFrom}
                            </span>
                          )}
                        </div>

                        {unit.amenities && unit.amenities.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {unit.amenities.slice(0, 6).map((amenity) => (
                              <span
                                key={amenity}
                                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium capitalize text-emerald-700"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {amenity.replace(/_/g, " ")}
                              </span>
                            ))}
                            {unit.amenities.length > 6 && (
                              <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500">
                                +{unit.amenities.length - 6} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 lg:w-56">
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                          Unit price
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-zinc-950">
                          {price.text}
                          {price.suffix && (
                            <span className="ml-1 text-sm font-medium text-zinc-500">
                              {price.suffix}
                            </span>
                          )}
                        </p>
                        <Button className="mt-4 w-full" asChild>
                          <Link href={contactHref}>Inquire</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
            <h3 className="font-semibold text-zinc-950">
              No available units right now
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Switch to all units to view the full unit mix.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
