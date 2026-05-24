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

import { Building2, BedDouble, DollarSign, Home, MapPin } from "lucide-react";

export default function MapFilters() {
  const {
    propertyType,
    setPropertyType,

    listingMode,
    setListingMode,

    priceInput,
    setPriceInput,

    minBedrooms,
    setMinBedrooms,

    city,
    setCity,

    citiesList,
  } = useMapContext();

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-3 pointer-events-auto max-w-[calc(100vw-2rem)]">
      <Select
        value={listingMode}
        onValueChange={(v) => setListingMode(v as "sale" | "rent")}
      >
        <SelectTrigger className="h-11 w-[130px] rounded-full bg-white shadow-lg border-zinc-200">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-zinc-500" />
            <SelectValue />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="sale">For Sale</SelectItem>
          <SelectItem value="rent">For Rent</SelectItem>
        </SelectContent>
      </Select>

      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />

        <Input
          inputMode="numeric"
          placeholder={
            listingMode === "sale" ? "Max sale price" : "Max monthly rent"
          }
          value={priceInput}
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d]/g, "");
            setPriceInput(value);
          }}
          className="h-11 w-[180px] rounded-full bg-white pl-9 shadow-lg border-zinc-200"
        />
      </div>

      <Select value={propertyType} onValueChange={setPropertyType}>
        <SelectTrigger className="h-11 w-[170px] rounded-full bg-white shadow-lg border-zinc-200">
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
        <SelectTrigger className="h-11 w-[140px] rounded-full bg-white shadow-lg border-zinc-200">
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
        <SelectTrigger className="h-11 w-[170px] rounded-full bg-white shadow-lg border-zinc-200">
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
    </div>
  );
}
