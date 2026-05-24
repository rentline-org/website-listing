"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowUpDown,
  BedDouble,
  Building2,
  CircleDollarSign,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import PropertyCard from "@/components/site/property-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROPERTY_TYPES } from "@/lib/constants";
import {
  getAvailableCities,
  getBedroomCount,
  getPropertyPriceForIntent,
  getPropertySearchText,
} from "@/lib/property";
import type { IProperty } from "@/lib/types";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

interface PropertySearchCatalogProps {
  properties: IProperty[];
  currency?: string;
}

function parseNumericInput(value: string): number | null {
  const parsed = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export default function PropertySearchCatalog({
  properties,
  currency = "USD",
}: PropertySearchCatalogProps) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [minBeds, setMinBeds] = useState("0");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const cities = useMemo(() => getAvailableCities(properties), [properties]);
  const hasFilters =
    query.trim() !== "" ||
    city !== "all" ||
    propertyType !== "all" ||
    minBeds !== "0" ||
    maxPrice.trim() !== "";

  const filteredProperties = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const numericMaxPrice = parseNumericInput(maxPrice);
    const minBedroomCount = Number(minBeds);

    const matches = properties.filter((property) => {
      if (city !== "all" && property.city !== city) {
        return false;
      }

      if (
        propertyType !== "all" &&
        property.property_type !== propertyType
      ) {
        return false;
      }

      if (
        minBedroomCount > 0 &&
        (getBedroomCount(property) || 0) < minBedroomCount
      ) {
        return false;
      }

      if (numericMaxPrice != null) {
        const price = getPropertyPriceForIntent(property, "all");
        if (price == null || price > numericMaxPrice) {
          return false;
        }
      }

      if (
        normalizedQuery &&
        !getPropertySearchText(property).includes(normalizedQuery)
      ) {
        return false;
      }

      return true;
    });

    return matches.sort((a, b) => {
      if (sort === "newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      if (sort === "price-asc" || sort === "price-desc") {
        const priceA = getPropertyPriceForIntent(a, "all") ?? Infinity;
        const priceB = getPropertyPriceForIntent(b, "all") ?? Infinity;

        return sort === "price-asc" ? priceA - priceB : priceB - priceA;
      }

      return 0;
    });
  }, [city, maxPrice, minBeds, properties, propertyType, query, sort]);

  const resetFilters = () => {
    setQuery("");
    setCity("all");
    setPropertyType("all");
    setMinBeds("0");
    setMaxPrice("");
    setSort("featured");
  };

  return (
    <section id="listings" className="bg-white px-4 py-14 md:py-20">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-3 rounded-md border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              Portfolio
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
              Find the right property faster
            </h2>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              Search by neighborhood, address, amenities, price, or property
              type without leaving the listing grid.
            </p>
          </div>

          <Badge
            variant="secondary"
            className="w-fit rounded-md bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700"
          >
            {filteredProperties.length} of {properties.length} listings
          </Badge>
        </div>

        <div className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-3 shadow-sm md:p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search city, address, feature, or listing name"
                className="h-10 bg-white pl-9"
              />
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-10 bg-white">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-zinc-400" />
                  <SelectValue placeholder="City" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((cityName) => (
                  <SelectItem key={cityName} value={cityName}>
                    {cityName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-10 bg-white">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-zinc-400" />
                  <SelectValue placeholder="Property type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={PROPERTY_TYPES.SINGLE_UNIT}>
                  Single Unit
                </SelectItem>
                <SelectItem value={PROPERTY_TYPES.MULTI_UNIT}>
                  Multi Unit
                </SelectItem>
                <SelectItem value={PROPERTY_TYPES.LAND}>Land</SelectItem>
              </SelectContent>
            </Select>

            <Select value={minBeds} onValueChange={setMinBeds}>
              <SelectTrigger className="h-10 bg-white">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-zinc-400" />
                  <SelectValue placeholder="Beds" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any Beds</SelectItem>
                <SelectItem value="1">1+ Beds</SelectItem>
                <SelectItem value="2">2+ Beds</SelectItem>
                <SelectItem value="3">3+ Beds</SelectItem>
                <SelectItem value="4">4+ Beds</SelectItem>
                <SelectItem value="5">5+ Beds</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                inputMode="numeric"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(event.target.value.replace(/[^\d]/g, ""))
                }
                placeholder="Max price"
                className="h-10 bg-white pl-9"
              />
            </div>

            <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
              <SelectTrigger className="h-10 bg-white">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-zinc-400" />
                  <SelectValue placeholder="Sort" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price Low to High</SelectItem>
                <SelectItem value="price-desc">Price High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasFilters && (
            <div className="mt-3 flex justify-end">
              <Button type="button" variant="ghost" onClick={resetFilters}>
                <X className="h-4 w-4" />
                Reset filters
              </Button>
            </div>
          )}
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                currency={currency}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-zinc-950">
              No matching listings
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Try clearing a filter or broadening your search terms.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="mt-5"
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
