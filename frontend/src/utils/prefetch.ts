import api from '../api/client';

let platformsPrefetched = false;

export async function prefetchPlatforms(): Promise<void> {
  if (platformsPrefetched) return;
  platformsPrefetched = true;
  try {
    await api.get('/platforms', { params: { limit: 50 } });
  } catch {
    platformsPrefetched = false;
  }
}
