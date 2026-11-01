import type { APIRoute } from 'astro';
import { createComment, getPublishedComments } from '../../../lib/services/commentsService';
import { createCommentSchema } from '../../../lib/validation/schemas';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const widgetKey = url.searchParams.get('widgetKey') || 'engage-comments';
    const targetTypeValue = url.searchParams.get('targetType');
    const targetType = ['generalPage', 'blogPost', 'product', 'testimonialSection'].includes(targetTypeValue || '')
      ? (targetTypeValue as 'generalPage' | 'blogPost' | 'product' | 'testimonialSection')
      : undefined;
    const targetReference = url.searchParams.get('targetReference') || undefined;
    const sortValue = url.searchParams.get('sort');
    const sort = ['newest', 'oldest', 'most-liked', 'highest-rated'].includes(sortValue || '')
      ? (sortValue as 'newest' | 'oldest' | 'most-liked' | 'highest-rated')
      : 'newest';
    const limitValue = Number.parseInt(url.searchParams.get('limit') || '10', 10);
    const offsetValue = Number.parseInt(url.searchParams.get('offset') || '0', 10);
    const limit = Number.isFinite(limitValue) ? Math.min(Math.max(limitValue, 1), 50) : 10;
    const offset = Number.isFinite(offsetValue) ? Math.max(offsetValue, 0) : 0;

    const data = await getPublishedComments({
      widgetKey,
      targetType,
      targetReference,
      sort,
      limit,
      offset,
    });

    return Response.json(data);
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to fetch comments' }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validated = createCommentSchema.parse(body);

    const comment = await createComment({
      widgetKey: validated.widgetKey,
      targetType: validated.targetType,
      targetReference: validated.targetReference,
      authorDisplayName: validated.authorDisplayName,
      contentText: validated.contentText,
      rating: validated.rating,
      parentCommentId: validated.parentCommentId,
    });

    return Response.json(
      {
        success: true,
        item: comment,
        message:
          comment.status === 'pending'
            ? 'Your comment is awaiting moderation.'
            : 'Comment published successfully.',
      },
      { status: 201 }
    );
  } catch (err: any) {
    return Response.json(
      {
        error: err.errors ? err.errors.map((e: any) => e.message).join(', ') : err.message,
      },
      { status: 400 }
    );
  }
};
