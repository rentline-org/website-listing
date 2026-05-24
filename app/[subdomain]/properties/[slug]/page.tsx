import { notFound } from "next/navigation";
import Navbar from "@/components/site/navbar";
import ContactForm from "@/components/site/contact-form";
import Footer from "@/components/site/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bed,
  Bath,
  MapPin,
  Maximize,
  ImageIcon,
  Layers,
  CheckCircle,
} from "lucide-react";
import {
  getPropertyPriceDisplay,
  formatPropertyType,
  formatUnitType,
  formatAddress,
  getAvailableUnitsCount,
} from "@/lib/format";
import { getWebsiteListingByDomain } from "@/app/actions";

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

  const property = data.properties.find((p) => p.slug === slug);
  if (!property) {
    notFound();
  }

  const firstOrg = data.properties?.[0]?.organization;
  const orgName =
    firstOrg?.title || subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
  const orgLogo = firstOrg?.logo || null;
  const showContact =
    data.show_contact_form || data.show_phone || data.show_email;

  const isMultiUnit = property.property_type === "multi_unit";
  const units = property.units || [];
  const firstUnit = units[0];
  const priceDisplay = getPropertyPriceDisplay(property);

  // Gallery calculation
  let gallery = property.gallery_urls || [];
  if (gallery.length === 0 && property.thumbnail) {
    gallery = [
      {
        id: property.thumbnail.id,
        url: property.thumbnail.url,
        name: "Thumbnail",
      },
    ];
  }
  // If still empty and single unit, use unit's gallery
  if (gallery.length === 0 && !isMultiUnit && firstUnit?.gallery_urls) {
    gallery = firstUnit.gallery_urls;
  }
  if (gallery.length === 0 && !isMultiUnit && firstUnit?.thumbnail) {
    gallery = [
      {
        id: firstUnit.thumbnail.id,
        url: firstUnit.thumbnail.url,
        name: "Unit Thumbnail",
      },
    ];
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      <Navbar
        orgName={orgName}
        orgLogo={orgLogo}
        showContact={showContact}
        subdomain={subdomain}
      />

      <main className="flex-1">
        {/* Photo Gallery Header */}
        <section className="bg-zinc-100 border-b border-zinc-200">
          {gallery.length > 0 ? (
            <div className="container mx-auto p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 h-[40vh] md:h-[60vh] rounded-2xl overflow-hidden">
                <div className="md:col-span-2 md:row-span-2 relative group bg-zinc-200">
                  <img
                    src={gallery[0].url}
                    alt={gallery[0].name || property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {gallery.slice(1, 5).map((img, idx) => (
                  <div
                    key={img.id}
                    className="hidden md:block relative group overflow-hidden bg-zinc-200"
                  >
                    <img
                      src={img.url}
                      alt={img.name || property.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[40vh] flex flex-col items-center justify-center text-zinc-400 bg-zinc-200">
              <ImageIcon className="h-16 w-16 mb-4 opacity-50" />
              <p>No images available for this property</p>
            </div>
          )}
        </section>

        {/* Property Info */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-zinc-900 text-white hover:bg-zinc-800">
                      {formatPropertyType(property.property_type)}
                    </Badge>
                    {!isMultiUnit && firstUnit?.is_available && (
                      <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
                        Available
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight mb-4">
                    {property.title}
                  </h1>
                  <p className="flex items-center text-zinc-500 text-lg">
                    <MapPin className="h-5 w-5 mr-2" />
                    {formatAddress(property)}
                  </p>
                </div>

                <div className="prose prose-zinc max-w-none text-zinc-600">
                  <p className="whitespace-pre-line leading-relaxed text-lg">
                    {property.description ||
                      "No description available for this property."}
                  </p>
                </div>

                {/* Single Unit Amenities */}
                {!isMultiUnit && firstUnit && (
                  <div className="pt-6 border-t border-zinc-200">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-6">
                      Property Features
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                      {firstUnit.bedrooms != null && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
                          <Bed className="h-6 w-6 text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-500 font-medium">
                              Bedrooms
                            </p>
                            <p className="font-semibold text-zinc-900">
                              {firstUnit.bedrooms}
                            </p>
                          </div>
                        </div>
                      )}
                      {firstUnit.bathrooms != null && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
                          <Bath className="h-6 w-6 text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-500 font-medium">
                              Bathrooms
                            </p>
                            <p className="font-semibold text-zinc-900">
                              {firstUnit.bathrooms}
                            </p>
                          </div>
                        </div>
                      )}
                      {firstUnit.square_feet != null && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
                          <Maximize className="h-6 w-6 text-zinc-400" />
                          <div>
                            <p className="text-sm text-zinc-500 font-medium">
                              Square Feet
                            </p>
                            <p className="font-semibold text-zinc-900">
                              {firstUnit.square_feet.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {firstUnit.amenities && firstUnit.amenities.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-zinc-900 mb-4">
                          Amenities
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {firstUnit.amenities.map((amenity) => (
                            <li
                              key={amenity}
                              className="flex items-center text-zinc-600 bg-white p-3 rounded-lg border border-zinc-100 shadow-sm"
                            >
                              <CheckCircle className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                              <span className="capitalize">
                                {amenity.replace(/_/g, " ")}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar Pricing & Action */}
              <div className="w-full md:w-80 flex-shrink-0">
                <Card className="sticky top-24 border-zinc-200 shadow-xl shadow-zinc-200/50 overflow-hidden">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-1">
                        Price
                      </p>
                      <div className="text-3xl font-extrabold text-zinc-900">
                        {priceDisplay.text}
                        {priceDisplay.suffix && (
                          <span className="text-lg font-normal text-zinc-500 ml-1">
                            {priceDisplay.suffix}
                          </span>
                        )}
                      </div>
                    </div>

                    {isMultiUnit && (
                      <div className="py-4 border-y border-zinc-100 flex items-center justify-between">
                        <span className="text-zinc-600 font-medium">
                          Available Units
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none"
                        >
                          <Layers className="h-3.5 w-3.5 mr-1" />
                          {getAvailableUnitsCount(property)}
                        </Badge>
                      </div>
                    )}

                    <Button
                      size="lg"
                      className="w-full h-12 text-base font-semibold shadow-lg"
                      asChild
                    >
                      <a href="#contact">Contact to Inquire</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Unit Available Units Section */}
        {isMultiUnit && units.length > 0 && (
          <section className="py-16 px-4 bg-zinc-100/50 border-t border-zinc-200">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-zinc-900 mb-8">
                Available Units
              </h2>
              <div className="grid gap-6">
                {units.map((unit) => (
                  <Card
                    key={unit.id}
                    className="overflow-hidden border-zinc-200 hover:border-zinc-300 transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {unit.thumbnail?.url ? (
                        <div className="sm:w-64 h-48 sm:h-auto flex-shrink-0 bg-zinc-200 relative">
                          <img
                            src={unit.thumbnail.url}
                            alt={unit.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="sm:w-64 h-48 sm:h-auto flex-shrink-0 bg-zinc-100 flex flex-col items-center justify-center text-zinc-300 border-r border-zinc-200">
                          <ImageIcon className="h-8 w-8 mb-2" />
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                      <CardContent className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                            <div>
                              <Badge
                                variant="outline"
                                className="mb-2 text-zinc-600 border-zinc-200"
                              >
                                {formatUnitType(unit.unit_type)}
                              </Badge>
                              <h3 className="text-2xl font-bold text-zinc-900">
                                {unit.name}
                              </h3>
                            </div>
                            <div className="md:text-right flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1">
                              <p className="text-2xl font-bold text-zinc-900">
                                {unit.rent_price
                                  ? `$${unit.rent_price.toLocaleString()}/mo`
                                  : unit.sale_price
                                    ? `$${unit.sale_price.toLocaleString()}`
                                    : "Price on request"}
                              </p>
                              <Badge
                                className={`border-none ${unit.is_available ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}
                              >
                                {unit.is_available ? "Available" : "Occupied"}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-zinc-600 text-sm mt-4">
                            {unit.bedrooms != null && (
                              <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-md border border-zinc-100">
                                <Bed className="h-4 w-4 text-zinc-400" />{" "}
                                <span className="font-medium">
                                  {unit.bedrooms}
                                </span>{" "}
                                Beds
                              </div>
                            )}
                            {unit.bathrooms != null && (
                              <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-md border border-zinc-100">
                                <Bath className="h-4 w-4 text-zinc-400" />{" "}
                                <span className="font-medium">
                                  {unit.bathrooms}
                                </span>{" "}
                                Baths
                              </div>
                            )}
                            {unit.square_feet != null && (
                              <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-md border border-zinc-100">
                                <Maximize className="h-4 w-4 text-zinc-400" />{" "}
                                <span className="font-medium">
                                  {unit.square_feet.toLocaleString()}
                                </span>{" "}
                                sqft
                              </div>
                            )}
                          </div>
                        </div>
                        {unit.amenities && unit.amenities.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-wrap gap-2">
                            {unit.amenities.slice(0, 5).map((a) => (
                              <span
                                key={a}
                                className="text-xs font-medium text-zinc-500 bg-white border border-zinc-200 px-2.5 py-1 rounded-full capitalize"
                              >
                                {a.replace(/_/g, " ")}
                              </span>
                            ))}
                            {unit.amenities.length > 5 && (
                              <span className="text-xs font-medium text-zinc-400 self-center">
                                +{unit.amenities.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        <div id="contact">
          {showContact && (
            <ContactForm
              showForm={data.show_contact_form}
              showPhone={data.show_phone}
              showEmail={data.show_email}
              contactPhone={data.contact_phone}
              contactEmail={data.contact_email}
              orgName={orgName}
              orgAddress={firstOrg?.address_line}
            />
          )}
        </div>
      </main>

      <Footer orgName={orgName} />
    </div>
  );
}
