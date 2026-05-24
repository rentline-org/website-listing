"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  BedDouble,
  Bath,
  Ruler,
  MapPin,
} from "lucide-react";
import { IProperty, IUnitData } from "@/lib/types";
import Image from "next/image";
import { getPropertyIcon } from "@/lib/utils";

type Props = {
  map?: mapboxgl.Map;
  property: IProperty;
  selected: boolean;
  onSelect: (property: IProperty) => void;
};

function hasCoordinates(property: IProperty) {
  return property.longitude != null && property.latitude != null;
}

function formatFullPrice(price: number | null | undefined): string {
  if (price == null) return "Request";

  if (price >= 1000000) {
    return `$${(price / 1000000)
      .toFixed(price >= 10000000 ? 0 : 1)
      .replace(".0", "")}M`;
  }

  if (price >= 1000) {
    return `$${(price / 1000)
      .toFixed(price >= 100000 ? 0 : 1)
      .replace(".0", "")}K`;
  }

  return `$${price.toLocaleString()}`;
}

function getAvailableUnits(property: IProperty): IUnitData[] {
  return (property.units || []).filter((unit) => unit.is_available);
}

function getPrimaryUnit(property: IProperty): IUnitData | null {
  const available = getAvailableUnits(property);
  return available[0] || property.units?.[0] || null;
}

function getPropertyPrice(property: IProperty): number | null {
  if (property.sale_price != null) return property.sale_price;

  const primaryUnit = getPrimaryUnit(property);
  if (!primaryUnit) return null;

  return primaryUnit.sale_price ?? primaryUnit.rent_price ?? null;
}

function getPropertyThumbnail(property: IProperty): string | null {
  const primaryUnit = getPrimaryUnit(property);

  return (
    property.thumbnail?.url ||
    primaryUnit?.thumbnail?.url ||
    property.gallery_urls?.[0]?.url ||
    primaryUnit?.gallery_urls?.[0]?.url ||
    null
  );
}

function getMarkerTheme(propertyType: IProperty["property_type"]) {
  switch (propertyType) {
    case "multi_unit":
      return {
        label: "Multi Unit",
        primary: "#047857",
        stroke: "#a7f3d0",
        iconBg: "#047857",
      };
    case "land":
      return {
        label: "Land",
        primary: "#b45309",
        stroke: "#fde68a",
        iconBg: "#b45309",
      };
    case "single_unit":
    default:
      return {
        label: "Home",
        primary: "#18181b",
        stroke: "#e4e4e7",
        iconBg: "#18181b",
      };
  }
}

function getMarkerSummary(property: IProperty) {
  const primaryUnit = getPrimaryUnit(property);
  const availableUnits = getAvailableUnits(property);

  if (property.property_type === "multi_unit") {
    return `${availableUnits.length || property.units_count || 0} units available`;
  }

  if (property.property_type === "land") {
    return "Land listing";
  }

  const parts: string[] = [];

  if (primaryUnit?.bedrooms != null) parts.push(`${primaryUnit.bedrooms} beds`);
  if (primaryUnit?.bathrooms != null)
    parts.push(`${primaryUnit.bathrooms} baths`);
  if (primaryUnit?.square_feet != null) {
    parts.push(`${primaryUnit.square_feet.toLocaleString()} sqft`);
  }

  return parts.length > 0 ? parts.join(" · ") : "Home listing";
}

function getMarkerClass(selected: boolean) {
  return [
    "group select-none pointer-events-auto transition-transform duration-200",
    selected ? "z-50 " : "z-10 hover:scale-[1.01]",
  ].join(" ");
}

function MarkerView({
  property,
  selected,
}: {
  property: IProperty;
  selected: boolean;
}) {
  const Icon = getPropertyIcon(property.property_type);
  const price = getPropertyPrice(property);
  const priceLabel = formatFullPrice(price);
  const theme = getMarkerTheme(property.property_type);

  return (
    <button
      type="button"
      aria-label={`${property.title} marker`}
      className={getMarkerClass(selected)}
      tabIndex={-1}
    >
      <div className="relative flex flex-col items-center">
        <div className="relative transition-all duration-200 group-hover:-translate-y-0.5">
          <svg
            viewBox="0 0 120 150"
            className={[
              "h-29.5 w-23.5 drop-shadow-xl transition-all duration-200",
              selected ? "scale-105" : "group-hover:scale-[1.03]",
            ].join(" ")}
            aria-hidden="true"
          >
            <defs>
              <filter
                id="marker-shadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feDropShadow
                  dx="0"
                  dy="8"
                  stdDeviation="10"
                  floodOpacity="0.18"
                />
              </filter>
            </defs>

            <path
              filter="url(#marker-shadow)"
              d="M60 6C34.6 6 14 26.6 14 52c0 27.8 21.2 50.8 36.4 73.6 3.8 5.7 7.4 11.6 9.6 18.4 2.2-6.8 5.8-12.7 9.6-18.4C85.8 102.8 107 79.8 107 52 107 26.6 86.4 6 60 6Z"
              fill={selected ? theme.primary : "#ffffff"}
              stroke={selected ? theme.primary : theme.stroke}
              strokeWidth="2"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center pt-4">
            <div
              className={[
                "flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all duration-200",
                selected
                  ? "border-white bg-white text-zinc-900"
                  : "text-white",
              ].join(" ")}
              style={
                selected
                  ? undefined
                  : {
                      backgroundColor: theme.iconBg,
                      borderColor: theme.iconBg,
                    }
              }
            >
              <div className="scale-[0.9]">
                {React.cloneElement(Icon, {
                  className: "h-5 w-5",
                })}
              </div>
            </div>

            <div className="mt-3 flex flex-col items-center px-3 text-center">
              <span
                className={[
                  "text-[15px] leading-none font-black tracking-tight",
                  selected ? "text-white" : "text-zinc-900",
                ].join(" ")}
              >
                {priceLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
function PropertyPopup({ property }: { property: IProperty }) {
  const thumbnail = getPropertyThumbnail(property);
  const primaryUnit = getPrimaryUnit(property);
  const price = getPropertyPrice(property);
  const summary = getMarkerSummary(property);
  const theme = getMarkerTheme(property.property_type);

  // const locationLine = [property.city, property.state, property.country]
  //   .filter(Boolean)
  //   .join(", ");

  return (
    <div className="w-[320px] max-w-[320px] bg-none">
      <Card className="overflow-hidden border-zinc-200 shadow-xl">
        <div className="flex gap-3 p-3">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={property.title}
                width={400}
                height={400}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-300">
                <Home className="h-7 w-7" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {theme.label}
                </p>
                <h4 className="mt-1 truncate text-sm font-bold text-zinc-900">
                  {property.title}
                </h4>
              </div>

              <Badge
                className="shrink-0 rounded-full border text-[10px] text-white"
                style={{
                  backgroundColor: theme.primary,
                  borderColor: theme.primary,
                }}
              >
                {price != null ? `$${price.toLocaleString()}` : "Request"}
              </Badge>
            </div>

            <p className="mt-1 flex items-center gap-1 truncate text-xs text-zinc-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {/* {locationLine || property.address} */}
                {property.address}, {property.address_number}
              </span>
            </p>

            <p className="mt-2 text-xs font-medium text-zinc-700 line-clamp-2">
              {summary}
            </p>
          </div>
        </div>

        <Separator />

        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-2 text-xs text-zinc-600">
            <div className="rounded-lg bg-zinc-50 px-2 py-2 text-center">
              <BedDouble className="mx-auto mb-1 h-4 w-4 text-zinc-400" />
              <div className="font-semibold text-zinc-900">
                {primaryUnit?.bedrooms != null ? primaryUnit.bedrooms : "—"}
              </div>
              <div>Bedrooms</div>
            </div>

            <div className="rounded-lg bg-zinc-50 px-2 py-2 text-center">
              <Bath className="mx-auto mb-1 h-4 w-4 text-zinc-400" />
              <div className="font-semibold text-zinc-900">
                {primaryUnit?.bathrooms != null ? primaryUnit.bathrooms : "—"}
              </div>
              <div>Bathrooms</div>
            </div>

            <div className="rounded-lg bg-zinc-50 px-2 py-2 text-center">
              <Ruler className="mx-auto mb-1 h-4 w-4 text-zinc-400" />
              <div className="font-semibold text-zinc-900">
                {primaryUnit?.square_feet != null
                  ? primaryUnit.square_feet.toLocaleString()
                  : "—"}
              </div>
              <div>Sqft</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PropertyMarker({
  map,
  property,
  selected,
  onSelect,
}: Props) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const rootRef = useRef<Root | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const popupRootRef = useRef<Root | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const price = getPropertyPrice(property);
  const popupLngLat = useMemo(
    () =>
      [property.longitude as number, property.latitude as number] as [
        number,
        number,
      ],
    [property.longitude, property.latitude],
  );

  const cancelClose = () => {
    if (closeTimerRef.current != null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      popupRef.current?.remove();
    }, 120);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!map || !hasCoordinates(property) || markerRef.current) return;

    const markerContainer = document.createElement("div");
    rootRef.current = createRoot(markerContainer);

    const marker = new mapboxgl.Marker({
      element: markerContainer,
      anchor: "center",
    })
      .setLngLat(popupLngLat)
      .addTo(map);

    markerRef.current = marker;

    const popupContainer = document.createElement("div");
    popupRootRef.current = createRoot(popupContainer);

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      closeOnMove: false,
      offset: 18,
      maxWidth: "340px",
      className: "bg-transparen",
    }).setDOMContent(popupContainer);

    popupRef.current = popup;
    const popupEl = popupRef.current.getElement();

    popupEl?.classList.add("bg-transparent border-none");

    const openPopup = () => {
      cancelClose();
      if (!popupRef.current || !map) return;
      popupRef.current.setLngLat(popupLngLat).addTo(map);

      if (popupEl) {
        popupEl.addEventListener("mouseenter", cancelClose);
        popupEl.addEventListener("mouseleave", scheduleClose);
      }
    };

    const closePopup = () => {
      scheduleClose();
    };

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      onSelect(property);
    };

    markerContainer.addEventListener("mouseenter", openPopup);
    markerContainer.addEventListener("mouseleave", closePopup);
    markerContainer.addEventListener("click", handleClick);

    return () => {
      cancelClose();

      markerContainer.removeEventListener("mouseenter", openPopup);
      markerContainer.removeEventListener("mouseleave", closePopup);
      markerContainer.removeEventListener("click", handleClick);
      if (popupEl) {
        popupEl.removeEventListener("mouseenter", cancelClose);
        popupEl.removeEventListener("mouseleave", scheduleClose);
      }

      popupRef.current?.remove();

      const popupRoot = popupRootRef.current;
      const markerRoot = rootRef.current;

      popupRef.current = null;
      popupRootRef.current = null;
      rootRef.current = null;
      markerRef.current = null;

      marker.remove();

      queueMicrotask(() => {
        popupRoot?.unmount();
        markerRoot?.unmount();
      });
    };
  }, [map, onSelect, popupLngLat, property, property.id, scheduleClose]);

  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.render(
        <MarkerView property={property} selected={selected} />,
      );
    }

    if (popupRootRef.current) {
      popupRootRef.current.render(<PropertyPopup property={property} />);
    }
  }, [property, selected, price]);

  return null;
}
