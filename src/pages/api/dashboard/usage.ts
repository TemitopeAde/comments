import type { APIRoute } from 'astro';
import { memoryStore } from '../../../lib/services/dataAccess';
import { getCurrentPlanName } from '../../../lib/services/commentsService';

export const GET: APIRoute = async () => {
  try {
    const planName = await getCurrentPlanName();
    return Response.json({
      periodKey: memoryStore.usage.periodKey,
      commentsCreated: memoryStore.usage.commentsCreated,
      commentsLimit: memoryStore.usage.commentsLimit,
      submissionsLimit: memoryStore.usage.submissionsLimit,
      publishedCommentsLimit: memoryStore.usage.publishedCommentsLimit,
      planName,
      isPro: planName.trim().toLowerCase() === 'pro',
      status: 'active',
      renewalDate: new Date(Date.now() + 3600000 * 24 * 30).toISOString(),
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
