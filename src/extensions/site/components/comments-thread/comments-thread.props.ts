import type { A11y, Direction, Image } from '@wix/editor-react-types';

export type CommentItem = {
  name: string;
  authorName: string;
  avatar?: Image;
  /** @min 1 @max 5 */
  rating?: number;
  date: string;
  content: string;
  /** @min 0 */
  likesCount?: number;
  /** @min 0 */
  repliesCount?: number;
  badge?: string;
};

export type CommentsThreadProps = {
  id: string;
  className?: string;
  direction?: Direction;
  a11y?: A11y;

  title?: string;
  subtitle?: string;
  ratingLabel?: string;
  composerPlaceholder?: string;
  submitButtonLabel?: string;
  emptyTitle?: string;
  emptySubtitle?: string;
  loadMoreLabel?: string;
  replyButtonLabel?: string;
  likeButtonLabel?: string;
  planName?: string;
  isPro?: boolean;
  upgradeNoticeLabel?: string;

  comments?: Array<CommentItem>;

  elementProps?: {
    commentsThreadHeader?: { className?: string };
    commentsThreadTitle?: { className?: string };
    commentsThreadSubtitle?: { className?: string };
    commentsThreadComposer?: { className?: string };
    commentsThreadTextarea?: { className?: string };
    commentsThreadSubmitButton?: { className?: string; a11y?: A11y };
    commentsThreadList?: { className?: string };
    commentsThreadItem?: { className?: string };
    commentsThreadAuthorName?: { className?: string };
    commentsThreadBadge?: { className?: string };
    commentsThreadDate?: { className?: string };
    commentsThreadRating?: { className?: string };
    commentsThreadContent?: { className?: string };
    commentsThreadActions?: { className?: string };
    commentsThreadLikeButton?: { className?: string; a11y?: A11y };
    commentsThreadReplyButton?: { className?: string; a11y?: A11y };
    commentsThreadEmptyState?: { className?: string };
    commentsThreadEmptyTitle?: { className?: string };
    commentsThreadEmptySubtitle?: { className?: string };
    commentsThreadLoadMoreButton?: { className?: string; a11y?: A11y };
  };
};

export const defaultProps = {
  title: 'Community Discussion & Reviews',
  subtitle: 'Join the conversation, leave feedback, and share your thoughts with our community.',
  ratingLabel: 'Your Rating',
  composerPlaceholder: 'Write a comment or review...',
  submitButtonLabel: 'Post Comment',
  emptyTitle: 'No comments yet',
  emptySubtitle: 'Be the first to share your thoughts and start the conversation!',
  loadMoreLabel: 'Load more comments',
  replyButtonLabel: 'Reply',
  likeButtonLabel: 'Like',
  comments: [
    {
      name: 'comment-sarah',
      authorName: 'Sarah Jenkins',
      badge: 'Verified Customer',
      rating: 5,
      date: '2 hours ago',
      content: 'This service exceeded my expectations! The support team was responsive and helpful throughout.',
      likesCount: 12,
      repliesCount: 2,
      avatar: {
        url: 'https://static.wixstatic.com/media/11062b_2f97b87dcea2446fa48e9ad9c5457ae1~mv2.jpg',
        uri: '11062b_2f97b87dcea2446fa48e9ad9c5457ae1~mv2.jpg',
        alt: 'Sarah Jenkins avatar',
      },
    },
    {
      name: 'comment-david',
      authorName: 'David Chen',
      badge: 'Member',
      rating: 5,
      date: 'Yesterday',
      content: 'Great attention to detail and polished interface. Setup was seamless and it worked right out of the box.',
      likesCount: 8,
      repliesCount: 0,
      avatar: {
        url: 'https://static.wixstatic.com/media/11062b_73f31c7e7d3544c69dc8ecd8d34c5717~mv2.jpg',
        uri: '11062b_73f31c7e7d3544c69dc8ecd8d34c5717~mv2.jpg',
        alt: 'David Chen avatar',
      },
    },
    {
      name: 'comment-amara',
      authorName: 'Amara Okafor',
      badge: 'Community Contributor',
      rating: 4,
      date: '3 days ago',
      content: 'Intuitive design and fast performance. Would definitely recommend to anyone looking for a reliable comments solution.',
      likesCount: 5,
      repliesCount: 1,
      avatar: {
        url: 'https://static.wixstatic.com/media/11062b_3682ebfcb08e4da5b3168b62819a1e68~mv2.jpg',
        uri: '11062b_3682ebfcb08e4da5b3168b62819a1e68~mv2.jpg',
        alt: 'Amara Okafor avatar',
      },
    },
  ],
  elementProps: {
    commentsThreadSubmitButton: {
      a11y: { ariaLabel: 'Submit comment' },
    },
    commentsThreadLikeButton: {
      a11y: { ariaLabel: 'Like this comment' },
    },
    commentsThreadReplyButton: {
      a11y: { ariaLabel: 'Reply to this comment' },
    },
    commentsThreadLoadMoreButton: {
      a11y: { ariaLabel: 'Load more comments' },
    },
  },
} as const satisfies Omit<CommentsThreadProps, 'id' | 'className'>;
