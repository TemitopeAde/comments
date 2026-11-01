import React from 'react';
import type { ComponentProps, FC } from 'react';
import {
  withDefaults,
  withFallbackPlaceholder,
} from '@wix/react-component-utils';
import Component from './testimonials-grid';
import { defaultProps } from './testimonials-grid.props';

const TestimonialsGridPreview: FC<ComponentProps<typeof Component>> = (props) => {
  return <Component {...props} />;
};

const TestimonialsGridPreviewWithFallback = withFallbackPlaceholder(TestimonialsGridPreview, {
  requiredDataFields: ['title'],
  rootClassName: 'testimonials-grid',
});

export default withDefaults(
  TestimonialsGridPreviewWithFallback,
  defaultProps,
);
