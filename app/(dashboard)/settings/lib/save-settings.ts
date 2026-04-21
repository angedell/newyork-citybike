'use server';
import { getUserIdFromSession } from '@/lib/session';
import { getXataClient } from '@/lib/xata';

const client = getXataClient();

export async function saveSettings(value: string) {
  const sessId = await getUserIdFromSession();
  if (!sessId) {
    return;
  }
  await client.db.nextauth_users.update(sessId, {
    mapsToUse: value,
  });

  await new Promise((resolve) => setTimeout(resolve, 5)); // return {};
}

export async function loadSettings() {
  const sessId = await getUserIdFromSession();
  const data = await client.db.nextauth_users
    .select(['mapsToUse'])
    .filter('id', sessId)
    .getMany();
  return data[0]?.['mapsToUse'] ?? null;
}
