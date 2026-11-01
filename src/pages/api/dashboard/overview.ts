import type { APIRoute } from 'astro';
import { getDashboardOverview } from '../../../lib/services/commentsService';

export const GET: APIRoute = async () => {
  try {
    const data = await getDashboardOverview();
    return Response.json(data);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
