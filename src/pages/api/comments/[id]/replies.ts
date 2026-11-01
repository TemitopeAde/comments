import type { APIRoute } from 'astro';
import { createComment, getComment, getReplies } from '../../../../lib/services/commentsService';
import { createReplySchema } from '../../../../lib/validation/schemas';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return Response.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    const replies = await getReplies(id);
    return Response.json({ items: replies, totalCount: replies.length });
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to fetch replies' }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) {
      return Response.json({ error: 'Parent Comment ID required' }, { status: 400 });
    }

    const parent = await getComment(id);
    if (!parent) {
      return Response.json({ error: 'Parent comment not found' }, { status: 404 });
    }

    const body = await request.json();
    const validated = createReplySchema.parse(body);

    const reply = await createComment({
      widgetKey: validated.widgetKey,
      targetType: parent.targetType,
      targetReference: parent.targetReference,
      parentCommentId: id,
      authorDisplayName: validated.authorDisplayName,
      contentText: validated.contentText,
    });

    return Response.json({ success: true, item: reply }, { status: 201 });
  } catch (err: any) {
    return Response.json(
      { error: err.errors ? err.errors.map((e: any) => e.message).join(', ') : err.message },
      { status: 400 }
    );
  }
};
