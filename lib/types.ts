import { PROPERTY_TYPES, UNIT_TYPES } from "./constants";

export type TPropertyType =
  (typeof PROPERTY_TYPES)[keyof typeof PROPERTY_TYPES];
export type TUnitType = (typeof UNIT_TYPES)[keyof typeof UNIT_TYPES];

export interface IMediaData {
  id: string;
  url: string;
}

export interface IGalleryMedia extends IMediaData {
  name: string;
}

export interface IUnitData {
  id: number;
  property_id: number;

  name: string;
  slug: string;
  description?: string | null;

  unit_type: TUnitType;

  is_available: boolean;
  is_furnished: boolean;

  rent_price?: number | null;
  sale_price?: number | null;

  bedrooms?: number | null;
  bathrooms?: number | null;
  square_feet?: number | null;

  amenities?: string[] | null;
  thumbnail?: IMediaData | null;
  gallery_urls?: IGalleryMedia[] | null;
  media?: unknown;

  available_from?: string | null;
  is_pet_friendly: boolean;

  property?: IProperty;

  created_at: string;
  updated_at: string;
}

export interface IProperty {
  id: number;
  organization_id: number;
  thumbnail: IMediaData | null;
  gallery_urls: IGalleryMedia[] | null;

  slug: string;
  title: string;
  description?: string | null;

  address: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string | null;
  sale_price: number | null;

  property_type: TPropertyType;

  created_at: string;
  updated_at: string;

  latitude: number;
  longitude: number;
  full_address: string;
  address_number: string;
  region_code: string;

  organization?: IOrganizationData;
  units?: IUnitData[];
  units_count?: number;
}

export interface ICustomListing {
  id: number;
  listing_id: number;
  listing: IListing;
  subdomain: string;
  headline: string | null;
  is_published: boolean;
  use_organization_defaults: boolean;
  use_portfolio_landing_page?: boolean | null;
  show_contact_form: boolean;
  show_phone: boolean;
  show_email: boolean;
  contact_email: string | null;
  contact_phone: string | null;
  languages: string | null;
  properties: IProperty[] | null;
  properties_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface IOrganizationData {
  id: number;

  title: string;
  description: string | null;

  phone: string | null;
  email: string;
  website: string | null;

  owner_id: number;

  country: string;
  state: string | null;
  city: string;
  postal_code: string;
  address_line: string;
  full_address: string;
  latitude: number;
  longitude: number;
  address_number: string;
  region_code: string;

  currency: string;
  timezone: string;
  properties_count?: number;

  tax_id: string;
  tax_id_type: "cpf" | "cnpj" | "vat";

  plan: "trial" | "starter" | "pro" | "enterprise";
  is_plan_active: boolean;

  data_retention_until: string | null;
  is_active: boolean;

  settings: Record<string, unknown> | null;

  trial_ends_at: string;
  logo: string | null;
}

export interface IListing {
  id: number;
  organization_id: number;
  //   type: ListingType;
  custom_listing: ICustomListing;
  organization: IOrganizationData;
  created_at: string;
  updated_at: string;
}

export type ApiErrorResponse = {
  message?: string;
  detail?: string;
  error_code?: string;
  errors?: Record<string, string[]>;
};

export interface IResponse<TData> extends ApiErrorResponse {
  data: TData;
}
