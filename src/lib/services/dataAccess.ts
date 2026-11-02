import { items } from '@wix/data';
import { auth } from '@wix/essentials';

export const COLLECTIONS = {
  COMMENTS: '@admin14744/comments/engage-comments',
  WIDGETS: '@admin14744/comments/engage-widgets',
  REACTIONS: '@admin14744/comments/engage-reactions',
  MODERATION_EVENTS: '@admin14744/comments/engage-moderation-events',
  NOTIFICATION_PREFS: '@admin14744/comments/engage-notification-prefs',
  USAGE: '@admin14744/comments/engage-usage',
};

// Elevate Wix Data methods for secure server-side execution
export const elevatedQuery = auth.elevate(items.query);
export const elevatedInsert = auth.elevate(items.insert);
export const elevatedUpdate = auth.elevate(items.update);
export const elevatedSave = auth.elevate(items.save);
export const elevatedRemove = auth.elevate(items.remove);
export const elevatedGet = auth.elevate(items.get);

// In-memory cache & fallback store for local development or sandbox environments
interface MemoryStore {
  comments: Map<string, any>;
  widgets: Map<string, any>;
  reactions: Map<string, any>;
  moderationEvents: any[];
  notificationPrefs: any;
  usage: any;
}

const memoryStore: MemoryStore = {
  comments: new Map(),
  widgets: new Map(),
  reactions: new Map(),
  moderationEvents: [],
  notificationPrefs: {
    ownerNotificationEmail: '',
    newSubmissionEnabled: true,
    pendingModerationEnabled: true,
    replyNotificationEnabled: true,
    weeklySummaryEnabled: false,
  },
  usage: {
    periodKey: new Date().toISOString().slice(0, 7),
    commentsCreated: 0,
    planName: 'Basic',
    isPro: false,
    publishedCommentsLimit: 3,
    submissionsLimit: 3,
    commentsLimit: 3,
  },
};

export { memoryStore };
