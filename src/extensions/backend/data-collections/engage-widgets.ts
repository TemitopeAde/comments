import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'engage-widgets';

export default {
  idSuffix: collectionIdSuffix,
  displayName: 'Engage Widgets',
  displayField: 'widgetKey',
  fields: [
    { key: 'siteId', displayName: 'Site ID', type: 'TEXT' },
    { key: 'widgetKey', displayName: 'Widget Key', type: 'TEXT' },
    { key: 'targetType', displayName: 'Target Type', type: 'TEXT' },
    { key: 'targetReference', displayName: 'Target Reference', type: 'TEXT' },
    {
      key: 'settings',
      displayName: 'Settings',
      type: 'OBJECT',
      objectOptions: { fields: [] },
    },
    { key: 'status', displayName: 'Status', type: 'TEXT' },
  ],
  dataPermissions: {
    itemInsert: 'PRIVILEGED',
    itemRead: 'ANYONE',
    itemRemove: 'PRIVILEGED',
    itemUpdate: 'PRIVILEGED',
  },
  indexes: [
    {
      fields: [{ path: 'widgetKey' }],
      unique: true,
    },
  ],
  initialData: [],
} satisfies DataCollection;
