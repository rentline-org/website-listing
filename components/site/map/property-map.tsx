"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import bbox from "@turf/bbox";
import { SearchBox } from "@mapbox/search-js-react";
import { useMapContext } from "./map-provider";
import { ENV_VARS } from "@/lib/env";
import { IOrganizationData, IProperty } from "@/lib/types";
import PropertyMarker from "./property-marker";

const ZOOM = 12;

function hasCoordinates(property: IProperty) {
  return property.longitude != null && property.latitude != null;
}

function hasOrgCoordinates(org: IOrganizationData) {
  return org.longitude != null && org.latitude != null;
}

export default function PropertyMap({
  organization,
}: {
  organization: IOrganizationData;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | undefined>();
  const [mapLoaded, setMapLoaded] = useState(false);

  const {
    filteredProperties,
    selectedProperty,
    setSelectedProperty,
    orgCountry,
  } = useMapContext();

  const fitMapToBounds = (map: mapboxgl.Map, properties: IProperty[]) => {
    const validProps = properties.filter(hasCoordinates);
    if (validProps.length === 0) return;

    if (validProps.length === 1) {
      const p = validProps[0];
      map.flyTo({
        center: [p.longitude as number, p.latitude as number],
        zoom: 14,
        essential: true,
      });
      return;
    }

    const features = validProps.map((p) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [p.longitude as number, p.latitude as number],
      },
      properties: {},
    }));

    const featureCollection = {
      type: "FeatureCollection" as const,
      features,
    };

    const [minLng, minLat, maxLng, maxLat] = bbox(featureCollection);

    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 100, maxZoom: 14 },
    );
  };

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = ENV_VARS.nextPublicMapboxToken;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      center: hasOrgCoordinates(organization)
        ? [organization.longitude as number, organization.latitude as number]
        : [-98.5795, 39.8283],
      zoom: ZOOM,
      minZoom: 2,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      setMapLoaded(true);
    });

    mapRef.current = map;
    setMapInstance(map);

    return () => {
      map.remove();
      mapRef.current = null;
      setMapInstance(undefined);
    };
  }, [organization]);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    if (selectedProperty) return;

    if (filteredProperties.length > 0) {
      fitMapToBounds(mapRef.current, filteredProperties);
    }
  }, [filteredProperties, mapLoaded, selectedProperty]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!hasOrgCoordinates(organization)) return;
    if (selectedProperty) return;
    if (filteredProperties.length > 0) return;

    mapRef.current.jumpTo({
      center: [
        organization.longitude as number,
        organization.latitude as number,
      ],
      zoom: ZOOM,
    });
  }, [
    organization.latitude,
    organization.longitude,
    filteredProperties.length,
    selectedProperty,
    organization,
  ]);

  useEffect(() => {
    if (
      selectedProperty &&
      mapRef.current &&
      hasCoordinates(selectedProperty)
    ) {
      mapRef.current.flyTo({
        center: [
          selectedProperty.longitude as number,
          selectedProperty.latitude as number,
        ],
        zoom: 14,
        essential: true,
      });
    }
  }, [selectedProperty]);

  return (
    <div className="relative w-full h-full bg-zinc-100">
      <div className="absolute top-40 md:top-16 left-4 z-10 w-80 max-w-[calc(100vw-2rem)]">
        {ENV_VARS.nextPublicMapboxToken && (
          <SearchBox
            accessToken={ENV_VARS.nextPublicMapboxToken}
            map={mapInstance}
            mapboxgl={mapboxgl}
            options={{
              country: orgCountry.toLowerCase(),
              limit: 5,
            }}
            marker
          />
        )}
      </div>

      <div ref={mapContainer} className="w-full h-full" />

      {mapLoaded &&
        mapInstance &&
        filteredProperties.map((property) => (
          <PropertyMarker
            key={property.id}
            map={mapInstance}
            property={property}
            selected={selectedProperty?.id === property.id}
            onSelect={setSelectedProperty}
          />
        ))}
    </div>
  );
}
