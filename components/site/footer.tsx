import React from "react";

interface FooterProps {
  orgName: string;
}

export default function Footer({ orgName }: FooterProps) {
  return (
    <footer className="py-8 bg-zinc-900 text-zinc-400 text-center text-sm">
      <div className="container mx-auto px-4">
        <p>
          © {new Date().getFullYear()} {orgName}. All rights reserved.
        </p>
        <p className="mt-2 text-zinc-600">Powered by Rentline</p>
      </div>
    </footer>
  );
}
