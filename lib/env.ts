export const ENV_VARS = {
  backendUrl:
    process.env.NEXT_APP_CORE_BACKEND_URL ?? "http://localhost:8000/api/v1",
  nextPublicMapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "",
} as const;
