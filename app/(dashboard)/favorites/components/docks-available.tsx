import { Button } from "@/components/ui/button";
import { FavStationTypeProps } from "@/types";
import { CircleParking } from "lucide-react";
import React from "react";
import { DirectionsButton } from "../../dashboard/components/directions-button";
import { Separator } from "@/components/ui/separator";
import { nextFavoriteStation } from "../lib/favorites";
import { useQuery } from "@tanstack/react-query";

const num_docks_available_warning = 2;

const DocksAvailable = ({ station }: FavStationTypeProps) => {
  const { data: nextStation, isLoading } = useQuery({
    queryKey: ["nextStation", station.id],
    queryFn: async () => await nextFavoriteStation(station.coordinates),
    staleTime: 1000,
    enabled:
      station.num_docks_available > num_docks_available_warning ? false : true,
  });

  if (station.num_docks_available === 0 && nextStation) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Button variant={"destructive"}>
            <div className="flex items-center gap-2">
              <CircleParking width={80} height={80} />
              {station.num_docks_available}
            </div>
          </Button>
          <DirectionsButton station={station} />
        </div>
        <Separator />
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Button variant={"outline"}>
              <div className="flex items-center gap-2">
                <CircleParking width={80} height={80} />
                {nextStation.num_docks_available}
              </div>
            </Button>
            <span>{nextStation.name}</span>
          </div>
          <DirectionsButton station={nextStation} />
        </div>
      </div>
    );
  }

  if (station.num_docks_available > num_docks_available_warning) {
    return (
      <div className="flex justify-between">
        <Button variant={"outline"}>
          <div className="flex items-center gap-2">
            <CircleParking width={80} height={80} />
            {station.num_docks_available}
          </div>
        </Button>
        <DirectionsButton station={station} />
      </div>
    );
  }
  if (!isLoading && nextStation) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Button variant={"warning"}>
            <div className="flex items-center gap-2">
              <CircleParking width={80} height={80} />
              {station.num_docks_available}
            </div>
          </Button>
          <DirectionsButton station={station} />
        </div>
        <Separator />
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Button variant={"outline"}>
              <div className="flex items-center gap-2">
                <CircleParking width={80} height={80} />
                {nextStation.num_docks_available}
              </div>
            </Button>
            <span>{nextStation.name}</span>
          </div>
          <DirectionsButton station={nextStation} />
        </div>
      </div>
    );
  }
};
export default DocksAvailable;
