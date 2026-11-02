import type { EngageWidget, WidgetSettings } from '../types';
import { COLLECTIONS, elevatedSave, elevatedQuery, memoryStore } from './dataAccess';

// Enforced by the server and intentionally kept out of the widget settings UI.
export const INTERNAL_BLOCKED_WORDS = [
  'spam',
  'scam',
  'phishing',
  'malware',
  'ransomware',
  'viagra',
  'casino',
  'poker online',
  'crypto giveaway',
  'make money fast',
  'click here now',
  'free money',
  'pornography',
  'porn',
  'xxx',
  'adult content',
  'nude photos',
  'escort service',
  'hookup',
  'onlyfans',
  'buy followers',
  'buy likes',
  'seo services',
  'guest post',
  'backlinks',
  'work from home',
  'investment opportunity',
  'double your money',
  'guaranteed profit',
  'loan approval',
  'debt relief',
  'wire transfer',
  'gift card',
  'verify your account',
  'urgent action required',
  'click this link',
  'contact me on whatsapp',
  'contact me on telegram',
  'cocaine',
  'heroin',
  'methamphetamine',
  'drugs for sale',
  'gun for sale',
  'weapons for sale',
];

export const DEFAULT_WIDGET_SETTINGS: WidgetSettings = {
  title: 'Comments & Feedback',
  subtitle: 'Join the conversation and share your verified thoughts',
  enableComments: true,
  enableReplies: true,
  enableRatings: false,
  enableReactions: true,
  allowGuestPosting: true,
  requireApproval: false,
  maxThreadDepth: 3,
  maxCharacters: 600000,
  density: 'standard',
  primaryColor: '#3899ec',
  backgroundColor: 'transparent',
  ratingStarColor: '#ffb800',
  defaultSort: 'newest',
  pageSize: 10,
  showAvatars: true,
  showFooterBranding: true,
  blockedWords: [],
};

export async function getWidgetConfig(widgetKey: string = 'engage-comments'): Promise<EngageWidget> {
  try {
    const res = await elevatedQuery(COLLECTIONS.WIDGETS).eq('widgetKey', widgetKey).find();
    if (res.items && res.items.length > 0) {
      const item = res.items[0];
      const storedSettings = item.settings || {};
      const blockedWords = Array.isArray(storedSettings.blockedWords)
        ? storedSettings.blockedWords.filter(
          (word: string) => !INTERNAL_BLOCKED_WORDS.includes(word.trim().toLowerCase()),
        )
        : [];
      return {
        _id: item._id,
        siteId: item.siteId || 'site-default',
        widgetKey: item.widgetKey,
        targetType: item.targetType || 'generalPage',
        targetReference: item.targetReference,
        settings: { ...DEFAULT_WIDGET_SETTINGS, ...storedSettings, blockedWords },
        status: item.status || 'active',
      };
    }
  } catch (err) {
    // Fallback to memory store if collection not yet ready
  }

  if (memoryStore.widgets.has(widgetKey)) {
    return memoryStore.widgets.get(widgetKey);
  }

  const defaultWidget: EngageWidget = {
    _id: `widget-${widgetKey}`,
    siteId: 'site-default',
    widgetKey,
    targetType: 'generalPage',
    settings: { ...DEFAULT_WIDGET_SETTINGS },
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  memoryStore.widgets.set(widgetKey, defaultWidget);
  return defaultWidget;
}

export async function updateWidgetConfig(widgetKey: string, newSettings: Partial<WidgetSettings>): Promise<EngageWidget> {
  const current = await getWidgetConfig(widgetKey);
  const normalizedBlockedWords = newSettings.blockedWords
    ? Array.from(new Set(newSettings.blockedWords.map((word) => word.trim()).filter(Boolean)))
    : current.settings.blockedWords;
  const updatedSettings: WidgetSettings = {
    ...current.settings,
    ...newSettings,
    blockedWords: normalizedBlockedWords,
  };

  const updatedWidget: EngageWidget = {
    ...current,
    settings: updatedSettings,
    updatedAt: new Date().toISOString(),
  };

  try {
    await elevatedSave(COLLECTIONS.WIDGETS, {
      _id: updatedWidget._id,
      siteId: updatedWidget.siteId,
      widgetKey: updatedWidget.widgetKey,
      targetType: updatedWidget.targetType,
      targetReference: updatedWidget.targetReference,
      settings: updatedSettings,
      status: updatedWidget.status,
    });
  } catch (err) {
    // Persist in memory store
  }

  memoryStore.widgets.set(widgetKey, updatedWidget);
  return updatedWidget;
}

export async function listAllWidgets(): Promise<EngageWidget[]> {
  try {
    const res = await elevatedQuery(COLLECTIONS.WIDGETS).find();
    if (res.items && res.items.length > 0) {
      return res.items.map((item) => ({
        _id: item._id,
        siteId: item.siteId || 'site-default',
        widgetKey: item.widgetKey,
        targetType: item.targetType || 'generalPage',
        targetReference: item.targetReference,
        settings: { ...DEFAULT_WIDGET_SETTINGS, ...(item.settings || {}) },
        status: item.status || 'active',
      }));
    }
  } catch (err) {
    // fallback
  }

  if (memoryStore.widgets.size === 0) {
    await getWidgetConfig('engage-comments');
  }

  return Array.from(memoryStore.widgets.values());
}
