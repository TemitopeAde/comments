import type { APIRoute } from 'astro';
import { memoryStore } from '../../../lib/services/dataAccess';

export const GET: APIRoute = async () => {
  try {
    return Response.json({
      periodKey: memoryStore.usage.periodKey,
      commentsCreated: memoryStore.usage.commentsCreated,
      commentsLimit: memoryStore.usage.commentsLimit,
      planName: memoryStore.usage.planName,
      isPro: memoryStore.usage.isPro,
      status: 'active',
      renewalDate: new Date(Date.now() + 3600000 * 24 * 30).toISOString(),
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
