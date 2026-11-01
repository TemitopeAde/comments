import type { A11y, Direction, Image } from '@wix/editor-react-types';

export type TestimonialItem = {
  name: string;
  authorName: string;
  authorRole?: string;
  avatar?: Image;
  /** @min 1 @max 5 */
  rating?: number;
  quoteText: string;
  verifiedBadge?: string;
};

export type TestimonialsGridProps = {
  id: string;
  className?: string;
  direction?: Direction;
  a11y?: A11y;

  title?: string;
  subtitle?: string;
  ratingSummary?: string;

  testimonials?: Array<TestimonialItem>;

  elementProps?: {
    testimonialsGridHeader?: { className?: string };
    testimonialsGridTitle?: { className?: string };
    testimonialsGridSubtitle?: { className?: string };
    testimonialsGridRatingSummary?: { className?: string };
    testimonialsGridContainer?: { className?: string };
    testimonialsGridCard?: { className?: string };
    testimonialsGridStars?: { className?: string };
    testimonialsGridQuote?: { className?: string };
    testimonialsGridAuthorRow?: { className?: string };
    testimonialsGridAuthorName?: { className?: string };
    testimonialsGridAuthorRole?: { className?: string };
    testimonialsGridBadge?: { className?: string };
  };
};

export const defaultProps = {
  title: 'Client Testimonials & Reviews',
  subtitle: 'Discover what verified clients and customers have to say about their experience with us.',
  ratingSummary: '★ 4.9 / 5.0 rated by over 250+ clients',
  testimonials: [
    {
      name: 'testimonial-elena',
      authorName: 'Elena Rostova',
      authorRole: 'Founder, Studio Bloom',
      verifiedBadge: 'Verified Client',
      rating: 5,
      quoteText:
        'Engage Comments transformed how our audience interacts with our blog articles. Setup took less than two minutes and the moderation tools are top notch.',
      avatar: {
        url: 'https://static.wixstatic.com/media/11062b_2f97b87dcea2446fa48e9ad9c5457ae1~mv2.jpg',
        uri: '11062b_2f97b87dcea2446fa48e9ad9c5457ae1~mv2.jpg',
        alt: 'Elena Rostova avatar',
      },
    },
    {
      name: 'testimonial-marcus',
      authorName: 'Marcus Vance',
      authorRole: 'Product Director, Apex Co.',
      verifiedBadge: 'Verified Purchase',
      rating: 5,
      quoteText:
        'The star reviews and instant feedback gave our online store the social proof we needed to boost checkout conversions by 35%. Highly recommended!',
      avatar: {
        url: 'https://static.wixstatic.com/media/11062b_73f31c7e7d3544c69dc8ecd8d34c5717~mv2.jpg',
        uri: '11062b_73f31c7e7d3544c69dc8ecd8d34c5717~mv2.jpg',
        alt: 'Marcus Vance avatar',
      },
    },
    {
      name: 'testimonial-clara',
      authorName: 'Clara Dupont',
      authorRole: 'Community Lead, Nexa Network',
      verifiedBadge: 'Verified Member',
      rating: 5,
      quoteText:
        'The threaded replies and clean design fit perfectly into our website branding. Our community discussion has never been more vibrant and engaged.',
      avatar: {
        url: 'https://static.wixstatic.com/media/11062b_3682ebfcb08e4da5b3168b62819a1e68~mv2.jpg',
        uri: '11062b_3682ebfcb08e4da5b3168b62819a1e68~mv2.jpg',
        alt: 'Clara Dupont avatar',
      },
    },
  ],
} as const satisfies Omit<TestimonialsGridProps, 'id' | 'className'>;
