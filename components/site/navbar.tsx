"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

interface NavbarProps {
  orgName: string;
  orgLogo: string | null;
  showContact: boolean;
  subdomain: string;
}

export default function Navbar({
  orgName,
  orgLogo,
  showContact,
  subdomain,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const navLinks = [
    { value: "about", label: "About" },
    { value: "buy", label: "Buy" },
    { value: "sell", label: "Sell" },
    { value: "rent", label: "Rent" },
  ];

  if (showContact) {
    navLinks.push({ value: "contact", label: "Contact" });
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["about", "buy", "sell", "rent", "contact"].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    // Init on load
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    if (val === "contact") {
      window.location.href = `/${subdomain}/contact`;
    } else {
      window.location.hash = val;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto max-w-7xl h-16 flex items-center justify-between">
        {/* Logo & Name */}
        <a
          href={`/${subdomain}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          {orgLogo ? (
            <Image
              src={orgLogo}
              alt={orgName}
              width={250}
              height={250}
              className="h-8 w-8 rounded-lg object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-sm">
              {orgName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-lg font-semibold tracking-tight text-zinc-900">
            {orgName}
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList variant="line">
              {navLinks.map((link) => (
                <TabsTrigger
                  key={link.value}
                  value={link.value}
                  className="text-[15px] font-medium h-10 px-4"
                >
                  {link.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white/95 backdrop-blur-xl">
          <nav className="container mx-auto max-w-7xl py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.value}
                href={
                  link.value === "contact"
                    ? `/${subdomain}/contact`
                    : `#${link.value}`
                }
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
