import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'engage-moderation-events';

export default {
  idSuffix: collectionIdSuffix,
  displayName: 'Engage Moderation Events',
  displayField: 'action',
  fields: [
    { key: 'siteId', displayName: 'Site ID', type: 'TEXT' },
    { key: 'commentId', displayName: 'Comment ID', type: 'TEXT' },
    { key: 'action', displayName: 'Action', type: 'TEXT' },
    { key: 'actorReference', displayName: 'Actor Reference', type: 'TEXT' },
    { key: 'reasonCode', displayName: 'Reason Code', type: 'TEXT' },
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
