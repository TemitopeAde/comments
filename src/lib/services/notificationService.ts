import { appInstances } from '@wix/app-management';
import { emailTransmissions } from '@wix/email-transmissions';
import { auth } from '@wix/essentials';
import type { EngageComment } from '../types';
import { COLLECTIONS, elevatedQuery, elevatedSave, memoryStore } from './dataAccess';

const DEFAULT_NOTIFICATION_PREFS = {
  ownerNotificationEmail: '',
  newSubmissionEnabled: true,
  pendingModerationEnabled: false,
  replyNotificationEnabled: false,
  weeklySummaryEnabled: false,
};

export async function getNotificationPrefs() {
  const siteId = (await auth.getTokenInfo()).siteId || 'site-default';
  try {
    const result = await elevatedQuery(COLLECTIONS.NOTIFICATION_PREFS).eq('siteId', siteId).find();
    const stored = result.items?.[0];
    if (stored) return { ...DEFAULT_NOTIFICATION_PREFS, ...stored };
  } catch (error) {
    console.error('Could not load notification preferences:', error);
  }
  return { ...DEFAULT_NOTIFICATION_PREFS, ...memoryStore.notificationPrefs, siteId };
}

export async function updateNotificationPrefs(patch: { pendingModerationEnabled: boolean }) {
  const current = await getNotificationPrefs();
  const updated = { ...current, ...patch };
  try {
    await elevatedSave(COLLECTIONS.NOTIFICATION_PREFS, { ...updated, _id: updated._id || updated.siteId });
  } catch (error) {
    console.error('Could not save notification preferences:', error);
  }
  memoryStore.notificationPrefs = updated;
  return updated;
}

export async function notifyOwnerOfPendingComment(comment: EngageComment) {
  const prefs = await getNotificationPrefs();
  if (!prefs.pendingModerationEnabled || comment.status !== 'pending') return;

  const { site } = await auth.elevate(appInstances.getAppInstance)();
  const ownerEmail = site?.ownerInfo?.email;
  if (!ownerEmail) {
    console.warn('Pending comment email skipped: app instance did not provide the site owner email.');
    return;
  }

  const plainText = comment.contentText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const safeText = plainText.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char);
  try {
    await auth.elevate(emailTransmissions.sendEmailTransmission)({
      emailSubject: 'A comment is waiting for your approval',
      emailHtmlContent: `<p>${safeText}</p><p>From ${comment.authorDisplayName.replace(/[&<>"']/g, '')}</p><p>Open your Wix dashboard to review this comment.</p>`,
      senderName: 'Engage Comments',
      toRecipients: [{ emailAddress: ownerEmail }],
      type: 'TRANSACTIONAL',
    }, { idempotencyKey: comment._id });
  } catch (error) {
    console.error('Could not send pending comment notification:', error);
  }
}
