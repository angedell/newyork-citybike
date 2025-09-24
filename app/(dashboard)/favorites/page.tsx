"use client";
import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "./lib/favorites";
import { FavStation } from "./components/fav-station";
import { SortBy } from "./components/sorty-by";
import { useState } from "react";
import { FavStationType } from "@/types";

export default function Favorites() {
  const [sortedFavorites, setSortedFavorites] = useState<FavStationType[]>([]);

  const handleSortChange = (sortedFavorites: FavStationType[]) => {
    setSortedFavorites(sortedFavorites);
  };
  const {
    data: favorites,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const favs = await getFavorites();
      setSortedFavorites(favs);
      return favs;
    },
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (!favorites || favorites.length === 0) {
    return <div className="p-4 rounded shadow">No favorites yet.</div>;
  }

  if (!sortedFavorites || sortedFavorites.length === 0) {
    setSortedFavorites(favorites);
  }

  return (
    <div className="p-4 rounded shadow">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl font-bold mb-4 ">Favorites</h1>
        <SortBy favorites={favorites} onSortChange={handleSortChange} />
      </div>
      <div className="flex flex-col gap-6">
        {sortedFavorites?.map((station) =>
          station.id && station.name ? (
            <FavStation key={station.id} station={station} />
          ) : null
        )}
      </div>
    </div>
  );
}
