import type { APIRoute } from 'astro';
import { moderateComment } from '../../../lib/services/commentsService';
import { moderateCommentSchema } from '../../../lib/validation/schemas';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validated = moderateCommentSchema.parse(body);

    const updated = await moderateComment(
      validated.commentId,
      validated.action,
      validated.replyText,
      'dashboard-owner'
    );

    return Response.json({ success: true, item: updated });
  } catch (err: any) {
    return Response.json(
      { error: err.errors ? err.errors.map((e: any) => e.message).join(', ') : err.message },
      { status: 400 }
    );
  }
};
