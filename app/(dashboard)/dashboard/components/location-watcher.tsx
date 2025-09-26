"use client";

import { Station } from "./station";
import { Skeleton } from "@/components/ui/skeleton";
import { useNearbyStations, LocStatus } from "../hooks/use-nearby-stations";

export default function LocationWatcher() {
  const { status, locationData } = useNearbyStations();

  if (status === LocStatus.NotSupported) {
    return (
      <div className="p-4 rounded shadow">
        Geolocation is not supported by your browser.
      </div>
    );
  }
  if (locationData.length === 0) {
    return (
      <div className="p-4 rounded shadow">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-2xl font-bold mb-4 ">Loading nearby stations</h1>
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-[125px]  rounded-xl  border py-6 shadow-sm" />
          <Skeleton className="h-[125px]  rounded-xl  border py-6 shadow-sm" />
          <Skeleton className="h-[125px]  rounded-xl  border py-6 shadow-sm" />
          <Skeleton className="h-[125px]  rounded-xl  border py-6 shadow-sm" />
          <Skeleton className="h-[125px]  rounded-xl  border py-6 shadow-sm" />
          <Skeleton className="h-[125px]  rounded-xl  border py-6 shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded shadow">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl font-bold mb-4 ">Nearby</h1>
      </div>
      <div className="flex flex-col gap-6">
        {locationData &&
          locationData.map((station) => (
            <Station station={station} key={station.id} />
          ))}
      </div>
    </div>
  );
}
