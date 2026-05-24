import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Building2, Home, KeyRound, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAvailableUnitsCount } from "@/lib/format";
import { getAvailableCities, getHeroImageUrl } from "@/lib/property";
import type { IOrganizationData, IProperty } from "@/lib/types";

interface AgencyHeroProps {
  organization: IOrganizationData;
  headline?: string | null;
  properties: IProperty[];
}

export default function AgencyHero({
  organization,
  headline,
  properties,
}: AgencyHeroProps) {
  const heroImageUrl = getHeroImageUrl(properties);
  const cities = getAvailableCities(properties);
  const availableUnits = properties.reduce(
    (total, property) => total + getAvailableUnitsCount(property),
    0,
  );
  const title = headline || organization.title;
  const description =
    organization.description ||
    "A curated real estate portfolio for clients to explore available listings by location, property type, and unit availability.";

  return (
    <section className="relative isolate min-h-[560px] overflow-hidden bg-zinc-950 text-white md:min-h-[640px]">
      {heroImageUrl ? (
        <Image
          src={heroImageUrl}
          alt={`${organization.title} featured property`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#18181b_0%,#064e3b_55%,#f59e0b_120%)]" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.86),rgba(9,9,11,0.5)_48%,rgba(9,9,11,0.24))]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950/80 to-transparent" />

      <div className="container relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-end px-4 pb-12 pt-28 md:min-h-[640px] md:pb-16">
        <div className="max-w-3xl">
          <Badge className="mb-5 rounded-md border-white/20 bg-white/10 text-white backdrop-blur">
            <MapPin className="h-3.5 w-3.5" />
            {organization.city}
            {organization.state ? `, ${organization.state}` : ""}
          </Badge>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-100 md:text-lg">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-11 bg-white text-zinc-950 hover:bg-zinc-100" asChild>
              <Link href="#listings">
                <Home className="h-4 w-4" />
                Browse listings
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              asChild
            >
              <Link href="/contact">
                <KeyRound className="h-4 w-4" />
                Request a showing
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">
              <div className="text-2xl font-semibold">{properties.length}</div>
              <div className="mt-1 text-zinc-200">Listings</div>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">
              <div className="text-2xl font-semibold">{cities.length}</div>
              <div className="mt-1 text-zinc-200">Cities</div>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">
              <div className="flex items-center gap-2 text-2xl font-semibold">
                <Building2 className="h-5 w-5" />
                {availableUnits}
              </div>
              <div className="mt-1 text-zinc-200">Open units</div>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#listings"
        aria-label="Skip to listings"
        className="absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20 md:block"
      >
        <ArrowDown className="h-4 w-4" />
      </a>
    </section>
  );
}
