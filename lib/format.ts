import { IProperty, IUnitData } from "./types";

/**
 * Format a price with currency symbol
 */
export function formatPrice(
  price: number | null | undefined,
  currency: string = "USD"
): string {
  if (price == null) return "Price on request";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Get the display price for a property - handles single vs multi-unit
 */
export function getPropertyPriceDisplay(
  property: IProperty,
  currency: string = "USD"
): { text: string; suffix: string | null } {
  if (property.sale_price) {
    return { text: formatPrice(property.sale_price, currency), suffix: null };
  }

  const units = property.units || [];
  const availableUnits = units.filter((u) => u.is_available);
  const rentPrices = availableUnits
    .map((u) => u.rent_price)
    .filter((p): p is number => p != null);
  const salePrices = availableUnits
    .map((u) => u.sale_price)
    .filter((p): p is number => p != null);

  if (rentPrices.length > 0) {
    const minRent = Math.min(...rentPrices);
    if (property.property_type === "multi_unit" && rentPrices.length > 1) {
      return { text: `From ${formatPrice(minRent, currency)}`, suffix: "/mo" };
    }
    return { text: formatPrice(minRent, currency), suffix: "/mo" };
  }

  if (salePrices.length > 0) {
    const minSale = Math.min(...salePrices);
    if (property.property_type === "multi_unit" && salePrices.length > 1) {
      return { text: `From ${formatPrice(minSale, currency)}`, suffix: null };
    }
    return { text: formatPrice(minSale, currency), suffix: null };
  }

  return { text: "Price on request", suffix: null };
}

/**
 * Format property type for display
 */
export function formatPropertyType(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Format unit type for display
 */
export function formatUnitType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Get available units count
 */
export function getAvailableUnitsCount(property: IProperty): number {
  return (property.units || []).filter((u) => u.is_available).length;
}

/**
 * Format a full address
 */
export function formatAddress(property: IProperty): string {
  const parts = [property.address, property.city, property.state].filter(
    Boolean
  );
  if (property.postal_code) parts.push(property.postal_code);
  return parts.join(", ");
}

/**
 * Get the unit summary stats (aggregate bedrooms, bathrooms, sqft)
 */
export function getUnitSummary(unit: IUnitData): {
  bedrooms: number | null;
  bathrooms: number | null;
  sqft: number | null;
} {
  return {
    bedrooms: unit.bedrooms ?? null,
    bathrooms: unit.bathrooms ?? null,
    sqft: unit.square_feet ?? null,
  };
}
