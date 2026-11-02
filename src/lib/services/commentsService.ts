import type { EngageComment, CommentStatus, AuthorType, TargetType } from '../types';
import { members } from '@wix/members';
import {
  COLLECTIONS,
  elevatedQuery,
  elevatedInsert,
  elevatedUpdate,
  elevatedRemove,
  memoryStore,
} from './dataAccess';
import { getWidgetConfig } from './widgetsService';

const isDevelopmentEnvironment = import.meta.env.WIX_ENVIRONMENT === 'development';

interface AuthenticatedMember {
  id: string;
  email: string | null;
  avatarUrl: string | null;
  displayName: string | null;
}

async function getAuthenticatedMember(): Promise<AuthenticatedMember | null> {
  try {
    const response = await members.getCurrentMember({ fieldsets: ['EXTENDED'] });
    console.log('[comments] members.getCurrentMember response:', response);
    const member = response.member;
    const memberId = member?._id || (member as { id?: string } | undefined)?.id;
    if (!memberId) return null;

    const memberData = member as {
      profile?: { nickname?: string | null; photo?: { url?: string } };
      contact?: { name?: { first?: string; last?: string; fullName?: string } };
    };
    const contactName = memberData.contact?.name;

    return {
      id: memberId,
      email: member?.loginEmail || null,
      avatarUrl: memberData.profile?.photo?.url || null,
      displayName: memberData.profile?.nickname || contactName?.fullName ||
        [contactName?.first, contactName?.last].filter(Boolean).join(' ') || null,
    };
  } catch {
    // Visitors and guests do not have a current member. They remain anonymous.
    return null;
  }
}

export function toPublicComment(comment: EngageComment): Omit<EngageComment, 'authorMemberEmail' | 'authorSessionId'> {
  const { authorMemberEmail: _authorMemberEmail, authorSessionId: _authorSessionId, ...publicComment } = comment;
  return publicComment;
}

function canEditComment(comment: EngageComment, member: AuthenticatedMember | null, clientSessionId?: string | null) {
  return Boolean(
    (member?.id && comment.authorMemberId === member.id) ||
    (clientSessionId && comment.authorSessionId === clientSessionId),
  );
}

async function enforceProductionPlanLimits() {
  // Local development is intentionally unrestricted so the app can be tested
  // without consuming the Basic plan quota.
  if (isDevelopmentEnvironment) return;

  const usage = memoryStore.usage;
  const submissionsLimit = Number(usage.submissionsLimit ?? usage.commentsLimit ?? 3);
  const storedComments = await getStoredComments();
  const currentPeriod = new Date().toISOString().slice(0, 7);
  const submissionsThisPeriod = storedComments.filter((comment) =>
    String(comment._createdDate || '').slice(0, 7) === currentPeriod,
  ).length;
  if (submissionsThisPeriod >= submissionsLimit) {
    throw new Error(`This plan allows ${submissionsLimit} new submissions per month. Upgrade to continue.`);
  }

  const publishedComments = storedComments.filter((comment) => comment.status === 'published').length;
  const publishedCommentsLimit = Number(usage.publishedCommentsLimit ?? 3);
  if (publishedComments >= publishedCommentsLimit) {
    throw new Error(`This plan allows ${publishedCommentsLimit} published comments. Upgrade to continue.`);
  }
}

export interface CommentQueryOptions {
  widgetKey?: string;
  targetType?: TargetType;
  targetReference?: string;
  sort?: 'newest' | 'oldest' | 'most-liked' | 'highest-rated';
  limit?: number;
  offset?: number;
  status?: CommentStatus;
  clientSessionId?: string | null;
}

async function getStoredComments(): Promise<EngageComment[]> {
  try {
    const res = await elevatedQuery(COLLECTIONS.COMMENTS).find();
    if (res.items && res.items.length > 0) {
      return res.items as unknown as EngageComment[];
    }
  } catch {
    // Use the local store when Wix Data is unavailable (for local development).
  }

  return Array.from(memoryStore.comments.values()) as EngageComment[];
}

async function getStoredComment(commentId: string): Promise<EngageComment | undefined> {
  const inMemory = memoryStore.comments.get(commentId) as EngageComment | undefined;
  if (inMemory) return inMemory;

  try {
    const res = await elevatedQuery(COLLECTIONS.COMMENTS).eq('_id', commentId).find();
    return res.items?.[0] as unknown as EngageComment | undefined;
  } catch {
    return undefined;
  }
}

export async function getComment(commentId: string): Promise<EngageComment | undefined> {
  return getStoredComment(commentId);
}

export async function getPublishedComments(options: CommentQueryOptions) {
  const {
    widgetKey = 'engage-comments',
    targetType,
    targetReference,
    sort = 'newest',
    limit = 10,
    offset = 0,
    clientSessionId,
  } = options;
  const requester = await getAuthenticatedMember();

  let allComments = (await getStoredComments()).filter(
    (comment) =>
      comment.widgetKey === widgetKey &&
      comment.status === 'published' &&
      (!targetType || comment.targetType === targetType) &&
      (!targetReference || comment.targetReference === targetReference),
  );

  // Filter root comments only
  let rootComments = allComments.filter((c) => !c.parentCommentId);

  // Sorting
  if (sort === 'newest') {
    rootComments.sort((a, b) => new Date(b._createdDate || 0).getTime() - new Date(a._createdDate || 0).getTime());
  } else if (sort === 'oldest') {
    rootComments.sort((a, b) => new Date(a._createdDate || 0).getTime() - new Date(b._createdDate || 0).getTime());
  } else if (sort === 'most-liked') {
    rootComments.sort((a, b) => (b.reactionCount || 0) - (a.reactionCount || 0));
  } else if (sort === 'highest-rated') {
    rootComments.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Pinned comments float to the top
  rootComments.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const total = rootComments.length;
  const paged = rootComments.slice(offset, offset + limit);

  // Calculate average rating
  const rated = allComments.filter((c) => typeof c.rating === 'number' && c.rating > 0);
  const avgRating = rated.length > 0
    ? Number((rated.reduce((sum, c) => sum + (c.rating || 0), 0) / rated.length).toFixed(1))
    : 0;

  return {
    items: paged.map((comment) => ({
      ...toPublicComment(comment),
      canEdit: canEditComment(comment, requester, clientSessionId),
    })),
    totalCount: total,
    averageRating: avgRating,
    totalReviews: rated.length,
    hasMore: offset + limit < total,
    currentMember: requester
      ? { displayName: requester.displayName, avatarUrl: requester.avatarUrl }
      : null,
  };
}

export async function createComment(data: {
  widgetKey: string;
  targetType: TargetType;
  targetReference?: string | null;
  authorDisplayName: string;
  contentText: string;
  rating?: number | null;
  parentCommentId?: string | null;
  authorType?: AuthorType;
  clientSessionId?: string | null;
}) {
  await enforceProductionPlanLimits();

  const widget = await getWidgetConfig(data.widgetKey);
  const settings = widget.settings;
  const authenticatedMember = await getAuthenticatedMember();

  // Check blocked words
  const contentLower = data.contentText.toLowerCase();
  for (const word of settings.blockedWords) {
    if (word && contentLower.includes(word.toLowerCase())) {
      throw new Error('Your comment contains blocked terms.');
    }
  }

  // Check duplicate content
  const existingMatches = (await getStoredComments()).filter(
    (c) => c.contentText.trim().toLowerCase() === data.contentText.trim().toLowerCase() &&
      c.authorDisplayName === data.authorDisplayName
  );
  if (existingMatches.length > 0) {
    throw new Error('Duplicate comment detected.');
  }

  const initialStatus: CommentStatus = settings.requireApproval ? 'pending' : 'published';
  const newId = `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();

  let threadRootId: string | null = null;
  if (data.parentCommentId) {
    const parent = await getStoredComment(data.parentCommentId);
    if (!parent) throw new Error('Parent comment not found');
    if (parent.widgetKey !== data.widgetKey) throw new Error('Parent comment belongs to another widget');
    if (parent.targetType !== data.targetType || parent.targetReference !== data.targetReference) {
      throw new Error('Reply target does not match the parent comment');
    }
    threadRootId = parent.threadRootId || parent._id;
  }

  const newComment: EngageComment = {
    _id: newId,
    _createdDate: now,
    _updatedDate: now,
    siteId: widget.siteId || 'site-default',
    widgetKey: data.widgetKey,
    targetType: data.targetType || 'generalPage',
    targetReference: data.targetReference || undefined,
    parentCommentId: data.parentCommentId || null,
    threadRootId,
    authorType: data.authorType === 'owner' ? 'owner' : authenticatedMember ? 'member' : 'guest',
    authorMemberId: authenticatedMember?.id || null,
    authorMemberEmail: authenticatedMember?.email || null,
    authorSessionId: authenticatedMember ? null : data.clientSessionId || null,
    authorAvatarUrl: authenticatedMember?.avatarUrl || null,
    authorDisplayName: authenticatedMember?.displayName || data.authorDisplayName.trim(),
    contentText: data.contentText.trim(),
    rating: settings.enableRatings ? data.rating : null,
    status: initialStatus,
    isPinned: false,
    reactionCount: 0,
    replyCount: 0,
    publishedAt: initialStatus === 'published' ? now : null,
    schemaVersion: 1,
  };

  try {
    await elevatedInsert(COLLECTIONS.COMMENTS, newComment);
  } catch (err) {
    // Memory store fallback
  }

  memoryStore.comments.set(newId, newComment);

  // If this was a reply, increment parent's replyCount
  if (data.parentCommentId) {
    const parent = memoryStore.comments.get(data.parentCommentId);
    if (parent) {
      parent.replyCount = (parent.replyCount || 0) + 1;
      try {
        await elevatedUpdate(COLLECTIONS.COMMENTS, parent);
      } catch (e) {}
    }
  }

  // Increment usage count
  memoryStore.usage.commentsCreated = (memoryStore.usage.commentsCreated || 0) + 1;

  return newComment;
}

export async function getReplies(parentCommentId: string, clientSessionId?: string | null) {
  const requester = await getAuthenticatedMember();
  const replies = (await getStoredComments()).filter(
    (comment) => comment.parentCommentId === parentCommentId && comment.status === 'published',
  );

  replies.sort((a, b) => new Date(a._createdDate || 0).getTime() - new Date(b._createdDate || 0).getTime());
  return replies.map((comment) => ({
    ...toPublicComment(comment),
    canEdit: canEditComment(comment, requester, clientSessionId),
  }));
}

export async function updateComment(commentId: string, contentText: string, clientSessionId?: string | null) {
  const comment = await getStoredComment(commentId);
  if (!comment) throw new Error('Comment not found');

  const requester = await getAuthenticatedMember();
  if (!canEditComment(comment, requester, clientSessionId)) {
    throw new Error('You can only edit comments you created.');
  }

  const widget = await getWidgetConfig(comment.widgetKey);
  comment.contentText = contentText.trim();
  comment._updatedDate = new Date().toISOString();

  try {
    await elevatedUpdate(COLLECTIONS.COMMENTS, comment);
  } catch {
    // Keep the in-memory fallback in development or when Wix Data is unavailable.
  }
  memoryStore.comments.set(comment._id, comment);
  return comment;
}

export async function deleteComment(commentId: string, clientSessionId?: string | null) {
  const comment = await getStoredComment(commentId);
  if (!comment) throw new Error('Comment not found');

  const requester = await getAuthenticatedMember();
  if (!canEditComment(comment, requester, clientSessionId)) {
    throw new Error('You can only delete comments you created.');
  }

  comment.status = 'deleted';
  comment._updatedDate = new Date().toISOString();

  try {
    await elevatedUpdate(COLLECTIONS.COMMENTS, comment);
  } catch {
    // Keep the in-memory fallback in development or when Wix Data is unavailable.
  }
  memoryStore.comments.set(comment._id, comment);
  return comment;
}

export async function toggleReaction(commentId: string, reactionType: string = 'like', actorKey: string) {
  const reactionKey = `${commentId}:${actorKey}:${reactionType}`;
  const comment = await getStoredComment(commentId);

  if (!comment) {
    throw new Error('Comment not found');
  }

  let existing = memoryStore.reactions.get(reactionKey);
  if (!existing) {
    try {
      const res = await elevatedQuery(COLLECTIONS.REACTIONS)
        .eq('commentId', commentId)
        .eq('actorKey', actorKey)
        .eq('reactionType', reactionType)
        .find();
      existing = res.items?.[0];
    } catch {
      // Use the local reaction store when Wix Data is unavailable.
    }
  }
  let isLiked = false;

  if (existing) {
    memoryStore.reactions.delete(reactionKey);
    try {
      await elevatedRemove(COLLECTIONS.REACTIONS, existing._id || reactionKey);
    } catch {
      // The comment count still remains correct in the local fallback store.
    }
    comment.reactionCount = Math.max(0, (comment.reactionCount || 1) - 1);
    isLiked = false;
  } else {
    memoryStore.reactions.set(reactionKey, {
      _id: reactionKey,
      commentId,
      actorKey,
      reactionType,
      createdAt: new Date().toISOString(),
    });
    try {
      await elevatedInsert(COLLECTIONS.REACTIONS, memoryStore.reactions.get(reactionKey));
    } catch {
      // Keep the local reaction when Wix Data is unavailable.
    }
    comment.reactionCount = (comment.reactionCount || 0) + 1;
    isLiked = true;
  }

  try {
    await elevatedUpdate(COLLECTIONS.COMMENTS, comment);
  } catch (e) {}

  return { reactionCount: comment.reactionCount, isLiked };
}

export async function moderateComment(
  commentId: string,
  action: 'approve' | 'reject' | 'pin' | 'unpin' | 'delete' | 'owner-reply',
  replyText?: string,
  actorReference: string = 'site-owner'
) {
  const comment = await getStoredComment(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  const now = new Date().toISOString();

  if (action === 'approve') {
    comment.status = 'published';
    comment.publishedAt = now;
    comment.moderatedAt = now;
    comment.moderatedBy = actorReference;
  } else if (action === 'reject') {
    comment.status = 'rejected';
    comment.moderatedAt = now;
    comment.moderatedBy = actorReference;
  } else if (action === 'delete') {
    comment.status = 'deleted';
  } else if (action === 'pin') {
    comment.isPinned = true;
  } else if (action === 'unpin') {
    comment.isPinned = false;
  } else if (action === 'owner-reply' && replyText) {
    // Create an official reply by the site owner
    await createComment({
      widgetKey: comment.widgetKey,
      targetType: comment.targetType,
      targetReference: comment.targetReference,
      parentCommentId: comment._id,
      authorDisplayName: 'Site Owner',
      authorType: 'owner',
      contentText: replyText,
    });
  } else if (action === 'owner-reply') {
    throw new Error('Reply text is required');
  }

  try {
    await elevatedUpdate(COLLECTIONS.COMMENTS, comment);
  } catch (e) {}

  memoryStore.comments.set(comment._id, comment);

  memoryStore.moderationEvents.push({
    _id: `mod-${Date.now()}`,
    commentId,
    action,
    actorReference,
    createdAt: now,
  });

  return comment;
}

export async function getDashboardOverview() {
  const all = (await getStoredComments()).filter((c) => c.status !== 'deleted');
  const published = all.filter((c) => c.status === 'published');
  const pending = all.filter((c) => c.status === 'pending');
  const reviews = published.filter((c) => typeof c.rating === 'number' && c.rating > 0);

  const avgRating = reviews.length > 0
    ? Number((reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1))
    : 0;

  const recent = [...all]
    .sort((a, b) => new Date(b._createdDate || 0).getTime() - new Date(a._createdDate || 0).getTime())
    .slice(0, 5);

  return {
    totalComments: all.length,
    publishedComments: published.length,
    pendingModerationCount: pending.length,
    totalReviews: reviews.length,
    averageRating: avgRating,
    recentActivity: recent,
    pluginStatus: 'installed',
    plan: memoryStore.usage.planName,
    usage: {
      commentsCreated: memoryStore.usage.commentsCreated,
      commentsLimit: memoryStore.usage.commentsLimit,
    },
  };
}

export async function listDashboardComments(filters: {
  status?: string;
  rating?: number;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  let all = (await getStoredComments()).filter((c) => c.status !== 'deleted');

  if (filters.status && filters.status !== 'all') {
    all = all.filter((c) => c.status === filters.status);
  }

  if (filters.rating && filters.rating > 0) {
    all = all.filter((c) => c.rating === filters.rating);
  }

  if (filters.search) {
    const s = filters.search.toLowerCase();
    all = all.filter(
      (c) => c.authorDisplayName.toLowerCase().includes(s) || c.contentText.toLowerCase().includes(s)
    );
  }

  all.sort((a, b) => new Date(b._createdDate || 0).getTime() - new Date(a._createdDate || 0).getTime());

  const total = all.length;
  const paged = all.slice(filters.offset || 0, (filters.offset || 0) + (filters.limit || 20));

  return {
    items: paged,
    totalCount: total,
  };
}

export async function exportCommentsToCsv(): Promise<string> {
  const all = await getStoredComments();
  const headers = ['ID', 'Date', 'Author', 'Type', 'Rating', 'Status', 'ReactionCount', 'ReplyCount', 'Content'];
  const rows = all.map((c) => [
    `"${c._id}"`,
    `"${c._createdDate}"`,
    `"${c.authorDisplayName.replace(/"/g, '""')}"`,
    `"${c.authorType}"`,
    `"${c.rating || ''}"`,
    `"${c.status}"`,
    `"${c.reactionCount}"`,
    `"${c.replyCount}"`,
    `"${c.contentText.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
