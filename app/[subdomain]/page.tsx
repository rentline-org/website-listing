import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { getWebsiteListingByDomain } from "../actions";
import PortfolioLandingPage from "@/components/site/home/portfolio-landing-page";
import MapFilters from "@/components/site/map/map-filters";
import PropertyCarousel from "@/components/site/map/property-carousel";
import PropertyDetailPanel from "@/components/site/map/property-detail-panel";
import { MapProvider } from "@/components/site/map/map-provider";
import Navbar from "@/components/site/navbar";
import { shouldUsePortfolioLandingPage } from "@/lib/listing-flags";

const PropertyMap = dynamic(
  () => import("@/components/site/map/property-map"),
  {
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-sm text-zinc-500">
        Loading map...
      </div>
    ),
  },
);

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

  if (shouldUsePortfolioLandingPage(data)) {
    return <PortfolioLandingPage data={data} subdomain={subdomain} />;
  }

  const organization = data.listing.organization;
  const orgName =
    organization?.title ||
    subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
  const orgLogo = organization?.logo || null;
  const showContact =
    data.show_contact_form || data.show_phone || data.show_email;
  const properties = data.properties || [];
  const orgCountry = organization?.country || "US";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-50 font-sans text-zinc-950">
      <Navbar
        orgName={orgName}
        orgLogo={orgLogo}
        showContact={showContact}
        subdomain={subdomain}
      />

      <MapProvider properties={properties} orgCountry={orgCountry}>
        <main
          id="listings"
          className="relative flex min-h-0 flex-1 overflow-hidden"
        >
          <div className="relative min-w-0 flex-1">
            <MapFilters />
            <PropertyMap organization={organization} />
            <PropertyCarousel />
          </div>

          <PropertyDetailPanel
            subdomain={subdomain}
            organization={organization}
          />
        </main>
      </MapProvider>
    </div>
  );
}
