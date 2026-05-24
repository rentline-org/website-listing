"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, Home, Layers, Map, Menu, MessageCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { IProperty } from "@/lib/types";

interface NavbarProps {
  orgName: string;
  orgLogo: string | null;
  showContact: boolean;
  subdomain: string;
}

type MapTab = "all" | IProperty["property_type"];

const mapTabs: Array<{ value: MapTab; label: string }> = [
  { value: "all", label: "All" },
  { value: "single_unit", label: "Homes" },
  { value: "multi_unit", label: "Multi" },
  { value: "land", label: "Land" },
];

function isMapTab(value: string): value is MapTab {
  return value === "all" || value === "single_unit" || value === "multi_unit" || value === "land";
}

export default function Navbar({
  orgName,
  orgLogo,
  showContact,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MapTab>("all");

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (isMapTab(hash)) {
        setActiveTab(hash);
      }
    };

    syncHash();

    const syncMapPropertyType = (event: Event) => {
      const propertyType = (
        event as CustomEvent<{ propertyType?: string }>
      ).detail?.propertyType;

      if (propertyType && isMapTab(propertyType)) {
        setActiveTab(propertyType);
      }
    };

    window.addEventListener("hashchange", syncHash);
    window.addEventListener("map-property-type-change", syncMapPropertyType);

    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener(
        "map-property-type-change",
        syncMapPropertyType,
      );
    };
  }, []);

  const handleMapTabChange = (value: string) => {
    if (!isMapTab(value)) return;

    setActiveTab(value);
    setMobileOpen(false);

    const onRootPath = window.location.pathname === "/";
    if (!onRootPath) {
      window.location.href = `/#${value}`;
      return;
    }

    window.history.replaceState(null, "", `#${value}`);
    window.dispatchEvent(
      new CustomEvent("map-property-type-change", {
        detail: { propertyType: value },
      }),
    );

    document.getElementById("listings")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/90 backdrop-blur-xl">
      <div className="container mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-4 md:h-[72px] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 text-zinc-950 transition hover:text-zinc-700"
        >
          {orgLogo ? (
            <Image
              src={orgLogo}
              alt={orgName}
              width={96}
              height={96}
              className="h-9 w-9 rounded-lg border border-zinc-200 object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-sm font-semibold text-white">
              {orgName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="truncate text-base font-semibold tracking-tight md:text-lg">
            {orgName}
          </span>
        </Link>

        <Tabs
          value={activeTab}
          onValueChange={handleMapTabChange}
          className="hidden md:flex"
        >
          <TabsList className="h-10 rounded-lg bg-zinc-100 p-1">
            {mapTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="h-8 min-w-20 px-4"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="hidden items-center justify-end gap-1 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/#listings">Listings</Link>
          </Button>
          {showContact && (
            <Button asChild>
              <Link href="/contact">
                <MessageCircle className="h-4 w-4" />
                Contact
              </Link>
            </Button>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 md:hidden">
          <Tabs value={activeTab} onValueChange={handleMapTabChange}>
            <TabsList className="grid h-10 w-full grid-cols-4 rounded-lg bg-zinc-100 p-1">
              {mapTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <nav className="mt-4 grid gap-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/#listings"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
            >
              <Map className="h-4 w-4" />
              Map
            </Link>
            <Link
              href="/#all"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
            >
              <Building2 className="h-4 w-4" />
              Listings
            </Link>
            <Link
              href="/#multi_unit"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
            >
              <Layers className="h-4 w-4" />
              Multi-unit
            </Link>
            {showContact && (
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
              >
                <MessageCircle className="h-4 w-4" />
                Contact
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
