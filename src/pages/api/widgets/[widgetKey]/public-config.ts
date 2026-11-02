import type { APIRoute } from 'astro';
import { getWidgetConfig, INTERNAL_BLOCKED_WORDS } from '../../../../lib/services/widgetsService';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { widgetKey } = params;
    if (!widgetKey) {
      return Response.json({ error: 'Widget key required' }, { status: 400 });
    }

    const widget = await getWidgetConfig(widgetKey);
    // Return only safe public configuration
    const publicConfig = {
      widgetKey: widget.widgetKey,
      title: widget.settings.title,
      subtitle: widget.settings.subtitle,
      enableComments: widget.settings.enableComments,
      enableReplies: widget.settings.enableReplies,
      enableRatings: widget.settings.enableRatings,
      enableReactions: widget.settings.enableReactions,
      allowGuestPosting: widget.settings.allowGuestPosting,
      requireApproval: widget.settings.requireApproval,
      maxThreadDepth: widget.settings.maxThreadDepth,
      maxCharacters: widget.settings.maxCharacters,
      density: widget.settings.density,
      primaryColor: widget.settings.primaryColor,
      backgroundColor: widget.settings.backgroundColor,
      ratingStarColor: widget.settings.ratingStarColor,
      defaultSort: widget.settings.defaultSort,
      pageSize: widget.settings.pageSize,
      showAvatars: widget.settings.showAvatars,
      showFooterBranding: widget.settings.showFooterBranding,
      blockedWords: [...INTERNAL_BLOCKED_WORDS, ...widget.settings.blockedWords],
    };

    return Response.json(publicConfig);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
