"use client";

import React, { useMemo, useState } from "react";
import { useMapContext } from "./map-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import {
  X,
  Bed,
  Bath,
  Maximize,
  Layers,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPropertyIcon } from "@/lib/utils";
import { IOrganizationData } from "@/lib/types";
import { formatMoney } from "@/lib/countries";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PropertyDetailPanel({
  organization,
}: {
  subdomain: string;
  organization: IOrganizationData;
}) {
  const { selectedProperty, setSelectedProperty } = useMapContext();
  const [showMore, setShowMore] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const open = !!selectedProperty;

  const gallery = useMemo(() => {
    if (!selectedProperty) return [];

    const isMultiUnit = selectedProperty.property_type === "multi_unit";
    const units = selectedProperty.units || [];
    const firstUnit = units[0];

    let images = selectedProperty.gallery_urls || [];

    if (images.length === 0 && selectedProperty.thumbnail) {
      images = [
        {
          id: selectedProperty.thumbnail.id,
          url: selectedProperty.thumbnail.url,
          name: "Thumbnail",
        },
      ];
    }

    if (images.length === 0 && !isMultiUnit && firstUnit?.gallery_urls) {
      images = firstUnit.gallery_urls;
    }

    if (images.length === 0 && !isMultiUnit && firstUnit?.thumbnail) {
      images = [
        {
          id: firstUnit.thumbnail.id,
          url: firstUnit.thumbnail.url,
          name: "Unit Thumbnail",
        },
      ];
    }

    return images;
  }, [selectedProperty]);

  if (!selectedProperty) return null;

  const isMultiUnit = selectedProperty.property_type === "multi_unit";
  const units = selectedProperty.units || [];
  const firstUnit = units[0];
  const mainImage = gallery[currentImageIndex]?.url;
  const thumbnails = gallery.slice(0, 6);

  const nextImage = () => {
    if (!gallery.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    if (!gallery.length) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + gallery.length) % gallery.length,
    );
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setSelectedProperty(null);
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 gap-0">
        <div className="h-full flex flex-col">
          <div className="relative shrink-0 bg-zinc-900">
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white backdrop-blur-sm transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <Badge
                className=" capitalize backdrop-blur-sm text-xs font-semibold"
                variant="default"
              >
                {getPropertyIcon(selectedProperty.property_type)}
                {isMultiUnit
                  ? "Multi Unit"
                  : selectedProperty.property_type === "single_unit"
                    ? firstUnit?.unit_type || "Home"
                    : "Land"}
              </Badge>
              {isMultiUnit && selectedProperty.sale_price && (
                <Badge variant="secondary">{selectedProperty.sale_price}</Badge>
              )}
              {!isMultiUnit && firstUnit?.sale_price && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary">
                      {formatMoney(firstUnit.sale_price, organization.country)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Purchase Price</TooltipContent>
                </Tooltip>
              )}
              {!isMultiUnit && firstUnit?.rent_price && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary">
                      {formatMoney(firstUnit.rent_price, organization.country)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Rent Price</TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className="relative h-64 md:h-80 w-full overflow-hidden">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={selectedProperty.title || "Property"}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500 bg-zinc-100">
                  No Image Available
                </div>
              )}

              {gallery.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-zinc-700" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-zinc-700" />
                  </button>

                  <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    {currentImageIndex + 1} / {gallery.length}
                  </div>
                </>
              )}
            </div>

            {thumbnails.length > 1 && (
              <div className="flex gap-1 p-2 bg-zinc-900 overflow-x-auto">
                {thumbnails.map((img, i) => (
                  <button
                    key={img.id || `thumb-${i}`}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${
                      currentImageIndex === i
                        ? "border-indigo-500"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    {img.url ? (
                      <Image
                        src={img.url}
                        alt={img.name || `Photo ${i + 1}`}
                        width={160}
                        height={120}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-700" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              <SheetHeader className="text-left p-0">
                <Button variant="link" className="px-0 w-fit" asChild>
                  <Link
                    href={`/properties/${selectedProperty.slug}`}
                    className=""
                  >
                    View full property details{" "}
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
                <SheetDescription className="text-zinc-600 text-sm font-medium">
                  <span className="text-indigo-600">📍</span>{" "}
                  {selectedProperty.full_address}
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-wrap gap-2">
                {!isMultiUnit && firstUnit ? (
                  <>
                    {firstUnit.bedrooms != null && (
                      <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-200 text-sm text-zinc-700">
                        <Bed className="w-4 h-4 text-zinc-400" />
                        <span className="font-semibold">
                          {firstUnit.bedrooms}
                        </span>
                        beds
                      </div>
                    )}
                    {firstUnit.bathrooms != null && (
                      <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-200 text-sm text-zinc-700">
                        <Bath className="w-4 h-4 text-zinc-400" />
                        <span className="font-semibold">
                          {firstUnit.bathrooms}
                        </span>
                        baths
                      </div>
                    )}
                    {firstUnit.square_feet != null && (
                      <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-200 text-sm text-zinc-700">
                        <Maximize className="w-4 h-4 text-zinc-400" />
                        <span className="font-semibold">
                          {firstUnit.square_feet.toLocaleString()}
                        </span>
                        sqft
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-200 text-sm text-zinc-700">
                    <Layers className="w-4 h-4 text-zinc-400" />
                    <span className="font-semibold">{units.length}</span> units
                  </div>
                )}
              </div>

              <Separator />

              {!isMultiUnit &&
                firstUnit?.amenities &&
                firstUnit.amenities.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 mb-3">
                      Features & Amenities
                    </h3>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                      {firstUnit.amenities.slice(0, 8).map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-2 text-sm text-zinc-600"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                          <span className="capitalize">
                            {amenity.replace(/_/g, " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div>
                <h3 className="text-base font-bold text-zinc-900 mb-2">
                  Description
                </h3>
                <p
                  className={`text-zinc-600 text-sm leading-relaxed ${
                    !showMore ? "line-clamp-4" : ""
                  }`}
                >
                  {selectedProperty.description ||
                    "No description available for this property."}
                </p>

                {selectedProperty.description &&
                  selectedProperty.description.length > 150 && (
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowMore(!showMore)}
                      className="px-0 text-indigo-600 hover:text-indigo-700 text-sm font-semibold mt-2"
                    >
                      {showMore ? "Show less" : "Show more"}
                    </Button>
                  )}
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-zinc-200 bg-white  gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgb(0_0_0/0.05)]">
            <Button className="w-full font-semibold py-6" size="lg" asChild>
              <Link
                href={`/contact?property=${selectedProperty.slug}`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
