import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'engage-usage';

export default {
  idSuffix: collectionIdSuffix,
  displayName: 'Engage Usage',
  displayField: 'periodKey',
  fields: [
    { key: 'siteId', displayName: 'Site ID', type: 'TEXT' },
    { key: 'periodKey', displayName: 'Period Key', type: 'TEXT' },
    { key: 'commentsCreated', displayName: 'Comments Created', type: 'NUMBER' },
    { key: 'attachmentsStored', displayName: 'Attachments Stored', type: 'NUMBER' },
    { key: 'notificationsSent', displayName: 'Notifications Sent', type: 'NUMBER' },
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
