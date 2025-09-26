import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Coordinates, FavStationType } from "@/types";
import { useLocation } from "@/components/location-provider";
import { calculateDistance } from "@/lib/distance";

interface SortByProps {
  favorites: FavStationType[];
  onSortChange?: (sortedFavorites: FavStationType[]) => void;
}

export function SortBy({ favorites, onSortChange }: SortByProps) {
  const { latitude, longitude } = useLocation();

  function calcDistance(coordinates: Coordinates): number {
    if (latitude && longitude) {
      return calculateDistance(
        latitude,
        longitude,
        coordinates.lat,
        coordinates.lon
      ) as number;
    }
    return 0;
  }
  favorites.forEach((fav) => {
    fav.distance = calcDistance(fav.coordinates);
  });

  function handleSortChange(value: string) {
    const sortedFavorites = [...favorites];
    const distanceCmp = (a: FavStationType, b: FavStationType) =>
      (a.distance || 0) - (b.distance || 0);
    switch (value) {
      case "dist-desc":
        sortedFavorites.sort(distanceCmp).reverse();
        break;
      case "dist-asc":
        sortedFavorites.sort(distanceCmp);
        break;
      case "date-desc":
        sortedFavorites.sort(
          (a, b) =>
            new Date(a.addedAt || "").getTime() -
            new Date(b.addedAt || "").getTime()
        );
        break;
      case "date-asc":
        sortedFavorites.sort(
          (a, b) =>
            new Date(b.addedAt || "").getTime() -
            new Date(a.addedAt || "").getTime()
        );
        break;
      default:
        break;
    }
    // Update the state or context with the sorted favorites
    if (onSortChange) {
      onSortChange(sortedFavorites);
    }
  }
  return (
    <Select onValueChange={handleSortChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Distance</SelectLabel>
          <SelectItem value="dist-asc">close to far</SelectItem>
          <SelectItem value="dist-desc">far to close</SelectItem>
          <SelectLabel>Date added</SelectLabel>
          <SelectItem value="date-asc">New to old</SelectItem>
          <SelectItem value="date-desc">Old to new</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
