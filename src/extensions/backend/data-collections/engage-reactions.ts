import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'engage-reactions';

export default {
  idSuffix: collectionIdSuffix,
  displayName: 'Engage Reactions',
  displayField: 'reactionType',
  fields: [
    { key: 'siteId', displayName: 'Site ID', type: 'TEXT' },
    { key: 'commentId', displayName: 'Comment ID', type: 'TEXT' },
    { key: 'actorKey', displayName: 'Actor Key', type: 'TEXT' },
    { key: 'reactionType', displayName: 'Reaction Type', type: 'TEXT' },
  ],
  dataPermissions: {
    itemInsert: 'PRIVILEGED',
    itemRead: 'ANYONE',
    itemRemove: 'PRIVILEGED',
    itemUpdate: 'PRIVILEGED',
  },
  indexes: [
    {
      fields: [{ path: 'commentId' }, { path: 'actorKey' }],
    },
  ],
  initialData: [],
} satisfies DataCollection;
