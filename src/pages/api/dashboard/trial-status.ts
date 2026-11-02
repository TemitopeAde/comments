import type { APIRoute } from 'astro';
import { appInstances } from '@wix/app-management';
import { auth } from '@wix/essentials';

const APP_ID = '4d6804b9-945b-4f25-9358-b20735992174';

export const GET: APIRoute = async () => {
  try {
    const tokenInfo = await auth.getTokenInfo();
    const instanceId = tokenInfo.instanceId;

    if (!instanceId) {
      return Response.json({ available: false, reason: 'missing-instance' }, { status: 503 });
    }

    const getAppInstance = auth.elevate(appInstances.getAppInstance);
    const { instance } = await getAppInstance();
    if (!instance) {
      return Response.json({ available: false, reason: 'missing-app-instance' }, { status: 503 });
    }

    const isBasic = instance.isFree === true;
    const freeTrialAvailable = instance.freeTrialAvailable === true;

    return Response.json({
      available: isBasic && freeTrialAvailable,
      isBasic,
      freeTrialAvailable,
      appId: APP_ID,
      instanceId,
      upgradeUrl: `https://www.wix.com/apps/upgrade/${APP_ID}?appInstanceId=${encodeURIComponent(instanceId)}`,
    });
  } catch (error) {
    console.error('Failed to load free-trial status:', error);
    return Response.json({ available: false, reason: 'unavailable' }, { status: 503 });
  }
};
