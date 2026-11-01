import type { APIRoute } from 'astro';
import { toggleReaction } from '../../../../lib/services/commentsService';
import { toggleReactionSchema } from '../../../../lib/validation/schemas';

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) {
      return Response.json({ error: 'Comment ID required' }, { status: 400 });
    }

    const body = await request.json();
    const validated = toggleReactionSchema.parse(body);

    const result = await toggleReaction(id, validated.reactionType, validated.actorKey);
    return Response.json({ success: true, ...result });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
};
