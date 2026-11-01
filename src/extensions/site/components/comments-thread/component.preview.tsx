import React from 'react';
import type { ComponentProps, FC } from 'react';
import {
  withDefaults,
  withFallbackPlaceholder,
} from '@wix/react-component-utils';
import Component from './comments-thread';
import { defaultProps } from './comments-thread.props';

const CommentsThreadPreview: FC<ComponentProps<typeof Component>> = (props) => {
  return <Component {...props} />;
};

const CommentsThreadPreviewWithFallback = withFallbackPlaceholder(CommentsThreadPreview, {
  requiredDataFields: ['title'],
  rootClassName: 'comments-thread',
});

export default withDefaults(
  CommentsThreadPreviewWithFallback,
  defaultProps,
);
