import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'engage-notification-prefs';

export default {
  idSuffix: collectionIdSuffix,
  displayName: 'Engage Notification Preferences',
  displayField: 'ownerNotificationEmail',
  fields: [
    { key: 'siteId', displayName: 'Site ID', type: 'TEXT' },
    { key: 'ownerNotificationEmail', displayName: 'Owner Notification Email', type: 'TEXT' },
    { key: 'newSubmissionEnabled', displayName: 'New Submission Alerts', type: 'BOOLEAN' },
    { key: 'pendingModerationEnabled', displayName: 'Pending Moderation Alerts', type: 'BOOLEAN' },
    { key: 'replyNotificationEnabled', displayName: 'Reply Notifications', type: 'BOOLEAN' },
    { key: 'weeklySummaryEnabled', displayName: 'Weekly Summary', type: 'BOOLEAN' },
  ],
  dataPermissions: {
    itemInsert: 'PRIVILEGED',
    itemRead: 'PRIVILEGED',
    itemRemove: 'PRIVILEGED',
    itemUpdate: 'PRIVILEGED',
  },
  indexes: [],
  initialData: [],
} satisfies DataCollection;
