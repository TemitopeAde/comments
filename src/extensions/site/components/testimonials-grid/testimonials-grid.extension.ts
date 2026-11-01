import { extensions } from '@wix/astro/builders';
import { LAYOUT } from '@wix/react-component-schema';
import { withEditorElementDefaults } from '@wix/react-component-utils';
import { deepmerge } from 'deepmerge-ts';
import { editorElement } from './testimonials-grid.generated';
import { defaultProps } from './testimonials-grid.props';
import componentUrl from './component.tsx?url';
import componentPreviewUrl from './component.preview.tsx?url';

const editorElementWithDefaults = withEditorElementDefaults(
  editorElement,
  defaultProps,
);

export default extensions.editorReactComponent({
  id: 'a1ff0ba2-9659-4de5-bcbd-2772510beeaf',
  type: 'comments.TestimonialsGrid',
  displayName: 'Testimonials Grid',
  description: 'Responsive showcase grid of customer reviews and testimonials with star ratings and author badges.',
  editorElement: deepmerge(
    editorElementWithDefaults,
    {
      layout: {
        resizeDirection: LAYOUT.RESIZE_DIRECTION.horizontalAndVertical,
        contentResizeDirection: LAYOUT.CONTENT_RESIZE_DIRECTION.vertical,
      },
    },
  ) as unknown as Parameters<typeof extensions.editorReactComponent>[0]['editorElement'],
  installation: {
    staticContainer: 'HOMEPAGE',
    initialSize: {
      width: {
        sizingType: LAYOUT.SIZING_TYPE.pixels,
        pixels: 700,
      },
      height: {
        sizingType: LAYOUT.SIZING_TYPE.content,
      },
    },
  },
  resources: {
    client: {
      componentUrl,
    },
    editor: {
      componentUrl: componentPreviewUrl,
    },
  },
});
