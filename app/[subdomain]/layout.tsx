import React from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default async function SubdomainLayout({ children }: Props) {
  const headersList = await headers();
  const hostname = headersList.get("host") || "";
  
  const allowedDomains = ['rentline.io', 'localhost:3000'];
  const isSubdomain = !allowedDomains.includes(hostname);

  if (!isSubdomain) {
    notFound();
  }

  return (
    <div className="subdomain-layout">
      {children}
    </div>
  );
}
