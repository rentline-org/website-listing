"use client";

import React from "react";

import { useMapContext } from "./map-provider";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Building2,
  BedDouble,
  CircleDollarSign,
  MapPin,
  Search,
  X,
} from "lucide-react";

export default function MapFilters() {
  const {
    allProperties,
    filteredProperties,

    searchQuery,
    setSearchQuery,

    propertyType,
    setPropertyType,

    priceInput,
    setPriceInput,

    minBedrooms,
    setMinBedrooms,

    city,
    setCity,

    citiesList,
  } = useMapContext();

  const hasFilters =
    searchQuery.trim() !== "" ||
    propertyType !== "all" ||
    priceInput.trim() !== "" ||
    minBedrooms > 0 ||
    city != null;

  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value);
    window.history.replaceState(null, "", `#${value}`);
    window.dispatchEvent(
      new CustomEvent("map-property-type-change", {
        detail: { propertyType: value },
      }),
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    handlePropertyTypeChange("all");
    setPriceInput("");
    setMinBedrooms(0);
    setCity(null);
  };

  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-10 md:inset-x-4">
      <div className="pointer-events-auto flex max-w-7xl flex-col gap-2 rounded-lg border border-zinc-200 bg-white/95 p-2 shadow-xl backdrop-blur-xl md:flex-row md:flex-wrap md:items-center">
        <div className="relative min-w-0 flex-1 md:min-w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search address, city, property, or amenity"
            className="h-10 bg-white pl-9"
          />
        </div>

        <div className="relative md:w-[176px]">
          <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

          <Input
            inputMode="numeric"
            placeholder="Max price"
            value={priceInput}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d]/g, "");
              setPriceInput(value);
            }}
            className="h-10 bg-white pl-9"
          />
        </div>

        <Select value={propertyType} onValueChange={handlePropertyTypeChange}>
          <SelectTrigger className="h-10 bg-white md:w-[166px]">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-zinc-500" />
              <SelectValue placeholder="Property Type" />
            </div>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            <SelectItem value="single_unit">Single Unit</SelectItem>
            <SelectItem value="multi_unit">Multi Unit</SelectItem>
            <SelectItem value="land">Land</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={minBedrooms.toString()}
          onValueChange={(value) => setMinBedrooms(parseInt(value, 10))}
        >
          <SelectTrigger className="h-10 bg-white md:w-[134px]">
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-zinc-500" />
              <SelectValue />
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

        <Select
          value={city ?? "all"}
          onValueChange={(value) => setCity(value === "all" ? null : value)}
        >
          <SelectTrigger className="h-10 bg-white md:w-[166px]">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-zinc-500" />
              <SelectValue placeholder="City" />
            </div>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>

            {citiesList.map((cityName) => (
              <SelectItem key={cityName} value={cityName}>
                {cityName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-between gap-2 md:ml-auto">
          <Badge
            variant="outline"
            className="h-8 rounded-md bg-white px-2.5 text-zinc-600"
          >
            {filteredProperties.length} / {allProperties.length} listings
          </Badge>

          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={resetFilters}
              aria-label="Reset map filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
