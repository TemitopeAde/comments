import React, { type FC, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';
import { httpClient } from '@wix/essentials';
import { Toaster, toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Heart, MessageCircle, Pencil, Trash2, ChevronDown, ChevronUp, LoaderCircle, X } from 'lucide-react';
import styles from './engage-comments.module.css';
import type { EngageComment } from '../../../../lib/types';

const DEFAULT_FONT = '16px helvetica-w01-roman';
const COMMENTS_PAGE_SIZE = 20;
const MAX_IMAGE_BYTES = 350 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
const COMMENT_PREVIEW_LENGTH = 500;
const API_ORIGIN = new URL(import.meta.url).origin;

const apiUrl = (path: string) => new URL(path, API_ORIGIN).toString();

const sanitizeRichText = (html: string) => {
  if (typeof document === 'undefined') return '';
  const template = document.createElement('template');
  template.innerHTML = html;
  template.content.querySelectorAll('script,style,iframe,object,embed,form').forEach((node) => node.remove());
  template.content.querySelectorAll('*').forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      if (attribute.name.toLowerCase().startsWith('on')) element.removeAttribute(attribute.name);
      if (attribute.name === 'href' && !/^(https?:|mailto:)/i.test(attribute.value)) {
        element.removeAttribute(attribute.name);
      }
      if (attribute.name === 'src' && !/^(https?:|data:image\/)/i.test(attribute.value)) {
        element.removeAttribute(attribute.name);
      }
    });
  });
  return template.innerHTML;
};

const getRichTextPreview = (html: string, maxLength: number) => {
  if (typeof document === 'undefined') return html.replace(/<[^>]*>/g, '').slice(0, maxLength);

  const container = document.createElement('div');
  container.innerHTML = sanitizeRichText(html);
  let remaining = maxLength;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node: Node | null;

  while ((node = walker.nextNode())) textNodes.push(node as Text);

  for (const textNode of textNodes) {
    if (remaining <= 0) {
      textNode.remove();
      continue;
    }
    if (textNode.data.length > remaining) {
      textNode.data = textNode.data.slice(0, remaining);
      remaining = 0;
    } else {
      remaining -= textNode.data.length;
    }
  }

  return container.innerHTML;
};

const CollapsibleRichText = ({ content, className }: { content: string; className?: string }) => {
  const [expanded, setExpanded] = useState(false);
  const plainText = getRichTextPlainTextForEditor(content);
  const isLong = plainText > COMMENT_PREVIEW_LENGTH;

  return (
    <>
      <div
        className={className}
        dangerouslySetInnerHTML={{
          __html: expanded || !isLong ? sanitizeRichText(content) : `${getRichTextPreview(content, COMMENT_PREVIEW_LENGTH)}…`,
        }}
      />
      {isLong && (
        <button
          type="button"
          className={styles.seeMoreButton}
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
        >
          {expanded ? 'See less' : 'See more'}
        </button>
      )}
    </>
  );
};

const getRichTextPlainText = (html: string) => {
  if (typeof document === 'undefined') return html.replace(/<[^>]*>/g, ' ');
  const container = document.createElement('div');
  container.innerHTML = html;
  return container.textContent?.replace(/\u00a0/g, ' ') || '';
};

const getRichTextPlainTextForEditor = (html: string) => {
  return getRichTextPlainText(html).trim().length;
};

const Spinner = () => <LoaderCircle className={styles.spinner} size={16} aria-hidden="true" />;

const compressImage = (file: File) => new Promise<string>((resolve, reject) => {
  if (!file.type.startsWith('image/')) {
    reject(new Error('Please choose an image file.'));
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    URL.revokeObjectURL(objectUrl);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext('2d');
    if (!context) {
      reject(new Error('This image could not be processed.'));
      return;
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    let dataUrl = canvas.toDataURL('image/webp', 0.78);
    let quality = 0.68;
    while (dataUrl.length > MAX_IMAGE_BYTES * 1.37 && quality >= 0.4) {
      dataUrl = canvas.toDataURL('image/webp', quality);
      quality -= 0.1;
    }

    if (dataUrl.length > MAX_IMAGE_BYTES * 1.37) {
      reject(new Error('That image is too large. Please choose a smaller image.'));
      return;
    }
    resolve(dataUrl);
  };
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error('This image could not be loaded.'));
  };
  image.src = objectUrl;
});

interface WidgetProps {
  widgetKey?: string;
  targetType?: string;
  targetReference?: string;
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  starColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  bodyColor?: string;
  buttonTextColor?: string;
  enableRatings?: string;
  enableReplies?: string;
  enableReactions?: string;
  allowGuest?: string;
  requireApproval?: string;
  font?: string;
  titleFont?: string;
  subtitleFont?: string;
  bodyFont?: string;
  buttonFont?: string;
  editorToolbar?: string;
  editorPlaceholder?: string;
}

type EditorToolbarOptions = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  orderedList: boolean;
  bulletList: boolean;
  link: boolean;
  image: boolean;
  clean: boolean;
};

const DEFAULT_EDITOR_TOOLBAR: EditorToolbarOptions = {
  bold: true,
  italic: true,
  underline: true,
  orderedList: true,
  bulletList: true,
  link: true,
  image: true,
  clean: true,
};

const EngageCommentsWidget: FC<WidgetProps> = ({
  widgetKey = 'engage-comments',
  targetType = 'generalPage',
  targetReference = 'home',
  title = 'Comments & Feedback',
  subtitle = 'Join the conversation and share your verified thoughts',
  primaryColor = '#3899ec',
  starColor = '#ffb800',
  titleColor = '#0f172a',
  subtitleColor = '#64748b',
  bodyColor = '#334155',
  buttonTextColor = '#ffffff',
  enableRatings = 'false',
  enableReplies = 'true',
  enableReactions = 'true',
  allowGuest = 'true',
  font,
  titleFont,
  subtitleFont,
  bodyFont,
  buttonFont,
  editorToolbar,
  editorPlaceholder = 'Share your comments, questions, or reviews...',
}) => {
  const isRatingsEnabled = enableRatings !== 'false';
  const isRepliesEnabled = enableReplies !== 'false';
  const isReactionsEnabled = enableReactions !== 'false';
  const isGuestPostingEnabled = allowGuest !== 'false';
  const parseFontFamily = (value?: string) => {
    try {
      const parsed = value ? JSON.parse(value) as { font?: string } : undefined;
      const fontValue = parsed?.font || value;
      if (!fontValue) return undefined;
      const familyDeclaration = fontValue.match(/font-family\s*:\s*([^;]+)/i);
      return (familyDeclaration?.[1] || fontValue).trim();
    } catch {
      const familyDeclaration = value?.match(/font-family\s*:\s*([^;]+)/i);
      return (familyDeclaration?.[1] || value)?.trim();
    }
  };
  const fontFamily = parseFontFamily(font) || DEFAULT_FONT;
  const titleFontFamily = parseFontFamily(titleFont) || fontFamily;
  const subtitleFontFamily = parseFontFamily(subtitleFont) || fontFamily;
  const bodyFontFamily = parseFontFamily(bodyFont) || fontFamily;
  const buttonFontFamily = parseFontFamily(buttonFont) || fontFamily;
  const toolbarOptions = useMemo<EditorToolbarOptions>(() => {
    try {
      return { ...DEFAULT_EDITOR_TOOLBAR, ...(editorToolbar ? JSON.parse(editorToolbar) : {}) };
    } catch {
      return DEFAULT_EDITOR_TOOLBAR;
    }
  }, [editorToolbar]);

  const [comments, setComments] = useState<EngageComment[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [sort, setSort] = useState<'newest' | 'oldest' | 'most-liked'>('newest');
  const commentsRef = useRef<EngageComment[]>([]);
  const hasMoreRef = useRef<boolean>(false);
  const loadingMoreRef = useRef<boolean>(false);
  const commentsRequestRef = useRef<number>(0);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);

  // Form state
  const [authorName, setAuthorName] = useState<string>('');
  const [showNameField, setShowNameField] = useState<boolean>(false);
  const [memberName, setMemberName] = useState<string | null>(null);
  const [memberResolved, setMemberResolved] = useState<boolean>(false);
  const [contentText, setContentText] = useState<string>('');
  const [contentLength, setContentLength] = useState<number>(0);
  const [blockedWords, setBlockedWords] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const editingTextRef = useRef<string>('');
  const [editingLength, setEditingLength] = useState<number>(0);
  const [savingEdit, setSavingEdit] = useState<boolean>(false);
  const [pendingReactionId, setPendingReactionId] = useState<string | null>(null);
  const editDialogRef = useRef<HTMLDivElement>(null);
  const [deleteConfirmComment, setDeleteConfirmComment] = useState<EngageComment | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const deleteDialogRef = useRef<HTMLDivElement>(null);
  const composerQuillRef = useRef<ReactQuill | null>(null);
  const replyQuillRef = useRef<ReactQuill | null>(null);
  const editingQuillRef = useRef<ReactQuill | null>(null);

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
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyAuthorName, setReplyAuthorName] = useState<string>('');
  const [showReplyNameField, setShowReplyNameField] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [replyEditorReady, setReplyEditorReady] = useState<boolean>(false);
  const [replySubmitting, setReplySubmitting] = useState<boolean>(false);
  const [repliesMap, setRepliesMap] = useState<Record<string, EngageComment[]>>({});
  const [showRepliesMap, setShowRepliesMap] = useState<Record<string, boolean>>({});

  const findBlockedWords = useCallback((content: string) => {
    const plainText = getRichTextPlainText(content).toLowerCase();
    return blockedWords.filter((word, index) => (
      word && plainText.includes(word.toLowerCase()) &&
      blockedWords.findIndex((candidate) => candidate.toLowerCase() === word.toLowerCase()) === index
    ));
  }, [blockedWords]);

  const blockedCommentWords = findBlockedWords(contentText);
  const blockedReplyWords = findBlockedWords(replyText);

  useEffect(() => {
    httpClient.fetchWithAuth(apiUrl(`/api/widgets/${encodeURIComponent(widgetKey)}/public-config`))
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data.blockedWords)) setBlockedWords(data.blockedWords);
      })
      .catch((error) => console.error('Failed to load moderation settings:', error));
  }, [widgetKey]);

  const fetchComments = useCallback(async (append = false) => {
    if (append && (!hasMoreRef.current || loadingMoreRef.current)) return;

    const requestId = commentsRequestRef.current + 1;
    commentsRequestRef.current = requestId;
    const offset = append ? commentsRef.current.length : 0;

    if (!append) {
      commentsRef.current = [];
      hasMoreRef.current = false;
      setHasMore(false);
    }

    try {
      if (append) {
        loadingMoreRef.current = true;
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      const params = new URLSearchParams({
        widgetKey,
        targetType,
        sort,
        limit: String(COMMENTS_PAGE_SIZE),
        offset: String(offset),
      });
      if (targetReference) params.append('targetReference', targetReference);
      params.append('clientSessionId', actorKey);

      const res = await httpClient.fetchWithAuth(apiUrl(`/api/comments?${params.toString()}`));
      if (res.ok) {
        const data = await res.json();
        // Ignore a slower response from a previous sort or refresh request.
        if (requestId !== commentsRequestRef.current) return;
        const items = (data.items || []) as EngageComment[];
        setComments((previous) => {
          const next = append
            ? [...previous, ...items.filter((item) => !previous.some((comment) => comment._id === item._id))]
            : items;
          commentsRef.current = next;
          return next;
        });
        setTotalCount(data.totalCount || 0);
        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
        setMemberName(data.currentMember?.displayName?.trim() || null);
        setMemberResolved(true);
        hasMoreRef.current = Boolean(data.hasMore);
        setHasMore(Boolean(data.hasMore));
      }
    } catch (e) {
      console.error('Failed to load comments:', e);
    } finally {
      if (append) {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      } else {
        setLoading(false);
        setMemberResolved(true);
      }
    }
  }, [actorKey, widgetKey, targetType, targetReference, sort]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchComments(true);
      },
      { rootMargin: '320px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchComments, hasMore, loading, loadingMore]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGuestPostingEnabled) return;
    if (!contentLength || blockedCommentWords.length > 0) return;

    try {
      setSubmitting(true);

      const res = await httpClient.fetchWithAuth(apiUrl('/api/comments'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetKey,
          targetType,
          targetReference,
          authorDisplayName: memberName || authorName.trim() || 'Guest Visitor',
          contentText: contentText.trim(),
          rating: isRatingsEnabled ? rating : null,
          clientSessionId: actorKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit comment');
      }

      toast.success(data.message || 'Comment posted successfully!');
      setContentText('');
      setContentLength(0);
      fetchComments();
    } catch (err: any) {
      toast.error(err.message || 'Unable to post your comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (commentId: string) => {
    try {
      setPendingReactionId(commentId);
      const res = await httpClient.fetchWithAuth(apiUrl(`/api/comments/${commentId}/reactions`), {
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
    } finally {
      setPendingReactionId(null);
    }
  };

  const startEditing = (comment: EngageComment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.contentText);
    editingTextRef.current = comment.contentText;
    setEditingLength(getRichTextPlainTextForEditor(comment.contentText));
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingText('');
    editingTextRef.current = '';
    setEditingLength(0);
  };

  useEffect(() => {
    if (!editingCommentId) return;
    editDialogRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !savingEdit) cancelEditing();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [editingCommentId, savingEdit]);

  useEffect(() => {
    if (!deleteConfirmComment) return;
    deleteDialogRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !deletingCommentId) setDeleteConfirmComment(null);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [deleteConfirmComment, deletingCommentId]);

  const handleSaveEdit = async () => {
    if (!editingCommentId || !editingLength) return;

    try {
      setSavingEdit(true);
      const response = await httpClient.fetchWithAuth(apiUrl(`/api/comments/${editingCommentId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentText: editingTextRef.current, clientSessionId: actorKey }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update comment');

      setComments((previous) => previous.map((comment) =>
        comment._id === editingCommentId ? { ...comment, ...data.item } : comment,
      ));
      await fetchComments();
      toast.success('Comment updated successfully.');
      cancelEditing();
    } catch (error: any) {
      toast.error(error.message || 'Unable to update your comment. Please try again.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!deleteConfirmComment) return;

    try {
      setDeletingCommentId(deleteConfirmComment._id);
      const response = await httpClient.fetchWithAuth(
        apiUrl(`/api/comments/${deleteConfirmComment._id}?clientSessionId=${encodeURIComponent(actorKey)}`),
        { method: 'DELETE' },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete comment');

      setComments((previous) => {
        const next = previous.filter((comment) => comment._id !== deleteConfirmComment._id);
        commentsRef.current = next;
        return next;
      });
      setTotalCount((count) => Math.max(0, count - 1));
      setDeleteConfirmComment(null);
      toast.success('Comment deleted.');
    } catch (error: any) {
      toast.error(error.message || 'Unable to delete your comment. Please try again.');
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleToggleViewReplies = async (commentId: string) => {
    const isCurrentlyOpen = !!showRepliesMap[commentId];
    setShowRepliesMap((prev) => ({ ...prev, [commentId]: !isCurrentlyOpen }));

    if (!isCurrentlyOpen && !repliesMap[commentId]) {
      try {
        const res = await httpClient.fetchWithAuth(apiUrl(`/api/comments/${commentId}/replies?clientSessionId=${encodeURIComponent(actorKey)}`));
        if (res.ok) {
          const data = await res.json();
          setRepliesMap((prev) => ({ ...prev, [commentId]: data.items || [] }));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const loadReplies = async (commentId: string) => {
    if (repliesMap[commentId]) return;
    try {
      const res = await httpClient.fetchWithAuth(apiUrl(`/api/comments/${commentId}/replies?clientSessionId=${encodeURIComponent(actorKey)}`));
      if (res.ok) {
        const data = await res.json();
        setRepliesMap((prev) => ({ ...prev, [commentId]: data.items || [] }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!getRichTextPlainTextForEditor(replyText) || blockedReplyWords.length > 0) return;
    const parentId = replyingToId || commentId;

    try {
      setReplySubmitting(true);
      const res = await httpClient.fetchWithAuth(apiUrl(`/api/comments/${parentId}/replies`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetKey,
          authorDisplayName: memberName || replyAuthorName.trim() || 'Guest Visitor',
          contentText: replyText,
          clientSessionId: actorKey,
        }),
      });

      if (res.ok) {
        setReplyText('');
        setReplyAuthorName('');
        setShowReplyNameField(false);
        setOpenReplyFormId(null);
        setReplyingToId(null);
        setReplyEditorReady(false);
        // Refresh replies for the comment or reply being answered.
        const repliesRes = await httpClient.fetchWithAuth(apiUrl(`/api/comments/${parentId}/replies?clientSessionId=${encodeURIComponent(actorKey)}`));
        if (repliesRes.ok) {
          const data = await repliesRes.json();
          setRepliesMap((prev) => ({ ...prev, [parentId]: data.items || [] }));
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

  const renderReply = (reply: EngageComment, rootId: string): React.ReactNode => (
    <div key={reply._id} className={styles.nestedReply} style={{ fontSize: 13 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ fontWeight: 600 }}>{reply.authorDisplayName}</span>
        {reply.authorType === 'owner' && (
          <span className={`${styles.badge} ${styles.badgeOwner}`}>Site Owner</span>
        )}
        <span style={{ fontSize: 11, color: '#94a3b8' }}>
          {new Date(reply._createdDate || '').toLocaleDateString()}
        </span>
      </div>
      <CollapsibleRichText content={reply.contentText} className={styles.replyBody} />
      {isRepliesEnabled && (
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => {
            setReplyingToId(reply._id);
            setOpenReplyFormId(rootId);
            setReplyEditorReady(false);
            void loadReplies(reply._id);
          }}
          aria-label={`Reply to ${reply.authorDisplayName}`}
        >
          <MessageCircle size={14} strokeWidth={2} />
        </button>
      )}
      {repliesMap[reply._id]?.length > 0 && (
        <div className={styles.nestedReplies}>
          {repliesMap[reply._id].map((childReply) => renderReply(childReply, rootId))}
        </div>
      )}
    </div>
  );

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleImageUpload = useCallback((quillRef: ReactQuill | null) => {
    if (!quillRef) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/gif';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const dataUrl = await compressImage(file);
        const editor = quillRef.getEditor();
        const range = editor.getSelection(true);
        editor.insertEmbed(range?.index ?? editor.getLength(), 'image', dataUrl, 'user');
        editor.setSelection((range?.index ?? editor.getLength()) + 1, 0, 'silent');
      } catch (error: any) {
        toast.error(error.message || 'Unable to add that image.');
      }
    };
    input.click();
  }, []);

  const toolbarContainer = useMemo(() => {
    const formatting = ['bold', 'italic', 'underline'].filter((tool) => toolbarOptions[tool as keyof EditorToolbarOptions]);
    const lists = [
      toolbarOptions.orderedList ? { list: 'ordered' } : null,
      toolbarOptions.bulletList ? { list: 'bullet' } : null,
    ].filter(Boolean);
    const inserts = [
      toolbarOptions.link ? 'link' : null,
      toolbarOptions.image ? 'image' : null,
      toolbarOptions.clean ? 'clean' : null,
    ].filter(Boolean);

    return [formatting, lists, inserts].filter((group) => group.length > 0);
  }, [toolbarOptions]);

  // Keep the module configuration stable. ReactQuill tears down and rebuilds
  // the editor when this object changes, which can make the toolbar disappear
  // while the widget is receiving async data or being updated by Wix.
  const composerModules = useMemo(() => ({
    toolbar: {
      container: toolbarContainer,
      handlers: { image: () => handleImageUpload(composerQuillRef.current) },
    },
  }), [handleImageUpload, toolbarContainer]);

  const editingModules = useMemo(() => ({
    toolbar: {
      container: toolbarContainer,
      handlers: { image: () => handleImageUpload(editingQuillRef.current) },
    },
  }), [handleImageUpload, toolbarContainer]);

  const replyModules = useMemo(() => ({
    toolbar: {
      container: toolbarContainer,
      handlers: { image: () => handleImageUpload(replyQuillRef.current) },
    },
  }), [handleImageUpload, toolbarContainer]);

  useEffect(() => {
    if (!openReplyFormId) return;
    setReplyEditorReady(false);
    const focusTimer = window.setTimeout(() => replyQuillRef.current?.focus(), 0);
    const readyTimer = window.setTimeout(() => {
      if (replyQuillRef.current) setReplyEditorReady(true);
    }, 0);
    return () => {
      window.clearTimeout(focusTimer);
      window.clearTimeout(readyTimer);
    };
  }, [openReplyFormId]);

  return (
    <div
      className={styles.root}
      style={
        {
          '--primary-color': primaryColor,
          '--star-color': starColor,
          '--title-color': titleColor,
          '--subtitle-color': subtitleColor,
          '--body-color': bodyColor,
          '--button-text-color': buttonTextColor,
          '--body-font-family': bodyFontFamily,
          '--button-font-family': buttonFontFamily,
        } as React.CSSProperties
      }
    >
      <Toaster position="top-center" richColors />

      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title} style={{ fontFamily: titleFontFamily }}>{title}</h2>
        {subtitle && <p className={styles.subtitle} style={{ fontFamily: subtitleFontFamily }}>{subtitle}</p>}
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
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {memberResolved && !memberName && !showNameField && (
            <button
              type="button"
              className={styles.nameToggle}
              onClick={() => setShowNameField(true)}
              disabled={!isGuestPostingEnabled}
              aria-expanded="false"
              aria-controls="comment-name"
            >
              Add a name <span>(optional)</span>
            </button>
          )}

          {memberResolved && !memberName && showNameField && (
            <input
              id="comment-name"
              type="text"
              className={styles.inputField}
              style={{ flex: 1, minWidth: 200 }}
              placeholder="Your name or nickname"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              disabled={!isGuestPostingEnabled}
            />
          )}

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

        <div className={`${styles.richTextEditor} ${blockedCommentWords.length > 0 ? styles.richTextEditorBlocked : ''}`}>
          <ReactQuill
            ref={composerQuillRef}
            theme="snow"
            value={contentText}
            onChange={(value, _delta, _source, editor) => {
              const plainText = editor.getText().replace(/\n$/, '');
              setContentText(value);
              setContentLength(plainText.length);
            }}
            placeholder={editorPlaceholder}
            readOnly={!isGuestPostingEnabled}
            modules={composerModules}
          />
        </div>
        {blockedCommentWords.length > 0 && (
          <div className={styles.blockedTermMessage} role="alert">
            Blocked terms: {blockedCommentWords.map((word) => <strong key={word}>{word}</strong>)}
          </div>
        )}

        <div className={styles.composerActions}>
          <span className={styles.charCount}>
            {contentLength} characters
          </span>
          <button type="submit" className={styles.submitBtn} disabled={!isGuestPostingEnabled || submitting || !contentLength}>
            {submitting && <Spinner />}
            {!isGuestPostingEnabled ? 'Guest posting disabled' : 'Post Comment'}
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
          <div className={styles.emptyState} role="status" aria-live="polite" aria-label="Loading comments"><Spinner /></div>
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
                  <div className={styles.avatar}>
                    {comment.authorAvatarUrl ? (
                      <img src={comment.authorAvatarUrl} alt="" />
                    ) : (
                      getInitials(comment.authorDisplayName)
                    )}
                  </div>
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

              <CollapsibleRichText content={comment.contentText} className={styles.commentBody} />

              <div className={styles.commentFooter}>
                <div className={styles.commentActions}>
                  {isReactionsEnabled && (
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${likedMap[comment._id] ? styles.actionBtnLiked : ''}`}
                      onClick={() => handleToggleLike(comment._id)}
                    >
                      {pendingReactionId === comment._id ? <Spinner /> : <Heart size={16} strokeWidth={2} fill={likedMap[comment._id] ? 'currentColor' : 'none'} />}
                      <span>{comment.reactionCount || 0}</span>
                    </button>
                  )}

                  {comment.canEdit && editingCommentId !== comment._id && (
                    <button
                      type="button"
                      className={styles.iconActionBtn}
                      onClick={() => startEditing(comment)}
                      aria-label="Edit comment"
                      title="Edit comment"
                    >
                      <Pencil size={16} strokeWidth={2} />
                    </button>
                  )}

                  {comment.canEdit && (
                    <button
                      type="button"
                      className={styles.iconActionBtn}
                      onClick={() => setDeleteConfirmComment(comment)}
                      aria-label="Delete comment"
                      title="Delete comment"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  )}

                  {isRepliesEnabled && (
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() =>
                        (() => {
                          const isOpen = openReplyFormId === comment._id && replyingToId === comment._id;
                          setOpenReplyFormId(isOpen ? null : comment._id);
                          setReplyingToId(isOpen ? null : comment._id);
                          setReplyEditorReady(false);
                        })()
                      }
                      aria-label={openReplyFormId === comment._id && replyingToId === comment._id ? 'Close reply form' : 'Reply to comment'}
                      title={openReplyFormId === comment._id && replyingToId === comment._id ? 'Close reply form' : 'Reply to comment'}
                    >
                      <MessageCircle size={16} strokeWidth={2} />
                    </button>
                  )}

                  {isRepliesEnabled && (comment.replyCount || 0) > 0 && (
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => handleToggleViewReplies(comment._id)}
                      aria-label={showRepliesMap[comment._id] ? 'Hide replies' : 'View replies'}
                    >
                      {showRepliesMap[comment._id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
                  {replyingToId !== comment._id && (
                    <div className={styles.replyingToLabel}>Replying to a reply</div>
                  )}
                  {memberResolved && !memberName && !showReplyNameField && (
                    <button
                      type="button"
                      className={styles.nameToggle}
                      onClick={() => setShowReplyNameField(true)}
                      aria-expanded="false"
                      aria-controls="reply-name"
                    >
                      Add a name <span>(optional)</span>
                    </button>
                  )}

                  {memberResolved && !memberName && showReplyNameField && (
                    <input
                      id="reply-name"
                      type="text"
                      className={styles.inputField}
                      placeholder="Your name or nickname"
                      value={replyAuthorName}
                      onChange={(e) => setReplyAuthorName(e.target.value)}
                    />
                  )}
                  <div
                    className={`${styles.richTextEditor} ${!replyEditorReady ? styles.replyEditorLoading : ''} ${blockedReplyWords.length > 0 ? styles.richTextEditorBlocked : ''}`}
                    aria-busy={!replyEditorReady}
                  >
                    {!replyEditorReady && (
                      <div className={styles.editorLoadingOverlay} role="status">
                        <Spinner />
                        <span>Opening editor…</span>
                      </div>
                    )}
                    <ReactQuill
                      ref={replyQuillRef}
                      theme="snow"
                      value={replyText}
                      onChange={setReplyText}
                      placeholder="Write a reply..."
                      modules={replyModules}
                    />
                  </div>
                  {blockedReplyWords.length > 0 && (
                    <div className={styles.blockedTermMessage} role="alert">
                      Blocked terms: {blockedReplyWords.map((word) => <strong key={word}>{word}</strong>)}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => {
                        setOpenReplyFormId(null);
                        setReplyingToId(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.submitBtn}
                      disabled={replySubmitting || !getRichTextPlainTextForEditor(replyText) || blockedReplyWords.length > 0}
                      onClick={() => handleSubmitReply(comment._id)}
                    >
                      {replySubmitting && <Spinner />}
                      Send Reply
                    </button>
                  </div>
                </div>
              )}

              {/* Threaded Replies */}
              {showRepliesMap[comment._id] && repliesMap[comment._id] && (
                <div className={styles.replyThread}>
                  {repliesMap[comment._id].map((reply) => renderReply(reply, comment._id))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {!loading && comments.length > 0 && (loadingMore || hasMore) && (
        <div
          ref={loadMoreSentinelRef}
          className={styles.loadMoreSentinel}
          role="status"
          aria-live="polite"
          aria-label={loadingMore ? 'Loading more comments' : 'More comments will load automatically'}
        >
          {loadingMore ? <><Spinner /><span>Loading more comments…</span></> : 'Scroll to load more comments'}
        </div>
      )}

      {editingCommentId && (
        <div className={styles.dialogBackdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget && !savingEdit) cancelEditing();
        }}>
          <div
            ref={editDialogRef}
            className={styles.editDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-comment-title"
            tabIndex={-1}
          >
            <div className={styles.dialogHeader}>
              <div>
                <h3 id="edit-comment-title">Edit comment</h3>
                <p>Update your comment and save the changes.</p>
              </div>
              <button type="button" className={styles.closeDialogBtn} onClick={cancelEditing} disabled={savingEdit} aria-label="Close edit dialog">
                <X size={18} />
              </button>
            </div>
            <div className={styles.richTextEditor}>
              <ReactQuill
                ref={editingQuillRef}
                theme="snow"
                value={editingText}
                onChange={(value, _delta, _source, editor) => {
                  const plainText = editor.getText().replace(/\n$/, '');
                  setEditingText(value);
                  editingTextRef.current = value;
                  setEditingLength(plainText.length);
                }}
                modules={editingModules}
              />
            </div>
            <div className={styles.editActions}>
              <span className={styles.charCount}>{editingLength} characters</span>
              <div className={styles.dialogActions}>
                <button type="button" className={styles.actionBtn} onClick={cancelEditing} disabled={savingEdit}>
                  Cancel
                </button>
                <button type="button" className={styles.submitBtn} onClick={handleSaveEdit} disabled={savingEdit || !editingLength}>
                  {savingEdit && <Spinner />}
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmComment && (
        <div
          className={styles.dialogBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deletingCommentId) setDeleteConfirmComment(null);
          }}
        >
          <div
            ref={deleteDialogRef}
            className={styles.confirmDialog}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-comment-title"
            aria-describedby="delete-comment-description"
            tabIndex={-1}
          >
            <div className={styles.dialogHeader}>
              <div>
                <h3 id="delete-comment-title">Delete comment?</h3>
                <p id="delete-comment-description">This will remove your comment from the conversation. This action cannot be undone.</p>
              </div>
              <button
                type="button"
                className={styles.closeDialogBtn}
                onClick={() => setDeleteConfirmComment(null)}
                disabled={Boolean(deletingCommentId)}
                aria-label="Close delete confirmation"
              >
                <X size={18} />
              </button>
            </div>
            <div className={styles.dialogActions}>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => setDeleteConfirmComment(null)}
                disabled={Boolean(deletingCommentId)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={handleDeleteComment}
                disabled={Boolean(deletingCommentId)}
              >
                {deletingCommentId && <Spinner />}
                Delete comment
              </button>
            </div>
          </div>
        </div>
      )}

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
    titleColor: 'string',
    subtitleColor: 'string',
    bodyColor: 'string',
    buttonTextColor: 'string',
    enableRatings: 'string',
    enableReplies: 'string',
    enableReactions: 'string',
    allowGuest: 'string',
    requireApproval: 'string',
    font: 'string',
    titleFont: 'string',
    subtitleFont: 'string',
    bodyFont: 'string',
    buttonFont: 'string',
    editorToolbar: 'string',
    editorPlaceholder: 'string',
  },
});
