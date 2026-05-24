import Link from "next/link";
import { CalendarDays, Layers, MessageCircle, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPropertyPriceDisplay, getAvailableUnitsCount } from "@/lib/format";
import { getAvailableUnits, getPrimaryUnit } from "@/lib/property";
import type { IProperty } from "@/lib/types";

interface PropertyInquiryCardProps {
  property: IProperty;
  currency?: string;
}

export default function PropertyInquiryCard({
  property,
  currency = "USD",
}: PropertyInquiryCardProps) {
  const priceDisplay = getPropertyPriceDisplay(property, currency);
  const isMultiUnit = property.property_type === "multi_unit";
  const primaryUnit = getPrimaryUnit(property);
  const availableUnits = getAvailableUnits(property);
  const contactHref = `/contact?property=${property.slug}`;

  return (
    <Card className="sticky top-24 rounded-lg border-zinc-200 bg-white shadow-sm">
      <CardContent className="space-y-5 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Asking price
          </p>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
            {priceDisplay.text}
            {priceDisplay.suffix && (
              <span className="ml-1 text-base font-medium text-zinc-500">
                {priceDisplay.suffix}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-3 rounded-lg bg-zinc-50 p-4 text-sm">
          {isMultiUnit ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="text-zinc-500">Available units</span>
                <Badge className="rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  <Layers className="h-3.5 w-3.5" />
                  {getAvailableUnitsCount(property)}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-zinc-500">Total units shown</span>
                <span className="font-semibold text-zinc-950">
                  {property.units?.length || 0}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-500">Availability</span>
              <Badge
                className={
                  primaryUnit?.is_available
                    ? "rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                    : "rounded-md bg-zinc-200 text-zinc-700 hover:bg-zinc-200"
                }
              >
                {primaryUnit?.is_available ? "Available" : "Ask agent"}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <span className="text-zinc-500">Portfolio status</span>
            <span className="font-semibold text-zinc-950">
              {availableUnits.length > 0 ? "Active" : "By request"}
            </span>
          </div>
        </div>

        <div className="grid gap-2">
          <Button size="lg" className="h-11" asChild>
            <Link href={contactHref}>
              <MessageCircle className="h-4 w-4" />
              Contact about this listing
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-11" asChild>
            <Link href="/#listings">
              <Search className="h-4 w-4" />
              Browse similar properties
            </Link>
          </Button>
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
          Schedule a private showing or request the latest pricing directly
          from the listing team.
        </div>
      </CardContent>
    </Card>
  );
}
