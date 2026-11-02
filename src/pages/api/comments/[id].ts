import type { APIRoute } from 'astro';
import { deleteComment, toPublicComment, updateComment } from '../../../lib/services/commentsService';
import { updateCommentSchema } from '../../../lib/validation/schemas';

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) return Response.json({ error: 'Comment ID is required' }, { status: 400 });

    const clientSessionId = new URL(request.url).searchParams.get('clientSessionId');
    const comment = await deleteComment(id, clientSessionId);
    return Response.json({ success: true, item: toPublicComment(comment) });
  } catch (err: any) {
    const message = err.message;
    const status = message === 'Comment not found' ? 404 : message?.startsWith('You can only delete') ? 403 : 400;
    return Response.json({ error: message || 'Failed to delete comment' }, { status });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) return Response.json({ error: 'Comment ID is required' }, { status: 400 });

    const validated = updateCommentSchema.parse(await request.json());
    const comment = await updateComment(id, validated.contentText, validated.clientSessionId);
    return Response.json({ success: true, item: toPublicComment(comment) });
  } catch (err: any) {
    const message = err.errors ? err.errors.map((error: any) => error.message).join(', ') : err.message;
    const status = message === 'Comment not found' ? 404 : message?.startsWith('You can only edit') ? 403 : 400;
    return Response.json({ error: message || 'Failed to update comment' }, { status });
  }
};
