import type { APIRoute } from 'astro';
import { listAllWidgets, updateWidgetConfig } from '../../../lib/services/widgetsService';

export const GET: APIRoute = async () => {
  try {
    const widgets = await listAllWidgets();
    return Response.json({ items: widgets });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { widgetKey = 'engage-comments', settings } = body;

    if (!settings) {
      return Response.json({ error: 'Settings object is required' }, { status: 400 });
    }

    const updated = await updateWidgetConfig(widgetKey, settings);
    return Response.json({ success: true, item: updated });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
};
