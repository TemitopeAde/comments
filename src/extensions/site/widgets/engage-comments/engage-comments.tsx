import React, { type FC, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';
import styles from './engage-comments.module.css';
import type { EngageComment } from '../../../../lib/types';

interface WidgetProps {
  widgetKey?: string;
  targetType?: string;
  targetReference?: string;
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  starColor?: string;
  enableRatings?: string;
  enableReplies?: string;
  enableReactions?: string;
  allowGuest?: string;
  requireApproval?: string;
  font?: string;
  maxChars?: string;
}

const EngageCommentsWidget: FC<WidgetProps> = ({
  widgetKey = 'engage-comments',
  targetType = 'generalPage',
  targetReference = 'home',
  title = 'Community Feedback & Reviews',
  subtitle = 'Join the conversation and share your verified thoughts',
  primaryColor = '#3899ec',
  starColor = '#ffb800',
  enableRatings = 'true',
  enableReplies = 'true',
  enableReactions = 'true',
  allowGuest = 'true',
  font,
  maxChars = '1000',
}) => {
  const isRatingsEnabled = enableRatings !== 'false';
  const isRepliesEnabled = enableReplies !== 'false';
  const isReactionsEnabled = enableReactions !== 'false';
  const isGuestPostingEnabled = allowGuest !== 'false';
  const maxCharacterLimit = parseInt(maxChars, 10) || 1000;
  let fontFamily: string | undefined;
  try {
    fontFamily = font ? (JSON.parse(font) as { font?: string }).font : undefined;
  } catch {
    fontFamily = undefined;
  }

  const [comments, setComments] = useState<EngageComment[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [sort, setSort] = useState<'newest' | 'oldest' | 'most-liked'>('newest');

  // Form state
  const [authorName, setAuthorName] = useState<string>('');
  const [contentText, setContentText] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Actor session id for reactions & guests
  const [actorKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        let key = localStorage.getItem('engage_actor_key');
        if (!key) {
          key = `visitor_${Math.random().toString(36).slice(2, 10)}`;
          localStorage.setItem('engage_actor_key', key);
        }
        return key;
      } catch {
        // Private browsing or blocked storage should not prevent the widget from loading.
      }
    }
    return `visitor_${Math.random().toString(36).slice(2, 10)}`;
  });

  // Track liked comments locally
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Replies state
  const [openReplyFormId, setOpenReplyFormId] = useState<string | null>(null);
  const [replyAuthorName, setReplyAuthorName] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('');
  const [replySubmitting, setReplySubmitting] = useState<boolean>(false);
  const [repliesMap, setRepliesMap] = useState<Record<string, EngageComment[]>>({});
  const [showRepliesMap, setShowRepliesMap] = useState<Record<string, boolean>>({});

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        widgetKey,
        targetType,
        sort,
        limit: '20',
      });
      if (targetReference) params.append('targetReference', targetReference);

      const res = await fetch(`/api/comments?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.items || []);
        setTotalCount(data.totalCount || 0);
        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      }
    } catch (e) {
      console.error('Failed to load comments:', e);
    } finally {
      setLoading(false);
    }
  }, [widgetKey, targetType, targetReference, sort]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGuestPostingEnabled) return;
    if (!contentText.trim()) return;

    try {
      setSubmitting(true);
      setStatusMessage(null);

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetKey,
          targetType,
          targetReference,
          authorDisplayName: authorName.trim() || 'Guest Visitor',
          contentText: contentText.trim(),
          rating: isRatingsEnabled ? rating : null,
          clientSessionId: actorKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit comment');
      }

      setStatusMessage({
        type: 'success',
        text: data.message || 'Comment posted successfully!',
      });
      setContentText('');
      fetchComments();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType: 'like', actorKey }),
      });
      if (res.ok) {
        const data = await res.json();
        setLikedMap((prev) => ({ ...prev, [commentId]: data.isLiked }));
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, reactionCount: data.reactionCount } : c))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleViewReplies = async (commentId: string) => {
    const isCurrentlyOpen = !!showRepliesMap[commentId];
    setShowRepliesMap((prev) => ({ ...prev, [commentId]: !isCurrentlyOpen }));

    if (!isCurrentlyOpen && !repliesMap[commentId]) {
      try {
        const res = await fetch(`/api/comments/${commentId}/replies`);
        if (res.ok) {
          const data = await res.json();
          setRepliesMap((prev) => ({ ...prev, [commentId]: data.items || [] }));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!replyText.trim()) return;

    try {
      setReplySubmitting(true);
      const res = await fetch(`/api/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetKey,
          authorDisplayName: replyAuthorName.trim() || 'Guest',
          contentText: replyText.trim(),
          clientSessionId: actorKey,
        }),
      });

      if (res.ok) {
        setReplyText('');
        setOpenReplyFormId(null);
        // Refresh replies for this comment
        const repliesRes = await fetch(`/api/comments/${commentId}/replies`);
        if (repliesRes.ok) {
          const data = await repliesRes.json();
          setRepliesMap((prev) => ({ ...prev, [commentId]: data.items || [] }));
          setShowRepliesMap((prev) => ({ ...prev, [commentId]: true }));
        }
        // Increment replyCount locally
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, replyCount: (c.replyCount || 0) + 1 } : c))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReplySubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={styles.root}
      style={
        {
          '--primary-color': primaryColor,
          '--star-color': starColor,
          fontFamily,
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {isRatingsEnabled && totalReviews > 0 && (
          <div className={styles.ratingOverview}>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${star <= Math.round(averageRating) ? styles.starFilled : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{averageRating.toFixed(1)}</span>
            <span style={{ color: '#64748b', fontSize: 13 }}>({totalReviews} customer reviews)</span>
          </div>
        )}
      </div>

      {/* Composer */}
      <form className={styles.composer} onSubmit={handleSubmitComment}>
        {statusMessage && (
          <div className={statusMessage.type === 'success' ? styles.bannerSuccess : styles.bannerError}>
            {statusMessage.text}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            className={styles.inputField}
            style={{ flex: 1, minWidth: 200 }}
            placeholder="Your name or nickname"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            disabled={!isGuestPostingEnabled}
          />

          {isRatingsEnabled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>Your Rating:</span>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`${styles.star} ${star <= (hoverRating || rating) ? styles.starFilled : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} stars`}
                    aria-pressed={rating === star}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <textarea
          className={`${styles.inputField} ${styles.textareaField}`}
          placeholder="Share your comments, questions, or reviews..."
          value={contentText}
          maxLength={maxCharacterLimit}
          onChange={(e) => setContentText(e.target.value)}
          required
          disabled={!isGuestPostingEnabled}
        />

        <div className={styles.composerActions}>
          <span className={styles.charCount}>
            {contentText.length} / {maxCharacterLimit} characters
          </span>
          <button type="submit" className={styles.submitBtn} disabled={!isGuestPostingEnabled || submitting || !contentText.trim()}>
            {!isGuestPostingEnabled ? 'Guest posting disabled' : submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Toolbar / Sort */}
      <div className={styles.toolbar}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>
          {totalCount} {totalCount === 1 ? 'Comment' : 'Comments'}
        </span>
        <select
          className={styles.sortSelect}
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          aria-label="Sort comments"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="most-liked">Most Liked</option>
        </select>
      </div>

      {/* Comment List */}
      <div className={styles.commentsList}>
        {loading ? (
          <div className={styles.emptyState}>Loading discussions...</div>
        ) : comments.length === 0 ? (
          <div className={styles.emptyState}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>No comments yet.</p>
            <p style={{ margin: '4px 0 0 0', fontSize: 13 }}>Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className={`${styles.commentCard} ${comment.isPinned ? styles.pinnedCard : ''}`}
            >
              <div className={styles.commentHeader}>
                <div className={styles.authorMeta}>
                  <div className={styles.avatar}>{getInitials(comment.authorDisplayName)}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className={styles.authorName}>{comment.authorDisplayName}</span>
                      {comment.authorType === 'owner' && (
                        <span className={`${styles.badge} ${styles.badgeOwner}`}>Site Owner</span>
                      )}
                      {comment.isPinned && (
                        <span className={`${styles.badge} ${styles.badgePinned}`}>Pinned</span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>
                      {new Date(comment._createdDate || '').toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {isRatingsEnabled && comment.rating && (
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`${styles.star} ${star <= (comment.rating || 0) ? styles.starFilled : ''}`}
                        style={{ cursor: 'default' }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className={styles.commentBody}>{comment.contentText}</p>

              <div className={styles.commentFooter}>
                <div className={styles.commentActions}>
                  {isReactionsEnabled && (
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${likedMap[comment._id] ? styles.actionBtnLiked : ''}`}
                      onClick={() => handleToggleLike(comment._id)}
                    >
                      <span>{likedMap[comment._id] ? '❤️' : '🤍'}</span>
                      <span>{comment.reactionCount || 0}</span>
                    </button>
                  )}

                  {isRepliesEnabled && (
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() =>
                        setOpenReplyFormId(openReplyFormId === comment._id ? null : comment._id)
                      }
                    >
                      <span>💬</span>
                      <span>Reply</span>
                    </button>
                  )}

                  {isRepliesEnabled && (comment.replyCount || 0) > 0 && (
                    <button
                      type="button"
                      className={styles.actionBtn}
                      style={{ color: '#2563eb' }}
                      onClick={() => handleToggleViewReplies(comment._id)}
                    >
                      {showRepliesMap[comment._id]
                        ? 'Hide replies'
                        : `View ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`}
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Reply Form */}
              {openReplyFormId === comment._id && (
                <div className={styles.replyComposer}>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Your name"
                    value={replyAuthorName}
                    onChange={(e) => setReplyAuthorName(e.target.value)}
                  />
                  <textarea
                    className={styles.inputField}
                    placeholder="Write a reply..."
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => setOpenReplyFormId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.submitBtn}
                      disabled={replySubmitting || !replyText.trim()}
                      onClick={() => handleSubmitReply(comment._id)}
                    >
                      {replySubmitting ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              )}

              {/* Threaded Replies */}
              {showRepliesMap[comment._id] && repliesMap[comment._id] && (
                <div className={styles.replyThread}>
                  {repliesMap[comment._id].map((reply) => (
                    <div key={reply._id} style={{ fontSize: 13 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600 }}>{reply.authorDisplayName}</span>
                        {reply.authorType === 'owner' && (
                          <span className={`${styles.badge} ${styles.badgeOwner}`}>Site Owner</span>
                        )}
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>
                          {new Date(reply._createdDate || '').toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: '#334155' }}>{reply.contentText}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className={styles.footerBranding}>Powered by Engage Comments</div>
    </div>
  );
};

export default reactToWebComponent(EngageCommentsWidget, React, ReactDOM as any, {
  props: {
    widgetKey: 'string',
    targetType: 'string',
    targetReference: 'string',
    title: 'string',
    subtitle: 'string',
    primaryColor: 'string',
    starColor: 'string',
    enableRatings: 'string',
    enableReplies: 'string',
    enableReactions: 'string',
    allowGuest: 'string',
    requireApproval: 'string',
    font: 'string',
    maxChars: 'string',
  },
});
