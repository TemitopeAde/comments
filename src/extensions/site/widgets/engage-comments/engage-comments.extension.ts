import { extensions } from '@wix/astro/builders'

export default extensions.customElement({
  id: '724cb518-5452-40b8-b8c7-e45d3ce8e595',
  name: 'Engage Comments',
  width: {
    defaultWidth: 700,
    allowStretch: true
  },
  height: {
    defaultHeight: 250
  },
  installation: {
    autoAdd: true
  },
  presets: [
    {
      id: '10ba74b4-a718-46a9-8b21-300de07ae094',
      name: 'default',
      thumbnailUrl: '{{BASE_URL}}/engage-comments-thumbnail.png',
    },
  ],
  tagName: 'engage-comments',
  element: './extensions/site/widgets/engage-comments/engage-comments.tsx',
  settings: './extensions/site/widgets/engage-comments/engage-comments.panel.tsx',
});
