import { notFound } from "next/navigation";

import { getWebsiteListingByDomain } from "@/app/actions";
import ContactForm from "@/components/site/contact-form";
import Footer from "@/components/site/footer";
import Navbar from "@/components/site/navbar";
import PropertyGallery from "@/components/site/property-details/property-gallery";
import PropertyInquiryCard from "@/components/site/property-details/property-inquiry-card";
import PropertySummary from "@/components/site/property-details/property-summary";
import PropertyUnitsSection from "@/components/site/property-details/property-units-section";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ subdomain: string; slug: string }>;
}) {
  const { subdomain, slug } = await params;
  const data = await getWebsiteListingByDomain(subdomain);

  if (!data || !data.properties) {
    notFound();
  }

  const property = data.properties.find((item) => item.slug === slug);

  if (!property) {
    notFound();
  }

  const organization = data.listing.organization;
  const orgName =
    organization?.title ||
    subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
  const orgLogo = organization?.logo || null;
  const showContact =
    data.show_contact_form || data.show_phone || data.show_email;
  const isMultiUnit = property.property_type === "multi_unit";
  const contactHref = `/contact?property=${property.slug}`;

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-950">
      <Navbar
        orgName={orgName}
        orgLogo={orgLogo}
        showContact={showContact}
        subdomain={subdomain}
      />

      <main>
        <PropertyGallery property={property} />

        <section className="px-4 py-12 md:py-16">
          <div className="container mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <PropertySummary property={property} />
            <PropertyInquiryCard
              property={property}
              currency={organization.currency}
            />
          </div>
        </section>

        {isMultiUnit && (
          <PropertyUnitsSection
            units={property.units || []}
            currency={organization.currency}
            contactHref={contactHref}
          />
        )}

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
