'use server';

import { getRedis } from '@/lib/redis';
import { getUserIdFromSession } from '@/lib/session';
import { getXataClient } from '@/lib/xata';
import { Coordinates, FavStationType } from '@/types';
import {
  getStationById,
  loadNearbyStations,
} from '../../dashboard/lib/stations';

const client = getXataClient();

export async function getFavorites(): Promise<FavStationType[]> {
  const redis = await getRedis();
  const userId = await getUserIdFromSession();
  if (userId === null) {
    throw new Error('User ID is null');
  }
  const favorites = await client.db.saved_locations
    .select(['station_id', 'nickname', 'xata.updatedAt'])
    .filter('user.id', userId)
    .getMany();

  const res = favorites.map(async (fav) => {
    const stationJson = await redis.hget(
      'locationsdetail',
      fav['station_id'] as string
    );
    const station =
      typeof stationJson === 'string' ? JSON.parse(stationJson) : stationJson;

    const stationStatusJson = await redis.hget(
      'station_status',
      fav['station_id'] as string
    );
    const stationStatus =
      typeof stationStatusJson === 'string'
        ? JSON.parse(stationStatusJson)
        : stationStatusJson;

    return {
      id: fav.station_id as string,
      name: fav.nickname as string,
      coordinates: { lat: station.lat as number, lon: station.lon as number },
      num_docks_available: stationStatus.num_docks_available as number,
      bikes: ((stationStatus.num_bikes_available as number) -
        stationStatus.num_ebikes_available) as number,
      ebikes: stationStatus.num_ebikes_available as number,
      orig_name: station.name as string,
      addedAt: fav.xata.updatedAt.getTime(),
    };
  });
  return await Promise.all(res);
}

export async function removeFromFavorites(stationId: string) {
  try {
    const userId = await getUserIdFromSession();
    if (userId === null) {
      throw new Error('User ID is null');
    }
    const existing = await client.db.saved_locations
      .select(['station_id'])
      .filter('user.id', userId)
      .filter('station_id', stationId)
      .getFirst();
    if (existing) {
      await client.db.saved_locations.delete(existing.id);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function formToFavorites(name: string, stationId: string) {
  try {
    const userId = await getUserIdFromSession();
    if (userId === null) {
      throw new Error('User ID is null');
    }

    const existing = await client.db.saved_locations
      .select(['station_id'])
      .filter('user.id', userId)
      .filter('station_id', stationId)
      .getFirst();

    if (existing) {
      //update existing id
      await client.db.saved_locations.update(existing.id, {
        nickname: name,
      });
    } else {
      //create new
      await client.db.saved_locations.create({
        user: {
          id: userId,
        },
        station_id: stationId,
        nickname: name,
      });
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function resetFavoriteName(stationId: string) {
  try {
    const userId = await getUserIdFromSession();
    if (userId === null) {
      throw new Error('User ID is null');
    }
    const currStation = await getStationById(stationId);

    const existing = await client.db.saved_locations
      .select(['station_id'])
      .filter('user.id', userId)
      .filter('station_id', stationId)
      .getFirst();
    if (existing) {
      await client.db.saved_locations.update(existing.id, {
        nickname: currStation.name,
      });
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function nextFavoriteStation(coordinates: Coordinates) {
  const nearbyStations = await loadNearbyStations(
    coordinates.lat,
    coordinates.lon
  );

  for (const station of nearbyStations) {
    if (station.num_docks_available > 2) {
      return station;
    }
  }
}
