import ContactForm from "@/components/site/contact-form";
import Footer from "@/components/site/footer";
import AgencyHero from "@/components/site/home/agency-hero";
import AgencyOverview from "@/components/site/home/agency-overview";
import PropertySearchCatalog from "@/components/site/listings/property-search-catalog";
import Navbar from "@/components/site/navbar";
import type { ICustomListing } from "@/lib/types";

interface PortfolioLandingPageProps {
  data: ICustomListing;
  subdomain: string;
}

export default function PortfolioLandingPage({
  data,
  subdomain,
}: PortfolioLandingPageProps) {
  const organization = data.listing.organization;
  const orgName =
    organization?.title ||
    subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
  const orgLogo = organization?.logo || null;
  const showContact =
    data.show_contact_form || data.show_phone || data.show_email;
  const properties = data.properties || [];

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-950">
      <Navbar
        orgName={orgName}
        orgLogo={orgLogo}
        showContact={showContact}
        subdomain={subdomain}
      />

      <main>
        <AgencyHero
          organization={organization}
          headline={data.headline}
          properties={properties}
        />

        <PropertySearchCatalog
          properties={properties}
          currency={organization.currency}
        />

        <AgencyOverview
          listing={data}
          organization={organization}
          properties={properties}
        />

        {showContact && (
          <div id="contact">
            <ContactForm
              showForm={data.show_contact_form}
              showPhone={data.show_phone}
              showEmail={data.show_email}
              contactPhone={data.contact_phone}
              contactEmail={data.contact_email}
              orgName={orgName}
              orgAddress={organization.address_line}
            />
          </div>
        )}
      </main>

      <Footer orgName={orgName} />
    </div>
  );
}
