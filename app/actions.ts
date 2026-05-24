"use server";

import { ENV_VARS } from "@/lib/env";
import { ICustomListing, IResponse } from "@/lib/types";

export async function getWebsiteListingByDomain(
  host: string,
): Promise<ICustomListing | null> {
  const response = await fetch(ENV_VARS.backendUrl.concat(`/website/${host}`), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = (await response.json()) as IResponse<ICustomListing>;
    console.log(data.data);

    return data.data ?? null;
  }

  return null;
}
