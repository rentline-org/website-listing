// 'use clo'

import { notFound } from "next/navigation";
import { getWebsiteListingByDomain } from "../actions";
import Navbar from "@/components/site/navbar";
import { MapProvider } from "@/components/site/map/map-provider";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(
  () => import("@/components/site/map/property-map"),
  {
    // ssr: false,
    loading: () => (
      <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400">
        Loading map...
      </div>
    ),
  },
);

import MapFilters from "@/components/site/map/map-filters";
import PropertyCarousel from "@/components/site/map/property-carousel";
import PropertyDetailPanel from "@/components/site/map/property-detail-panel";

export default async function SubdomainPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const data = await getWebsiteListingByDomain(subdomain);

  if (!data) {
    notFound();
  }

  const firstOrg = data.listing?.organization;
  const orgName =
    firstOrg?.title || subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
  const orgLogo = firstOrg?.logo || null;

  const showContact =
    data.show_contact_form || data.show_phone || data.show_email;

  const properties = data.properties || [];
  const orgCountry = firstOrg?.country || "US"; // default to US if not found

  return (
    <div className="h-screen bg-zinc-50 flex flex-col font-sans overflow-hidden">
      <Navbar
        orgName={orgName}
        orgLogo={orgLogo}
        showContact={showContact}
        subdomain={subdomain}
      />

      <MapProvider properties={properties} orgCountry={orgCountry}>
        <main className="flex-1 relative flex overflow-hidden">
          {/* Left Side: Map + Filters + Carousel */}
          <div className="flex-1 relative">
            <MapFilters />
            <PropertyMap organization={data.listing.organization} />
            <PropertyCarousel />
          </div>

          {/* Right Side: Detail Panel */}
          <PropertyDetailPanel
            subdomain={subdomain}
            organization={data.listing.organization}
          />
        </main>
      </MapProvider>
    </div>
  );
}
