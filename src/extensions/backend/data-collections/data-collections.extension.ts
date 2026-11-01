import { extensions } from '@wix/astro/builders'

import engageCommentsCollection from './engage-comments';

import engageWidgetsCollection from './engage-widgets';

import engageReactionsCollection from './engage-reactions';

import engageModerationEventsCollection from './engage-moderation-events';

import engageNotificationPrefsCollection from './engage-notification-prefs';

import engageUsageCollection from './engage-usage';

export default extensions.dataCollections({
  id: 'bed6d4db-a2a4-4081-9ad6-2b9828a05045',
  name: 'Data Collections',
  collections: [
    engageCommentsCollection,
    engageWidgetsCollection,
    engageReactionsCollection,
    engageModerationEventsCollection,
    engageNotificationPrefsCollection,
    engageUsageCollection
  ],
});
