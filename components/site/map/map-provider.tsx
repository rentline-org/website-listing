"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { IProperty } from "@/lib/types";

type ListingMode = "sale" | "rent";

interface MapContextType {
  allProperties: IProperty[];
  filteredProperties: IProperty[];

  selectedProperty: IProperty | null;
  setSelectedProperty: (prop: IProperty | null) => void;

  orgCountry: string;

  propertyType: string;
  setPropertyType: (type: string) => void;

  listingMode: ListingMode;
  setListingMode: (mode: ListingMode) => void;

  priceInput: string;
  setPriceInput: (value: string) => void;

  minBedrooms: number;
  setMinBedrooms: (beds: number) => void;

  city: string | null;
  setCity: (city: string | null) => void;

  citiesList: string[];
}

const MapContext = createContext<MapContextType | undefined>(undefined);

function getPropertyPrice(
  property: IProperty,
  mode: ListingMode,
): number | null {
  if (mode === "sale") {
    if (property.sale_price != null) {
      return property.sale_price;
    }

    const saleUnit = property.units?.find(
      (u) => u.is_available && u.sale_price != null,
    );

    return saleUnit?.sale_price ?? null;
  }

  const rentUnit = property.units?.find(
    (u) => u.is_available && u.rent_price != null,
  );

  return rentUnit?.rent_price ?? null;
}

export function MapProvider({
  properties,
  orgCountry,
  children,
}: {
  properties: IProperty[];
  orgCountry: string;
  children: ReactNode;
}) {
  const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(
    null,
  );

  const [propertyType, setPropertyType] = useState("all");

  const [listingMode, setListingMode] = useState<ListingMode>("sale");

  const [priceInput, setPriceInput] = useState("");

  const [minBedrooms, setMinBedrooms] = useState(0);

  const [city, setCity] = useState<string | null>(null);

  const citiesList = useMemo(() => {
    return [
      ...new Set(properties.map((p) => p.city?.trim()).filter(Boolean)),
    ].sort();
  }, [properties]);

  const filteredProperties = useMemo(() => {
    const parsedPrice = Number(priceInput.replace(/,/g, ""));

    return properties.filter((property) => {
      if (propertyType !== "all" && property.property_type !== propertyType) {
        return false;
      }

      if (city && property.city !== city) {
        return false;
      }

      if (minBedrooms > 0) {
        const hasMatchingBedroom = property.units?.some(
          (unit) => unit.is_available && (unit.bedrooms ?? 0) >= minBedrooms,
        );

        if (!hasMatchingBedroom) {
          return false;
        }
      }

      if (priceInput.trim() !== "" && !Number.isNaN(parsedPrice)) {
        const price = getPropertyPrice(property, listingMode);

        if (price == null || price > parsedPrice) {
          return false;
        }
      }

      return true;
    });
  }, [properties, propertyType, listingMode, priceInput, minBedrooms, city]);

  return (
    <MapContext.Provider
      value={{
        allProperties: properties,
        filteredProperties,

        selectedProperty,
        setSelectedProperty,

        orgCountry,

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
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }

  return context;
}
