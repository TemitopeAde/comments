import React, { useState, useMemo } from 'react';
import type { FC } from 'react';
import classNames from 'classnames';
import styles from './comments-thread.module.css';
import type { CommentsThreadProps, CommentItem } from './comments-thread.props';
import {
  resolveLocale,
  getLocaleDirection,
  getTranslation,
  type LocaleKey,
} from '../../../../lib/locales/translations';

export const CommentsThread: FC<CommentsThreadProps & { locale?: string }> = (props) => {
  const {
    id,
    className,
    direction,
    title,
    subtitle,
    ratingLabel,
    composerPlaceholder,
    submitButtonLabel,
    emptyTitle,
    emptySubtitle,
    loadMoreLabel,
    replyButtonLabel,
    likeButtonLabel,
    planName,
    isPro: propIsPro,
    upgradeNoticeLabel,
    comments,
    elementProps,
    locale,
  } = props;

  const currentLocale = useMemo(() => resolveLocale(locale), [locale]);
  const effectiveDirection = direction || getLocaleDirection(currentLocale);
  const t = useMemo(() => {
    return (key: LocaleKey, params?: Record<string, string | number>) =>
      getTranslation(currentLocale, key, params);
  }, [currentLocale]);

  const isPro = typeof propIsPro === 'boolean'
    ? propIsPro
    : (planName || '').trim().toLowerCase() === 'pro';
  const displayUpgradeNotice = upgradeNoticeLabel || t('upgradeToPostComments');

  const displayTitle = title || t('discussionTitle');
  const displaySubtitle = subtitle !== undefined ? subtitle : t('discussionSubtitle');
  const displayRatingLabel = ratingLabel || t('yourRating');
  const displayPlaceholder = composerPlaceholder || t('writeYourThought');
  const displaySubmitLabel = submitButtonLabel || t('postComment');
  const displayEmptyTitle = emptyTitle || t('emptyState');
  const displayEmptySubtitle = emptySubtitle !== undefined ? emptySubtitle : t('beTheFirst');
  const displayLoadMoreLabel = loadMoreLabel || t('loadMore');
  const displayReplyLabel = replyButtonLabel || t('reply');
  const displayLikeLabel = likeButtonLabel || t('like');

  const placeholderComment: CommentItem = useMemo(() => ({
    name: 'placeholder-comment',
    authorName: t('communityMember'),
    badge: t('memberBadge'),
    rating: 5,
    date: t('justNow'),
    content: t('sampleComment'),
    likesCount: 0,
    repliesCount: 0,
  }), [t]);

  const [composerRating, setComposerRating] = useState<number>(5);
  const [composerText, setComposerText] = useState<string>('');
  const [activeLikes, setActiveLikes] = useState<Record<string, boolean>>({});

  const items = comments && comments.length > 0 ? comments : [];

  const { a11y: submitA11y, ...submitProps } =
    elementProps?.commentsThreadSubmitButton ?? {};
  const { a11y: loadMoreA11y, ...loadMoreProps } =
    elementProps?.commentsThreadLoadMoreButton ?? {};
  const { a11y: likeA11y, ...likeProps } =
    elementProps?.commentsThreadLikeButton ?? {};
  const { a11y: replyA11y, ...replyProps } =
    elementProps?.commentsThreadReplyButton ?? {};

  const handleToggleLike = (name: string) => {
    setActiveLikes((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const renderComment = (item: CommentItem) => {
    const isLiked = Boolean(activeLikes[item.name]);
    const displayLikes = (item.likesCount ?? 0) + (isLiked ? 1 : 0);

    return (
      <article
        key={item.name}
        {...elementProps?.commentsThreadItem}
        className={classNames(
          'comments-thread-item',
          styles.item,
          elementProps?.commentsThreadItem?.className,
        )}
      >
        <div className={styles.itemHeader}>
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

          <div className={styles.authorMeta}>
            <div className={styles.authorRow}>
              <span
                {...elementProps?.commentsThreadAuthorName}
                className={classNames(
                  'comments-thread-author-name',
                  styles.authorName,
                  elementProps?.commentsThreadAuthorName?.className,
                )}
              >
                {item.authorName}
              </span>
              {item.badge ? (
                <span
                  {...elementProps?.commentsThreadBadge}
                  className={classNames(
                    'comments-thread-badge',
                    styles.badge,
                    elementProps?.commentsThreadBadge?.className,
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </div>
            <time
              {...elementProps?.commentsThreadDate}
              className={classNames(
                'comments-thread-date',
                styles.date,
                elementProps?.commentsThreadDate?.className,
              )}
            >
              {item.date}
            </time>
          </div>

          {item.rating ? (
            <div
              role="img"
              aria-label={t('ratingOutOf', { rating: item.rating })}
              {...elementProps?.commentsThreadRating}
              className={classNames(
                'comments-thread-rating',
                styles.rating,
                elementProps?.commentsThreadRating?.className,
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
        </div>

        <p
          {...elementProps?.commentsThreadContent}
          className={classNames(
            'comments-thread-content',
            styles.content,
            elementProps?.commentsThreadContent?.className,
          )}
        >
          {item.content}
        </p>

        <div
          {...elementProps?.commentsThreadActions}
          className={classNames(
            'comments-thread-actions',
            styles.actions,
            elementProps?.commentsThreadActions?.className,
          )}
        >
          <button
            type="button"
            {...likeProps}
            aria-label={likeA11y?.ariaLabel || displayLikeLabel}
            onClick={() => handleToggleLike(item.name)}
            className={classNames(
              'comments-thread-like-button',
              styles.likeButton,
              isLiked ? styles.likeButtonActive : undefined,
              likeProps.className,
            )}
          >
            <svg
              className={styles.actionIcon}
              viewBox="0 0 20 20"
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              />
            </svg>
            <span>{displayLikeLabel}</span>
            {displayLikes > 0 ? <span className={styles.countBadge}>({displayLikes})</span> : null}
          </button>

          <button
            type="button"
            {...replyProps}
            aria-label={replyA11y?.ariaLabel || displayReplyLabel}
            className={classNames(
              'comments-thread-reply-button',
              styles.replyButton,
              replyProps.className,
            )}
          >
            <svg
              className={styles.actionIcon}
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H13a5 5 0 015 5v1a1 1 0 11-2 0v-1a3 3 0 00-3-3H5.414l2.293 2.293a1 1 0 010 1.414z"
              />
            </svg>
            <span>{displayReplyLabel}</span>
            {(item.repliesCount ?? 0) > 0 ? (
              <span className={styles.countBadge}>({item.repliesCount})</span>
            ) : null}
          </button>
        </div>
      </article>
    );
  };

  return (
    <section
      id={id}
      dir={effectiveDirection}
      className={classNames(
        'comments-thread',
        styles.root,
        styles.fallbackDirection,
        className,
      )}
    >
      <header
        {...elementProps?.commentsThreadHeader}
        className={classNames(
          'comments-thread-header',
          styles.header,
          elementProps?.commentsThreadHeader?.className,
        )}
      >
        <h2
          {...elementProps?.commentsThreadTitle}
          className={classNames(
            'comments-thread-title',
            styles.title,
            elementProps?.commentsThreadTitle?.className,
          )}
        >
          {displayTitle}
        </h2>
        {displaySubtitle ? (
          <p
            {...elementProps?.commentsThreadSubtitle}
            className={classNames(
              'comments-thread-subtitle',
              styles.subtitle,
              elementProps?.commentsThreadSubtitle?.className,
            )}
          >
            {displaySubtitle}
          </p>
        ) : null}
      </header>

      <div
        {...elementProps?.commentsThreadComposer}
        className={classNames(
          'comments-thread-composer',
          styles.composer,
          elementProps?.commentsThreadComposer?.className,
        )}
      >
        {displayRatingLabel ? (
          <div className={styles.ratingBar}>
            <span className={styles.ratingBarLabel}>{displayRatingLabel}</span>
            <div className={styles.starSelector} aria-label={displayRatingLabel}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={star <= composerRating ? styles.starSelected : styles.starUnselected}
                  onClick={() => setComposerRating(star)}
                  aria-label={star === 1 ? t('rateStarSingle', { star }) : t('rateStarPlural', { star })}
                  aria-pressed={composerRating >= star}
                >
                  <svg className={styles.selectorStarIcon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <textarea
          {...elementProps?.commentsThreadTextarea}
          value={composerText}
          onChange={(e) => setComposerText(e.target.value)}
          placeholder={displayPlaceholder}
          rows={3}
          className={classNames(
            'comments-thread-textarea',
            styles.textarea,
            elementProps?.commentsThreadTextarea?.className,
          )}
        />

        <div className={styles.composerFooter}>
          <button
            type="button"
            {...submitProps}
            disabled={!isPro}
            aria-label={submitA11y?.ariaLabel || displaySubmitLabel}
            className={classNames(
              'comments-thread-submit-button',
              styles.submitButton,
              submitProps.className,
            )}
          >
            {displaySubmitLabel}
          </button>
        </div>
        {!isPro && (
          <div className={styles.upgradeNotice}>
            <span className={styles.upgradeText}>{displayUpgradeNotice}</span>
          </div>
        )}
      </div>

      <div
        {...elementProps?.commentsThreadList}
        className={classNames(
          'comments-thread-list',
          styles.list,
          elementProps?.commentsThreadList?.className,
        )}
      >
        {items.map((comment) => renderComment(comment))}

        {/* Keep item parts mounted during manifest generation even if empty */}
        <div hidden={items.length > 0}>
          {renderComment(placeholderComment)}
        </div>
      </div>

      {/* Always keep empty state in DOM with hidden attribute when comments exist */}
      <div
        {...elementProps?.commentsThreadEmptyState}
        hidden={items.length > 0}
        className={classNames(
          'comments-thread-empty-state',
          styles.emptyState,
          elementProps?.commentsThreadEmptyState?.className,
        )}
      >
        <h3
          {...elementProps?.commentsThreadEmptyTitle}
          className={classNames(
            'comments-thread-empty-title',
            styles.emptyTitle,
            elementProps?.commentsThreadEmptyTitle?.className,
          )}
        >
          {displayEmptyTitle}
        </h3>
        {displayEmptySubtitle ? (
          <p
            {...elementProps?.commentsThreadEmptySubtitle}
            className={classNames(
              'comments-thread-empty-subtitle',
              styles.emptySubtitle,
              elementProps?.commentsThreadEmptySubtitle?.className,
            )}
          >
            {displayEmptySubtitle}
          </p>
        ) : null}
      </div>

      {items.length > 0 && displayLoadMoreLabel ? (
        <div className={styles.loadMoreRow}>
          <button
            type="button"
            {...loadMoreProps}
            aria-label={loadMoreA11y?.ariaLabel || displayLoadMoreLabel}
            className={classNames(
              'comments-thread-load-more-button',
              styles.loadMoreButton,
              loadMoreProps.className,
            )}
          >
            {displayLoadMoreLabel}
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default CommentsThread;
