import { app } from '@wix/astro/builders';
import myPage from './extensions/dashboard/pages/my-page/my-page.extension.ts';

import dataCollections from './extensions/backend/data-collections/data-collections.extension.ts';

import engageComments from './extensions/site/widgets/engage-comments/engage-comments.extension.ts';

import commentsTools from './extensions/backend/app-tools/comments-tools/comments-tools.extension.ts';

import commentsThread from './extensions/site/components/comments-thread/comments-thread.extension.ts';

import testimonialsGrid from './extensions/site/components/testimonials-grid/testimonials-grid.extension.ts';

import toolsProvider from './extensions/backend/service-plugins/tools-provider/tools-provider.extension.ts';

export default app().use(myPage).use(dataCollections).use(engageComments).use(commentsTools).use(commentsThread).use(testimonialsGrid).use(toolsProvider);
