import React, { useMemo } from 'react';
import type { FC } from 'react';
import classNames from 'classnames';
import styles from './testimonials-grid.module.css';
import type { TestimonialsGridProps, TestimonialItem } from './testimonials-grid.props';
import {
  resolveLocale,
  getLocaleDirection,
  getTranslation,
  type LocaleKey,
} from '../../../../lib/locales/translations';

export const TestimonialsGrid: FC<TestimonialsGridProps & { locale?: string }> = (props) => {
  const {
    id,
    className,
    direction,
    title,
    subtitle,
    ratingSummary,
    testimonials,
    elementProps,
    locale,
  } = props;

  const currentLocale = useMemo(() => resolveLocale(locale), [locale]);
  const effectiveDirection = direction || getLocaleDirection(currentLocale);
  const t = useMemo(() => {
    return (key: LocaleKey, params?: Record<string, string | number>) =>
      getTranslation(currentLocale, key, params);
  }, [currentLocale]);

  const displayTitle = title || t('testimonialsTitle');
  const displaySubtitle = subtitle !== undefined ? subtitle : t('testimonialsSubtitle');
  const displayRatingSummary = ratingSummary !== undefined ? ratingSummary : t('ratingSummaryDefault');

  const placeholderTestimonial: TestimonialItem = useMemo(() => ({
    name: 'placeholder-testimonial',
    authorName: t('clientName'),
    authorRole: t('clientRole'),
    verifiedBadge: t('verifiedClient'),
    rating: 5,
    quoteText: t('sampleTestimonial'),
  }), [t]);

  const items = testimonials && testimonials.length > 0 ? testimonials : [];

  const renderCard = (item: TestimonialItem) => {
    return (
      <article
        key={item.name}
        {...elementProps?.testimonialsGridCard}
        className={classNames(
          'testimonials-grid-card',
          styles.card,
          elementProps?.testimonialsGridCard?.className,
        )}
      >
        {item.rating ? (
          <div
            role="img"
            aria-label={t('ratingOutOf', { rating: item.rating })}
            {...elementProps?.testimonialsGridStars}
            className={classNames(
              'testimonials-grid-stars',
              styles.stars,
              elementProps?.testimonialsGridStars?.className,
            )}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={star <= (item.rating ?? 0) ? styles.starFilled : styles.starEmpty}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        ) : null}

        <blockquote
          {...elementProps?.testimonialsGridQuote}
          className={classNames(
            'testimonials-grid-quote',
            styles.quote,
            elementProps?.testimonialsGridQuote?.className,
          )}
        >
          &ldquo;{item.quoteText}&rdquo;
        </blockquote>

        <div
          {...elementProps?.testimonialsGridAuthorRow}
          className={classNames(
            'testimonials-grid-author-row',
            styles.authorRow,
            elementProps?.testimonialsGridAuthorRow?.className,
          )}
        >
          {item.avatar?.url ? (
            <img
              src={item.avatar.url}
              alt={item.avatar.alt || item.authorName}
              className={styles.avatarImg}
            />
          ) : (
            <div className={styles.avatarPlaceholder} aria-hidden="true">
              {item.authorName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className={styles.authorDetails}>
            <span
              {...elementProps?.testimonialsGridAuthorName}
              className={classNames(
                'testimonials-grid-author-name',
                styles.authorName,
                elementProps?.testimonialsGridAuthorName?.className,
              )}
            >
              {item.authorName}
            </span>
            {item.authorRole ? (
              <span
                {...elementProps?.testimonialsGridAuthorRole}
                className={classNames(
                  'testimonials-grid-author-role',
                  styles.authorRole,
                  elementProps?.testimonialsGridAuthorRole?.className,
                )}
              >
                {item.authorRole}
              </span>
            ) : null}
          </div>

          {item.verifiedBadge ? (
            <span
              {...elementProps?.testimonialsGridBadge}
              className={classNames(
                'testimonials-grid-badge',
                styles.badge,
                elementProps?.testimonialsGridBadge?.className,
              )}
            >
              {item.verifiedBadge}
            </span>
          ) : null}
        </div>
      </article>
    );
  };

  return (
    <section
      id={id}
      dir={effectiveDirection}
      className={classNames(
        'testimonials-grid',
        styles.root,
        styles.fallbackDirection,
        className,
      )}
    >
      <header
        {...elementProps?.testimonialsGridHeader}
        className={classNames(
          'testimonials-grid-header',
          styles.header,
          elementProps?.testimonialsGridHeader?.className,
        )}
      >
        <h2
          {...elementProps?.testimonialsGridTitle}
          className={classNames(
            'testimonials-grid-title',
            styles.title,
            elementProps?.testimonialsGridTitle?.className,
          )}
        >
          {displayTitle}
        </h2>
        {displaySubtitle ? (
          <p
            {...elementProps?.testimonialsGridSubtitle}
            className={classNames(
              'testimonials-grid-subtitle',
              styles.subtitle,
              elementProps?.testimonialsGridSubtitle?.className,
            )}
          >
            {displaySubtitle}
          </p>
        ) : null}
        {displayRatingSummary ? (
          <span
            {...elementProps?.testimonialsGridRatingSummary}
            className={classNames(
              'testimonials-grid-rating-summary',
              styles.ratingSummary,
              elementProps?.testimonialsGridRatingSummary?.className,
            )}
          >
            {displayRatingSummary}
          </span>
        ) : null}
      </header>

      <div
        {...elementProps?.testimonialsGridContainer}
        className={classNames(
          'testimonials-grid-container',
          styles.container,
          elementProps?.testimonialsGridContainer?.className,
        )}
      >
        {items.map((item) => renderCard(item))}

        {/* Keep card parts mounted during manifest generation even if items list is empty */}
        <div hidden={items.length > 0}>
          {renderCard(placeholderTestimonial)}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsGrid;
