import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'engage-comments';

export default {
  idSuffix: collectionIdSuffix,
  displayName: 'Engage Comments',
  displayField: 'authorDisplayName',
  fields: [
    { key: 'siteId', displayName: 'Site ID', type: 'TEXT' },
    { key: 'widgetKey', displayName: 'Widget Key', type: 'TEXT' },
    { key: 'targetType', displayName: 'Target Type', type: 'TEXT' },
    { key: 'targetReference', displayName: 'Target Reference', type: 'TEXT' },
    { key: 'parentCommentId', displayName: 'Parent Comment ID', type: 'TEXT' },
    { key: 'threadRootId', displayName: 'Thread Root ID', type: 'TEXT' },
    { key: 'authorType', displayName: 'Author Type', type: 'TEXT' },
    { key: 'authorMemberId', displayName: 'Author Member ID', type: 'TEXT' },
    { key: 'authorDisplayName', displayName: 'Author Display Name', type: 'TEXT' },
    { key: 'authorAvatarReference', displayName: 'Author Avatar', type: 'TEXT' },
    { key: 'contentText', displayName: 'Comment Content', type: 'TEXT' },
    { key: 'rating', displayName: 'Rating', type: 'NUMBER' },
    { key: 'status', displayName: 'Status', type: 'TEXT' },
    { key: 'isPinned', displayName: 'Is Pinned', type: 'BOOLEAN' },
    { key: 'reactionCount', displayName: 'Reaction Count', type: 'NUMBER' },
    { key: 'replyCount', displayName: 'Reply Count', type: 'NUMBER' },
    { key: 'publishedAt', displayName: 'Published At', type: 'DATETIME' },
    { key: 'moderatedAt', displayName: 'Moderated At', type: 'DATETIME' },
    { key: 'moderatedBy', displayName: 'Moderated By', type: 'TEXT' },
    { key: 'schemaVersion', displayName: 'Schema Version', type: 'NUMBER' },
  ],
  dataPermissions: {
    itemInsert: 'PRIVILEGED',
    itemRead: 'ANYONE',
    itemRemove: 'PRIVILEGED',
    itemUpdate: 'PRIVILEGED',
  },
  indexes: [
    {
      fields: [{ path: 'widgetKey' }, { path: 'status' }],
    },
  ],
  initialData: [],
} satisfies DataCollection;
