"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RemoveFromFavorites } from "../../dashboard/components/remove-from-favorites";
import { FavStationTypeProps } from "@/types";
import StationDistance from "../../dashboard/components/station-distance";
import DocksAvailable from "./docks-available";

export function FavStation({ station }: FavStationTypeProps) {
  return (
    <Card key={station.id}>
      <CardHeader>
        <CardTitle>{station.name}</CardTitle>
        <CardDescription>
          <RemoveFromFavorites station={station}>
            {station.orig_name}
          </RemoveFromFavorites>
        </CardDescription>
        <CardAction className="text-2xl">
          <StationDistance {...station.coordinates} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <DocksAvailable station={station} />
      </CardContent>
    </Card>
  );
}
