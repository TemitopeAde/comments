import type { APIRoute } from 'astro';
import { listDashboardComments } from '../../../lib/services/commentsService';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || undefined;
    const rating = url.searchParams.get('rating') ? parseInt(url.searchParams.get('rating')!, 10) : undefined;
    const search = url.searchParams.get('search') || undefined;
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const data = await listDashboardComments({
      status,
      rating,
      search,
      limit,
      offset,
    });

    return Response.json(data);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
