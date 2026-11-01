import { extensions } from '@wix/astro/builders';

export default extensions.dashboardPage({
  id: 'c18ea05d-7a8d-4597-9dcf-75289acb1a27',
  title: 'Engage Comments',
  routePath: '',
  component: './extensions/dashboard/pages/my-page/my-page.tsx',
  fullPage: false,
  metaData: {
    searchable: true,
    description: 'Manage comments, reviews, testimonials, moderation, and widgets.',
  },
});
