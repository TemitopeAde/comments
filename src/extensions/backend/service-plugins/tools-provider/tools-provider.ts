import { toolsProvider } from '@wix/app-tools/service-plugins';
import {
  getDashboardOverview,
  listDashboardComments,
  moderateComment,
} from '../../../../lib/services/commentsService';

toolsProvider.provideHandlers({
  runTool: async ({ request }: any) => {
    const { methodName, payload } = request;

    switch (methodName) {
      case 'get-comments-summary': {
        const stats = await getDashboardOverview();
        return {
          response: {
            totalComments: stats.totalComments,
            publishedComments: stats.publishedComments,
            pendingModerationCount: stats.pendingModerationCount,
            totalReviews: stats.totalReviews,
            averageRating: stats.averageRating,
            activePlan: stats.plan,
          },
        };
      }

      case 'list-pending-comments': {
        const limit = typeof payload?.['limit'] === 'number' ? payload['limit'] : 10;
        const result = await listDashboardComments({ status: 'pending', limit });
        return {
          response: {
            pendingCount: result.totalCount,
            items: result.items.map((item) => ({
              id: item._id,
              author: item.authorDisplayName,
              content: item.contentText,
              rating: item.rating ?? undefined,
              date: item._createdDate ? String(item._createdDate) : '',
            })),
          },
        };
      }

      case 'moderate-comment': {
        const commentId = payload?.['commentId'];
        const action = payload?.['action'];

        if (typeof commentId !== 'string' || !commentId) {
          throw new Error('Valid commentId is required');
        }

        if (!['approve', 'reject', 'pin', 'unpin', 'delete'].includes(action)) {
          throw new Error('Action must be one of: approve, reject, pin, unpin, delete');
        }

        const updated = await moderateComment(commentId, action, undefined, 'wix-ai-assistant');
        return {
          response: {
            success: true,
            commentId: updated._id,
            newStatus: updated.status,
            isPinned: updated.isPinned,
            message: `Successfully executed ${action} on comment ${commentId}. Current status: ${updated.status}.`,
          },
        };
      }

      case 'reply-to-comment': {
        const commentId = payload?.['commentId'];
        const replyText = payload?.['replyText'];

        if (typeof commentId !== 'string' || !commentId) {
          throw new Error('Valid commentId is required');
        }

        if (typeof replyText !== 'string' || !replyText.trim()) {
          throw new Error('Non-empty replyText is required');
        }

        await moderateComment(commentId, 'owner-reply', replyText, 'wix-ai-assistant');
        return {
          response: {
            success: true,
            parentCommentId: commentId,
            message: `Official owner reply posted to comment ${commentId}.`,
          },
        };
      }

      default:
        throw new Error(`Unknown tool methodName: ${methodName}`);
    }
  },
});
