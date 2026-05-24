import { formatPrice } from "./format";
import type { IGalleryMedia, IProperty, IUnitData } from "./types";

export type ListingIntent = "all" | "buy" | "rent";

export function getAvailableUnits(property: IProperty): IUnitData[] {
  return (property.units || []).filter((unit) => unit.is_available);
}

export function getPrimaryUnit(property: IProperty): IUnitData | null {
  const availableUnit = getAvailableUnits(property)[0];
  return availableUnit || property.units?.[0] || null;
}

export function getPropertyGallery(property: IProperty): IGalleryMedia[] {
  const isMultiUnit = property.property_type === "multi_unit";
  const primaryUnit = getPrimaryUnit(property);
  let gallery = property.gallery_urls || [];

  if (gallery.length === 0 && property.thumbnail) {
    gallery = [
      {
        id: property.thumbnail.id,
        url: property.thumbnail.url,
        name: property.title,
      },
    ];
  }

  if (gallery.length === 0 && !isMultiUnit && primaryUnit?.gallery_urls) {
    gallery = primaryUnit.gallery_urls;
  }

  if (gallery.length === 0 && !isMultiUnit && primaryUnit?.thumbnail) {
    gallery = [
      {
        id: primaryUnit.thumbnail.id,
        url: primaryUnit.thumbnail.url,
        name: primaryUnit.name,
      },
    ];
  }

  return gallery;
}

export function getPropertyThumbnailUrl(property: IProperty): string | null {
  const primaryUnit = getPrimaryUnit(property);

  if (property.property_type === "multi_unit") {
    return property.thumbnail?.url || primaryUnit?.thumbnail?.url || null;
  }

  return primaryUnit?.thumbnail?.url || property.thumbnail?.url || null;
}

export function getHeroImageUrl(properties: IProperty[]): string | null {
  return (
    properties
      .map((property) => getPropertyGallery(property)[0]?.url)
      .find(Boolean) || null
  );
}

export function getLocationLabel(property: IProperty): string {
  return [property.city, property.state].filter(Boolean).join(", ");
}

export function getUnitPriceDisplay(
  unit: IUnitData,
  currency = "USD",
): { text: string; suffix: string | null } {
  if (unit.rent_price != null) {
    return { text: formatPrice(unit.rent_price, currency), suffix: "/mo" };
  }

  if (unit.sale_price != null) {
    return { text: formatPrice(unit.sale_price, currency), suffix: null };
  }

  return { text: "Price on request", suffix: null };
}

export function getPropertyPriceForIntent(
  property: IProperty,
  intent: ListingIntent,
): number | null {
  const availableUnits = getAvailableUnits(property);

  if (intent === "buy") {
    if (property.sale_price != null) {
      return property.sale_price;
    }

    const salePrices = availableUnits
      .map((unit) => unit.sale_price)
      .filter((price): price is number => price != null);

    return salePrices.length ? Math.min(...salePrices) : null;
  }

  if (intent === "rent") {
    const rentPrices = availableUnits
      .map((unit) => unit.rent_price)
      .filter((price): price is number => price != null);

    return rentPrices.length ? Math.min(...rentPrices) : null;
  }

  const salePrice = getPropertyPriceForIntent(property, "buy");
  const rentPrice = getPropertyPriceForIntent(property, "rent");

  return salePrice ?? rentPrice;
}

export function propertyMatchesIntent(
  property: IProperty,
  intent: ListingIntent,
): boolean {
  if (intent === "all") {
    return true;
  }

  return getPropertyPriceForIntent(property, intent) != null;
}

export function getPropertySearchText(property: IProperty): string {
  const unitsText = (property.units || [])
    .flatMap((unit) => [
      unit.name,
      unit.description,
      unit.unit_type,
      ...(unit.amenities || []),
    ])
    .filter(Boolean)
    .join(" ");

  return [
    property.title,
    property.description,
    property.address,
    property.full_address,
    property.city,
    property.state,
    property.postal_code,
    property.property_type,
    unitsText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function getBedroomCount(property: IProperty): number | null {
  const bedroomCounts = (property.units || [])
    .map((unit) => unit.bedrooms)
    .filter((bedrooms): bedrooms is number => bedrooms != null);

  return bedroomCounts.length ? Math.max(...bedroomCounts) : null;
}

export function getBathroomCount(property: IProperty): number | null {
  const bathroomCounts = (property.units || [])
    .map((unit) => unit.bathrooms)
    .filter((bathrooms): bathrooms is number => bathrooms != null);

  return bathroomCounts.length ? Math.max(...bathroomCounts) : null;
}

export function getSquareFeetRange(property: IProperty): string | null {
  const sizes = (property.units || [])
    .map((unit) => unit.square_feet)
    .filter((size): size is number => size != null)
    .sort((a, b) => a - b);

  if (!sizes.length) {
    return null;
  }

  const min = sizes[0];
  const max = sizes[sizes.length - 1];

  if (min === max) {
    return min.toLocaleString();
  }

  return `${min.toLocaleString()}-${max.toLocaleString()}`;
}

export function getAvailableCities(properties: IProperty[]): string[] {
  return [
    ...new Set(
      properties.map((property) => property.city?.trim()).filter(Boolean),
    ),
  ].sort();
}

export function formatAvailableFrom(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
