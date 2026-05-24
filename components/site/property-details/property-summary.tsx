import {
  Bath,
  Bed,
  CheckCircle2,
  Home,
  Layers,
  MapPin,
  Maximize,
  PawPrint,
  Sofa,
} from "lucide-react";
import type { ElementType } from "react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  formatAddress,
  formatPropertyType,
  formatUnitType,
  getAvailableUnitsCount,
} from "@/lib/format";
import {
  getBathroomCount,
  getBedroomCount,
  getPrimaryUnit,
  getSquareFeetRange,
} from "@/lib/property";
import type { IProperty } from "@/lib/types";

interface PropertySummaryProps {
  property: IProperty;
}

function FactItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {label}
        </p>
        <p className="mt-1 font-semibold text-zinc-950">{value}</p>
      </div>
    </div>
  );
}

export default function PropertySummary({ property }: PropertySummaryProps) {
  const isMultiUnit = property.property_type === "multi_unit";
  const primaryUnit = getPrimaryUnit(property);
  const availableUnits = getAvailableUnitsCount(property);
  const bedrooms = getBedroomCount(property);
  const bathrooms = getBathroomCount(property);
  const squareFeet = getSquareFeetRange(property);
  const amenities = primaryUnit?.amenities || [];

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge className="rounded-md bg-zinc-950 text-white hover:bg-zinc-950">
            {formatPropertyType(property.property_type)}
          </Badge>
          {isMultiUnit ? (
            <Badge
              variant="outline"
              className="rounded-md border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              <Layers className="h-3.5 w-3.5" />
              {availableUnits} available units
            </Badge>
          ) : (
            primaryUnit?.is_available && (
              <Badge className="rounded-md bg-emerald-600 text-white hover:bg-emerald-600">
                Available
              </Badge>
            )
          )}
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
          {property.title}
        </h1>
        <p className="mt-4 flex items-start gap-2 text-base leading-7 text-zinc-600">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-zinc-400" />
          {formatAddress(property)}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {isMultiUnit && (
          <FactItem
            icon={Layers}
            label="Units"
            value={property.units?.length || 0}
          />
        )}
        {!isMultiUnit && primaryUnit?.unit_type && (
          <FactItem
            icon={Home}
            label="Unit Type"
            value={formatUnitType(primaryUnit.unit_type)}
          />
        )}
        {bedrooms != null && (
          <FactItem icon={Bed} label="Bedrooms" value={`${bedrooms}+`} />
        )}
        {bathrooms != null && (
          <FactItem icon={Bath} label="Bathrooms" value={`${bathrooms}+`} />
        )}
        {squareFeet && (
          <FactItem icon={Maximize} label="Sq Ft" value={squareFeet} />
        )}
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Property details
        </h2>
        <p className="mt-4 whitespace-pre-line text-base leading-8 text-zinc-600">
          {property.description ||
            "No description is available for this property yet."}
        </p>
      </div>

      {!isMultiUnit && primaryUnit && (
        <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
            <h3 className="font-semibold text-zinc-950">Lifestyle notes</h3>
            <div className="mt-4 grid gap-3 text-sm text-zinc-600">
              <div className="flex items-center gap-3">
                <Sofa className="h-4 w-4 text-zinc-500" />
                {primaryUnit.is_furnished ? "Furnished" : "Unfurnished"}
              </div>
              <div className="flex items-center gap-3">
                <PawPrint className="h-4 w-4 text-zinc-500" />
                {primaryUnit.is_pet_friendly
                  ? "Pet friendly"
                  : "Pets by approval"}
              </div>
            </div>
          </div>

          {amenities.length > 0 && (
            <div className="rounded-lg border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold text-zinc-950">Amenities</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {amenities.slice(0, 8).map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 text-sm text-zinc-600"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="capitalize">
                      {amenity.replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
