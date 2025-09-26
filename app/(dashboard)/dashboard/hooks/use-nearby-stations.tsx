"use client";
import { useLocation } from "@/components/location-provider";
import { loadStations } from "@/lib/stations";
import { loadStationsStatus } from "@/lib/stations-status";
import { StationType } from "@/types";
import { useEffect, useState } from "react";
import { loadNearbyStations } from "../lib/stations";

export enum LocStatus {
  Waiting = "Waiting for location...",
  Error = "Error processing location.",
  Updated = "Location updated, sending to server...",
  DataReceived = "Data received from server.",
  NotSupported = "Geolocation is not supported.",
}

export function useNearbyStations() {
  const [status, setStatus] = useState<LocStatus>(LocStatus.Waiting);
  const [locationData, setLocationData] = useState<StationType[]>([]);
  const { latitude, longitude } = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      if (typeof latitude === "number" && typeof longitude === "number") {
        setStatus(LocStatus.Updated);
        try {
          await loadStations();
          await loadStationsStatus();
          const data = await loadNearbyStations(latitude, longitude);
          setLocationData(data);
          setStatus(LocStatus.DataReceived);
        } catch (err) {
          console.error(err);
          setStatus(LocStatus.Error);
        }
      } else if (latitude === null || longitude === null) {
        setStatus(LocStatus.Waiting);
      }
    };
    fetchData();
  }, [latitude, longitude]);

  return {
    status,
    locationData,
  };
}
