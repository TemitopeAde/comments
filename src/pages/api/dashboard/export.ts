import type { APIRoute } from 'astro';
import { exportCommentsToCsv } from '../../../lib/services/commentsService';

export const GET: APIRoute = async () => {
  try {
    const csv = await exportCommentsToCsv();
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="engage_comments_export.csv"',
      },
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
