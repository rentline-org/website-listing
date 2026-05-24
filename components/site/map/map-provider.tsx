"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { IProperty } from "@/lib/types";
import {
  getAvailableCities,
  getPropertyPriceForIntent,
  getPropertySearchText,
} from "@/lib/property";

interface MapContextType {
  allProperties: IProperty[];
  filteredProperties: IProperty[];

  selectedProperty: IProperty | null;
  setSelectedProperty: (prop: IProperty | null) => void;

  orgCountry: string;

  propertyType: string;
  setPropertyType: (type: string) => void;

  priceInput: string;
  setPriceInput: (value: string) => void;

  searchQuery: string;
  setSearchQuery: (value: string) => void;

  minBedrooms: number;
  setMinBedrooms: (beds: number) => void;

  city: string | null;
  setCity: (city: string | null) => void;

  citiesList: string[];
}

const MapContext = createContext<MapContextType | undefined>(undefined);

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

  const [priceInput, setPriceInput] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [minBedrooms, setMinBedrooms] = useState(0);

  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "");

      if (
        hash === "all" ||
        hash === "single_unit" ||
        hash === "multi_unit" ||
        hash === "land"
      ) {
        setPropertyType(hash);
      }
    };

    const handlePropertyTypeChange = (event: Event) => {
      const nextPropertyType = (
        event as CustomEvent<{ propertyType?: string }>
      ).detail?.propertyType;

      if (
        nextPropertyType === "all" ||
        nextPropertyType === "single_unit" ||
        nextPropertyType === "multi_unit" ||
        nextPropertyType === "land"
      ) {
        setPropertyType(nextPropertyType);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("map-property-type-change", handlePropertyTypeChange);

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener(
        "map-property-type-change",
        handlePropertyTypeChange,
      );
    };
  }, []);

  const citiesList = useMemo(() => {
    return getAvailableCities(properties);
  }, [properties]);

  const filteredProperties = useMemo(() => {
    const parsedPrice = Number(priceInput.replace(/,/g, ""));
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return properties.filter((property) => {
      if (
        normalizedSearchQuery &&
        !getPropertySearchText(property).includes(normalizedSearchQuery)
      ) {
        return false;
      }

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
        const price = getPropertyPriceForIntent(property, "all");

        if (price == null || price > parsedPrice) {
          return false;
        }
      }

      return true;
    });
  }, [
    properties,
    propertyType,
    priceInput,
    searchQuery,
    minBedrooms,
    city,
  ]);

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

        priceInput,
        setPriceInput,

        searchQuery,
        setSearchQuery,

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
