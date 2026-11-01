import { z } from 'zod';

export const createCommentSchema = z.object({
  widgetKey: z.string().min(1, 'widgetKey is required'),
  targetType: z.enum(['generalPage', 'blogPost', 'product', 'testimonialSection']).default('generalPage'),
  targetReference: z.string().optional().nullable(),
  authorDisplayName: z.string().trim().min(1, 'Display name is required').max(50, 'Display name too long'),
  contentText: z.string().trim().min(2, 'Comment must be at least 2 characters').max(3000, 'Comment is too long'),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  parentCommentId: z.string().optional().nullable(),
  clientSessionId: z.string().optional().nullable(),
});

export const createReplySchema = z.object({
  widgetKey: z.string().min(1),
  authorDisplayName: z.string().trim().min(1).max(50),
  contentText: z.string().trim().min(2).max(3000),
  clientSessionId: z.string().optional().nullable(),
});

export const toggleReactionSchema = z.object({
  reactionType: z.string().min(1).max(20).default('like'),
  actorKey: z.string().min(1, 'actorKey is required'),
});

export const moderateCommentSchema = z.object({
  commentId: z.string().min(1),
  action: z.enum(['approve', 'reject', 'pin', 'unpin', 'delete', 'owner-reply']),
  replyText: z.string().trim().min(1).max(3000).optional(),
  reasonCode: z.string().optional(),
});

export const widgetSettingsSchema = z.object({
  title: z.string().default('Community Discussions'),
  subtitle: z.string().optional().default('Join the conversation and share your feedback'),
  enableComments: z.boolean().default(true),
  enableReplies: z.boolean().default(true),
  enableRatings: z.boolean().default(true),
  enableReactions: z.boolean().default(true),
  allowGuestPosting: z.boolean().default(true),
  requireApproval: z.boolean().default(false),
  maxThreadDepth: z.number().int().min(1).max(5).default(3),
  maxCharacters: z.number().int().min(50).max(3000).default(1000),
  density: z.enum(['compact', 'standard', 'spacious']).default('standard'),
  primaryColor: z.string().default('#3899ec'),
  backgroundColor: z.string().default('transparent'),
  ratingStarColor: z.string().default('#ffb800'),
  defaultSort: z.enum(['newest', 'oldest', 'most-liked']).default('newest'),
  pageSize: z.number().int().min(5).max(50).default(10),
  showAvatars: z.boolean().default(true),
  showFooterBranding: z.boolean().default(true),
  blockedWords: z.array(z.string()).default([]),
});

export const notificationPrefsSchema = z.object({
  ownerNotificationEmail: z.string().email().optional().or(z.literal('')),
  newSubmissionEnabled: z.boolean().default(true),
  pendingModerationEnabled: z.boolean().default(true),
  replyNotificationEnabled: z.boolean().default(false),
  weeklySummaryEnabled: z.boolean().default(false),
});
