import { notFound } from "next/navigation";
import { getWebsiteListingByDomain } from "../../actions";
import Navbar from "@/components/site/navbar";
import ContactForm from "@/components/site/contact-form";
import Footer from "@/components/site/footer";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const data = await getWebsiteListingByDomain(subdomain);

  if (!data) {
    notFound();
  }

  const showContact = data.show_contact_form || data.show_phone || data.show_email;
  const firstOrg = data.properties?.[0]?.organization;
  const orgName = firstOrg?.title || subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
  const orgLogo = firstOrg?.logo || null;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      <Navbar 
        orgName={orgName} 
        orgLogo={orgLogo} 
        showContact={showContact} 
        subdomain={subdomain} 
      />

      <main className="flex-1 bg-white">
        {showContact ? (
          <ContactForm 
            showForm={data.show_contact_form}
            showPhone={data.show_phone}
            showEmail={data.show_email}
            contactPhone={data.contact_phone}
            contactEmail={data.contact_email}
            orgName={orgName}
            orgAddress={firstOrg?.address_line}
          />
        ) : (
          <div className="container mx-auto px-4 py-32 text-center">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Contact Unavailable</h2>
            <p className="text-zinc-500 text-lg">Contact information is currently unavailable for this organization.</p>
          </div>
        )}
      </main>

      <Footer orgName={orgName} />
    </div>
  );
}
