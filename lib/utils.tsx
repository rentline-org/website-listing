import { ClassValue } from "clsx";
import { UNIT_TYPES } from "./constants";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { IProperty } from "./types";
import { Building2, Home, TreePine } from "lucide-react";

export const getUnitTypes = () => {
  return Object.entries(UNIT_TYPES).map(([, key]) => {
    return {
      label: key.split("_").join(" ").toLowerCase(),
      value: key,
    };
  });
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPropertyIcon(propertyType: IProperty["property_type"]) {
  switch (propertyType) {
    case "multi_unit":
      return <Building2 />;
    case "land":
      return <TreePine />;
    case "single_unit":
    default:
      return <Home />;
  }
}
