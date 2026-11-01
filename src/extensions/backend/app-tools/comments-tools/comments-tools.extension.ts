import { extensions } from '@wix/astro/builders';

export default extensions.appTools({
  id: '12e8b50c-d743-4452-8976-2315adfef1a9',
  name: 'comments-tools',
  tools: [
    {
      methodName: 'get-comments-summary',
      displayName: 'Get Comments & Reviews Summary',
      description: 'Returns a high-level summary of community activity, including total comments, pending moderation queue size, total customer reviews, and average star rating. Use this tool when the site owner or collaborator asks "how are my reviews doing?", "give me a comments summary", "what is my average rating?", or wants an overview of customer feedback.',
      activated: true,
      requestSchema: {
        type: 'object',
        properties: {
          widgetKey: {
            type: 'string',
            description: 'Optional widget identifier to filter summary stats.',
          },
        },
      },
      responseSchema: {
        type: 'object',
        properties: {
          totalComments: { type: 'number' },
          publishedComments: { type: 'number' },
          pendingModerationCount: { type: 'number' },
          totalReviews: { type: 'number' },
          averageRating: { type: 'number' },
          activePlan: { type: 'string' },
        },
      },
    },
    {
      methodName: 'list-pending-comments',
      displayName: 'List Pending Moderation Comments',
      description: 'Lists comments and customer reviews awaiting site owner approval before public display. Use this tool when a collaborator asks "what comments need approval?", "show me pending reviews", or wants to inspect the moderation queue. Returns comment IDs, author names, content, and submission timestamps.',
      activated: true,
      requestSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of pending items to return (default 10).',
          },
        },
      },
      responseSchema: {
        type: 'object',
        properties: {
          pendingCount: { type: 'number' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                author: { type: 'string' },
                content: { type: 'string' },
                rating: { type: 'number' },
                date: { type: 'string' },
              },
            },
          },
        },
      },
    },
    {
      methodName: 'moderate-comment',
      displayName: 'Moderate Comment or Review',
      description: 'Performs a moderation action on a comment or review, such as approving it for public display, rejecting it, pinning it to the top, unpinning it, or deleting it. Use this tool when the collaborator says "approve comment [id]", "publish review [id]", "reject comment [id]", "pin review [id]", or "delete comment [id]". Requires a valid commentId and action.',
      activated: true,
      requestSchema: {
        type: 'object',
        properties: {
          commentId: {
            type: 'string',
            description: 'The unique identifier of the comment to moderate.',
          },
          action: {
            type: 'string',
            enum: ['approve', 'reject', 'pin', 'unpin', 'delete'],
            description: 'The moderation action to perform.',
          },
        },
        required: ['commentId', 'action'],
      },
      responseSchema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          commentId: { type: 'string' },
          newStatus: { type: 'string' },
          isPinned: { type: 'boolean' },
          message: { type: 'string' },
        },
      },
    },
    {
      methodName: 'reply-to-comment',
      displayName: 'Reply to Comment as Owner',
      description: 'Posts an official reply from the site owner or store team to a specific customer review or comment. Use this tool when the collaborator wants to respond to a customer, answer a visitor question, or thank a reviewer for their feedback. Requires commentId and replyText.',
      activated: true,
      requestSchema: {
        type: 'object',
        properties: {
          commentId: {
            type: 'string',
            description: 'The ID of the parent comment to reply to.',
          },
          replyText: {
            type: 'string',
            description: 'The official response message to publish.',
          },
        },
        required: ['commentId', 'replyText'],
      },
      responseSchema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          replyId: { type: 'string' },
          parentCommentId: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  ],
});
