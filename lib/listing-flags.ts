import type { ICustomListing } from "./types";

export const STATIC_CUSTOM_LISTING_FLAGS = {
  usePortfolioLandingPage: false,
} as const;

export function shouldUsePortfolioLandingPage(
  listing: ICustomListing,
): boolean {
  return (
    listing.use_portfolio_landing_page ??
    STATIC_CUSTOM_LISTING_FLAGS.usePortfolioLandingPage
  );
}
