import type { APIRoute } from 'astro';
import { getNotificationPrefs, updateNotificationPrefs } from '../../../lib/services/notificationService';
import { notificationPrefsSchema } from '../../../lib/validation/schemas';

export const GET: APIRoute = async () => {
  try {
    const prefs = await getNotificationPrefs();
    return Response.json({ pendingModerationEnabled: prefs.pendingModerationEnabled });
  } catch (error) {
    console.error('Could not load notification preferences:', error);
    return Response.json({ error: 'Could not load notification preferences' }, { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const body = notificationPrefsSchema.pick({ pendingModerationEnabled: true }).parse(await request.json());
    const prefs = await updateNotificationPrefs(body);
    return Response.json({ success: true, pendingModerationEnabled: prefs.pendingModerationEnabled });
  } catch (error) {
    console.error('Could not save notification preferences:', error);
    return Response.json({ error: 'Could not save notification preferences' }, { status: 400 });
  }
};
