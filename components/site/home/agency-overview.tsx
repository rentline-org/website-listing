import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ICustomListing, IOrganizationData, IProperty } from "@/lib/types";

interface AgencyOverviewProps {
  listing: ICustomListing;
  organization: IOrganizationData;
  properties: IProperty[];
}

export default function AgencyOverview({
  organization,
  properties,
}: AgencyOverviewProps) {
  const multiUnitCount = properties.filter(
    (property) => property.property_type === "multi_unit",
  ).length;

  return (
    <>
      <section id="about" className="bg-zinc-50 px-4 py-14 md:py-20">
        <div className="container mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Badge
              variant="outline"
              className="mb-3 rounded-md border-amber-200 bg-amber-50 text-amber-700"
            >
              About the agency
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
              Local market guidance with a polished digital portfolio.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              {organization.description ||
                `${organization.title} helps clients compare homes, rentals, land, and multi-unit opportunities with clear property data and direct ways to inquire.`}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <BadgeCheck className="mb-5 h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-zinc-950">Curated listings</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Each property page is built for quick evaluation with price,
                media, amenities, and unit availability.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <Building2 className="mb-5 h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-zinc-950">
                Multi-unit ready
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {multiUnitCount} multi-unit portfolio
                {multiUnitCount === 1 ? " property is" : " properties are"} set
                up to show unit mix, status, and pricing.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <CalendarDays className="mb-5 h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-zinc-950">
                Showing friendly
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Visitors can move from discovery to inquiry without hunting for
                contact details.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <Sparkles className="mb-5 h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-zinc-950">Modern search</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                The catalog filters by intent, city, price, beds, property
                type, and free-text property details.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-14 md:pb-20">
        <div className="container mx-auto max-w-7xl rounded-lg border border-zinc-200 bg-zinc-950 p-6 text-white shadow-sm md:p-8">
          <Badge className="mb-4 rounded-md bg-emerald-400 text-emerald-950 hover:bg-emerald-400">
            Listing portfolio
          </Badge>
          <h2 className="max-w-3xl text-2xl font-semibold tracking-tight md:text-3xl">
            Explore every active listing from {organization.title}.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 md:text-base">
            Use the interactive map or property catalog to compare locations,
            availability, amenities, and unit details.
          </p>
        </div>
      </section>
    </>
  );
}
