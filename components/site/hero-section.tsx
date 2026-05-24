import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2 } from "lucide-react";

interface HeroSectionProps {
  headline: string;
  propertiesCount: number;
  showContact: boolean;
}

export default function HeroSection({
  headline,
  propertiesCount,
  showContact,
}: HeroSectionProps) {
  return (
    <section className="relative px-4 pt-28 pb-32 md:pt-36 md:pb-44 flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%221%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-600/30 to-transparent" />

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <div className="inline-flex items-center gap-2 mb-8">
          <Badge
            variant="secondary"
            className="px-4 py-1.5 text-sm font-medium bg-white/10 text-zinc-300 border-white/10 backdrop-blur-sm"
          >
            <Building2 className="h-3.5 w-3.5 mr-1.5" />
            {propertiesCount} {propertiesCount === 1 ? "Property" : "Properties"} Available
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          {headline}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover our curated selection of premium properties.
          Find the perfect space that matches your lifestyle and needs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            className="rounded-full w-full sm:w-auto text-base h-13 px-8 bg-white text-zinc-900 hover:bg-zinc-100 font-semibold shadow-lg shadow-white/10"
            asChild
          >
            <a href="#properties">
              Browse Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          {showContact && (
            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-full sm:w-auto text-base h-13 px-8 border-white/20 text-white hover:bg-white/10 font-medium"
              asChild
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
