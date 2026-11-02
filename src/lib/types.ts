export type CommentStatus = 'pending' | 'published' | 'rejected' | 'spam' | 'deleted';
export type AuthorType = 'guest' | 'member' | 'owner';
export type TargetType = 'generalPage' | 'blogPost' | 'product' | 'testimonialSection';

export interface EngageComment {
  _id: string;
  _createdDate?: string | Date;
  _updatedDate?: string | Date;
  siteId: string;
  widgetKey: string;
  targetType: TargetType;
  targetReference?: string;
  parentCommentId?: string | null;
  threadRootId?: string | null;
  authorType: AuthorType;
  authorMemberId?: string | null;
  authorMemberEmail?: string | null;
  authorSessionId?: string | null;
  authorAvatarUrl?: string | null;
  authorDisplayName: string;
  authorAvatarReference?: string | null;
  contentText: string;
  rating?: number | null;
  status: CommentStatus;
  isPinned: boolean;
  reactionCount: number;
  replyCount: number;
  publishedAt?: string | Date | null;
  moderatedAt?: string | Date | null;
  moderatedBy?: string | null;
  schemaVersion: number;
  canEdit?: boolean;
}

export interface WidgetSettings {
  title: string;
  subtitle?: string;
  enableComments: boolean;
  enableReplies: boolean;
  enableRatings: boolean;
  enableReactions: boolean;
  allowGuestPosting: boolean;
  requireApproval: boolean;
  maxThreadDepth: number;
  maxCharacters: number;
  density: 'compact' | 'standard' | 'spacious';
  primaryColor: string;
  backgroundColor: string;
  ratingStarColor: string;
  defaultSort: 'newest' | 'oldest' | 'most-liked';
  pageSize: number;
  showAvatars: boolean;
  showFooterBranding: boolean;
  blockedWords: string[];
}

export interface EngageWidget {
  _id: string;
  siteId: string;
  widgetKey: string;
  targetType: TargetType;
  targetReference?: string;
  settings: WidgetSettings;
  status: 'active' | 'disabled';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface EngageReaction {
  _id: string;
  siteId: string;
  commentId: string;
  actorKey: string;
  reactionType: string;
  createdAt?: string | Date;
}

export interface EngageModerationEvent {
  _id: string;
  siteId: string;
  commentId: string;
  action: 'approve' | 'reject' | 'pin' | 'unpin' | 'delete' | 'owner-reply';
  actorReference: string;
  reasonCode?: string;
  createdAt?: string | Date;
}

export interface EngageNotificationPrefs {
  _id?: string;
  siteId: string;
  ownerNotificationEmail?: string;
  newSubmissionEnabled: boolean;
  pendingModerationEnabled: boolean;
  replyNotificationEnabled: boolean;
  weeklySummaryEnabled: boolean;
}

export interface EngageUsageStats {
  periodKey: string;
  commentsCreated: number;
  commentsLimit: number;
  submissionsLimit?: number;
  publishedCommentsLimit?: number;
  planName: 'Basic' | 'Pro' | 'Business';
  isPro: boolean;
}
