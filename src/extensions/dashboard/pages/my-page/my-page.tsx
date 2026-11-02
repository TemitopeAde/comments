import React, { useState, useEffect, useCallback } from 'react';
import { httpClient } from '@wix/essentials';
import {
  Page,
  Card,
  Box,
  Text,
  Heading,
  Button,
  IconButton,
  Badge,
  Input,
  FormField,
  Dropdown,
  Tabs,
  SectionHelper,
  Divider,
  Search,
  EmptyState,
} from '@wix/design-system';
import {
  Check,
  Dismiss,
  Delete,
  Pin,
  Chat,
  StarFilled,
  Download,
  Refresh,
} from '@wix/wix-ui-icons-common/lazy';
import { BusinessManagerTheme } from '../../BusinessManagerTheme';
import type { EngageComment, WidgetSettings } from '../../../../lib/types';

const { fetchWithAuth } = httpClient;
const API_ORIGIN = new URL(import.meta.url).origin;
const apiUrl = (path: string) => new URL(path, API_ORIGIN).toString();

interface OverviewStats {
  totalComments: number;
  publishedComments: number;
  pendingModerationCount: number;
  totalReviews: number;
  averageRating: number;
  recentActivity: EngageComment[];
  pluginStatus: string;
  plan: string;
  usage: {
    commentsCreated: number;
    commentsLimit: number;
  };
}

interface TrialStatus {
  available: boolean;
  upgradeUrl?: string;
}

function DashboardApp() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [comments, setComments] = useState<EngageComment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyOpenMap, setReplyOpenMap] = useState<Record<string, boolean>>({});
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({ available: false });

  // Widget settings state
  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings>({
    title: 'Comments & Feedback',
    subtitle: 'Join the conversation and share your verified thoughts',
    enableComments: true,
    enableReplies: true,
    enableRatings: false,
    enableReactions: true,
    allowGuestPosting: true,
    requireApproval: false,
    maxThreadDepth: 3,
    maxCharacters: 1000,
    density: 'standard',
    primaryColor: '#3899ec',
    backgroundColor: 'transparent',
    ratingStarColor: '#ffb800',
    defaultSort: 'newest',
    pageSize: 10,
    showAvatars: true,
    showFooterBranding: true,
    blockedWords: ['spam', 'viagra', 'casino', 'scam'],
  });

  const [blockedWordsInput, setBlockedWordsInput] = useState<string>('spam, viagra, casino, scam');

  const fetchOverview = useCallback(async () => {
    try {
      const res = await fetchWithAuth(apiUrl('/api/dashboard/overview'));
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetchWithAuth(apiUrl(`/api/dashboard/comments?${params.toString()}`));
      if (res.ok) {
        const data = await res.json();
        setComments(data.items || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  const fetchWidgetConfig = useCallback(async () => {
    try {
      const res = await fetchWithAuth(apiUrl('/api/widgets/engage-comments/public-config'));
      if (res.ok) {
        const data = await res.json();
        setWidgetSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchTrialStatus = useCallback(async () => {
    try {
      const res = await fetchWithAuth(apiUrl('/api/dashboard/trial-status'));
      if (res.ok) {
        setTrialStatus(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchComments();
    fetchWidgetConfig();
    fetchTrialStatus();
  }, [fetchOverview, fetchComments, fetchWidgetConfig, fetchTrialStatus]);

  const handleModerate = async (commentId: string, action: 'approve' | 'reject' | 'pin' | 'unpin' | 'delete' | 'owner-reply') => {
    try {
      const replyText = replyTextMap[commentId];
      const res = await fetchWithAuth(apiUrl('/api/dashboard/moderate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, action, replyText }),
      });

      if (res.ok) {
        fetchComments();
        fetchOverview();
        if (action === 'owner-reply') {
          setReplyOpenMap((prev) => ({ ...prev, [commentId]: false }));
          setReplyTextMap((prev) => ({ ...prev, [commentId]: '' }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveModerationRules = async () => {
    try {
      const words = blockedWordsInput.split(',').map((w) => w.trim()).filter(Boolean);
      const res = await fetchWithAuth(apiUrl('/api/dashboard/widgets'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widgetKey: 'engage-comments', settings: { blockedWords: words } }),
      });

      if (res.ok) {
        setWidgetSettings((prev) => ({ ...prev, blockedWords: words }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCsv = async () => {
    try {
      const res = await fetchWithAuth(apiUrl('/api/dashboard/export'));
      if (!res.ok) {
        throw new Error('Failed to export comments');
      }

      const blobUrl = URL.createObjectURL(await res.blob());
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'engage-comments-export.csv';
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <BusinessManagerTheme>
      <Page>
        <Page.Header
          title="Engage Comments, Reviews & Testimonials"
          subtitle="Manage user-generated discussions, verify customer reviews, and customize site widgets."
          actionsBar={
            <Box gap="8px" verticalAlign="middle">
              <Button priority="secondary" prefixIcon={<Refresh />} onClick={() => { fetchOverview(); fetchComments(); }}>
                Refresh
              </Button>
              <Button priority="secondary" prefixIcon={<Download />} onClick={handleExportCsv}>
                Export CSV
              </Button>
            </Box>
          }
        />

        <Page.Content>
          <Box direction="vertical" gap="16px">
            <Tabs
              activeId={activeTab}
              onClick={(tab) => setActiveTab(tab.id as string)}
              items={[
                { id: 'overview', title: 'Overview' },
                { id: 'comments', title: `Comments & Reviews (${comments.length})` },
                { id: 'widgets', title: 'Widget Preview' },
                { id: 'moderation', title: 'Moderation Rules' },
                { id: 'plans', title: 'Plans & Usage' },
                { id: 'help', title: 'Help & Quickstart' },
              ]}
            />

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && stats && (
              <Box direction="vertical" gap="16px">
                <Box gap="16px">
                  <Card>
                    <Card.Content>
                      <Box direction="vertical" gap="4px">
                        <Text size="small" secondary>Total Submissions</Text>
                        <Heading size="medium">{stats.totalComments}</Heading>
                        <Text size="tiny" secondary>Across all site pages</Text>
                      </Box>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Content>
                      <Box direction="vertical" gap="4px">
                        <Text size="small" secondary>Published Comments</Text>
                        <Heading size="medium">{stats.publishedComments}</Heading>
                        <Badge skin="success" size="small">Live on site</Badge>
                      </Box>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Content>
                      <Box direction="vertical" gap="4px">
                        <Text size="small" secondary>Pending Moderation</Text>
                        <Heading size="medium">{stats.pendingModerationCount}</Heading>
                        {stats.pendingModerationCount > 0 ? (
                          <Badge skin="warning" size="small">Action needed</Badge>
                        ) : (
                          <Badge skin="neutral" size="small">Queue clean</Badge>
                        )}
                      </Box>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Content>
                      <Box direction="vertical" gap="4px">
                        <Text size="small" secondary>Average Star Rating</Text>
                        <Box gap="6px" verticalAlign="middle">
                          <Heading size="medium">{stats.averageRating} / 5</Heading>
                          <StarFilled style={{ color: '#ffb800', width: 20, height: 20 }} />
                        </Box>
                        <Text size="tiny" secondary>{stats.totalReviews} customer reviews</Text>
                      </Box>
                    </Card.Content>
                  </Card>
                </Box>

                <SectionHelper appearance="standard" title="Site Widget Active">
                  The Engage Comments custom element widget is ready in the Wix Editor. Drag and drop it onto your blog, product pages, or landing pages.
                </SectionHelper>

                {/* Recent Activity Card */}
                <Card>
                  <Card.Header title="Recent Submissions" subtitle="Latest comments and customer reviews awaiting review or published recently." />
                  <Card.Content>
                    {stats.recentActivity.length === 0 ? (
                      <EmptyState title="No submissions yet" subtitle="When visitors leave comments on your site, they will appear here." />
                    ) : (
                      <Box direction="vertical" gap="12px">
                        {stats.recentActivity.map((item) => (
                          <Box key={item._id} direction="vertical" gap="6px" padding="12px" style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                            <Box align="space-between" verticalAlign="middle">
                              <Box gap="8px" verticalAlign="middle">
                                <Text weight="bold">{item.authorDisplayName}</Text>
                                <Badge size="small" skin={item.authorType === 'owner' ? 'premium' : item.authorType === 'member' ? 'general' : 'neutral'}>
                                  {item.authorType.toUpperCase()}
                                </Badge>
                                {item.rating && (
                                  <Box gap="2px" verticalAlign="middle">
                                    <StarFilled style={{ color: '#ffb800', width: 14, height: 14 }} />
                                    <Text size="small" weight="bold">{item.rating}</Text>
                                  </Box>
                                )}
                              </Box>
                              <Badge size="small" skin={item.status === 'published' ? 'success' : item.status === 'pending' ? 'warning' : 'danger'}>
                                {item.status.toUpperCase()}
                              </Badge>
                            </Box>
                            <Text size="small">{item.contentText}</Text>
                            <Box align="space-between" verticalAlign="middle">
                              <Text size="tiny" secondary>{new Date(item._createdDate || '').toLocaleString()}</Text>
                              <Box gap="8px">
                                {item.status === 'pending' && (
                                  <>
                                    <Button size="tiny" skin="standard" priority="primary" prefixIcon={<Check />} onClick={() => handleModerate(item._id, 'approve')}>
                                      Approve
                                    </Button>
                                    <Button size="tiny" skin="destructive" priority="secondary" prefixIcon={<Dismiss />} onClick={() => handleModerate(item._id, 'reject')}>
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Card.Content>
                </Card>
              </Box>
            )}

            {/* TAB 2: COMMENTS & MODERATION TABLE */}
            {activeTab === 'comments' && (
              <Card>
                <Card.Header
                  title="Comments & Reviews Moderation"
                  subtitle="Search, filter, approve, pin, or reply to customer discussions."
                  suffix={
                    <Box gap="12px" verticalAlign="middle">
                      <Search
                        placeholder="Search author or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Dropdown
                        placeholder="Filter Status"
                        selectedId={statusFilter}
                        onSelect={(opt) => setStatusFilter(opt.id as string)}
                        options={[
                          { id: 'all', value: 'All Statuses' },
                          { id: 'published', value: 'Published' },
                          { id: 'pending', value: 'Pending Approval' },
                          { id: 'rejected', value: 'Rejected' },
                        ]}
                      />
                    </Box>
                  }
                />
                <Card.Content>
                  {loading ? (
                    <Text>Loading comments...</Text>
                  ) : comments.length === 0 ? (
                    <EmptyState title="No comments match filter" subtitle="Try changing your search term or status filter." />
                  ) : (
                    <Box direction="vertical" gap="12px">
                      {comments.map((comment) => (
                        <Box
                          key={comment._id}
                          direction="vertical"
                          gap="8px"
                          padding="16px"
                          style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            backgroundColor: comment.isPinned ? '#f8fafc' : '#ffffff',
                          }}
                        >
                          <Box align="space-between" verticalAlign="middle">
                            <Box gap="8px" verticalAlign="middle">
                              <Text weight="bold" size="medium">{comment.authorDisplayName}</Text>
                              <Badge size="small" skin={comment.authorType === 'owner' ? 'premium' : comment.authorType === 'member' ? 'general' : 'neutral'}>
                                {comment.authorType}
                              </Badge>
                              {comment.isPinned && (
                                <Badge size="small" skin="warning">PINNED</Badge>
                              )}
                              {comment.rating && (
                                <Box gap="3px" verticalAlign="middle">
                                  <StarFilled style={{ color: '#ffb800', width: 14, height: 14 }} />
                                  <Text size="small" weight="bold">{comment.rating} / 5</Text>
                                </Box>
                              )}
                            </Box>
                            <Badge size="small" skin={comment.status === 'published' ? 'success' : comment.status === 'pending' ? 'warning' : 'danger'}>
                              {comment.status.toUpperCase()}
                            </Badge>
                          </Box>

                          <Text size="medium">{comment.contentText}</Text>

                          <Box align="space-between" verticalAlign="middle">
                            <Box gap="12px" verticalAlign="middle">
                              <Text size="tiny" secondary>{new Date(comment._createdDate || '').toLocaleString()}</Text>
                              <Text size="tiny" secondary>Likes: {comment.reactionCount || 0}</Text>
                              <Text size="tiny" secondary>Replies: {comment.replyCount || 0}</Text>
                            </Box>

                            <Box gap="6px" verticalAlign="middle">
                              {comment.status === 'pending' && (
                                <Button size="small" skin="standard" priority="primary" prefixIcon={<Check />} onClick={() => handleModerate(comment._id, 'approve')}>
                                  Approve
                                </Button>
                              )}
                              {comment.status === 'published' && (
                                <Button size="small" skin="destructive" priority="secondary" prefixIcon={<Dismiss />} onClick={() => handleModerate(comment._id, 'reject')}>
                                  Unpublish
                                </Button>
                              )}
                              <Button
                                size="small"
                                priority="secondary"
                                prefixIcon={<Pin />}
                                onClick={() => handleModerate(comment._id, comment.isPinned ? 'unpin' : 'pin')}
                              >
                                {comment.isPinned ? 'Unpin' : 'Pin'}
                              </Button>
                              <Button
                                size="small"
                                priority="secondary"
                                prefixIcon={<Chat />}
                                onClick={() => setReplyOpenMap((prev) => ({ ...prev, [comment._id]: !prev[comment._id] }))}
                              >
                                Owner Reply
                              </Button>
                              <IconButton
                                size="small"
                                skin="destructive"
                                priority="secondary"
                                onClick={() => handleModerate(comment._id, 'delete')}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Box>

                          {/* Owner Reply Drawer */}
                          {replyOpenMap[comment._id] && (
                            <Box direction="vertical" gap="8px" padding="12px" style={{ backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                              <Text size="small" weight="bold">Reply as Official Site Owner:</Text>
                              <Input
                                placeholder="Type your response to this user..."
                                value={replyTextMap[comment._id] || ''}
                                onChange={(e) => setReplyTextMap((prev) => ({ ...prev, [comment._id]: e.target.value }))}
                              />
                              <Box gap="8px" align="right">
                                <Button size="small" priority="secondary" onClick={() => setReplyOpenMap((prev) => ({ ...prev, [comment._id]: false }))}>
                                  Cancel
                                </Button>
                                <Button size="small" priority="primary" onClick={() => handleModerate(comment._id, 'owner-reply')}>
                                  Send Reply
                                </Button>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Card.Content>
              </Card>
            )}

            {/* TAB 3: WIDGET PREVIEW */}
            {activeTab === 'widgets' && (
              <Box direction="vertical" gap="16px">
                <SectionHelper appearance="standard">
                  Select the Engage Comments widget in the Wix Editor to edit its settings in the widget panel.
                </SectionHelper>

                {/* Live Preview */}
                <Box direction="vertical" gap="16px">
                  <Card>
                    <Card.Header title="Live Widget Preview" subtitle="Real-time rendering of your site widget" />
                    <Card.Content>
                      <Box
                        direction="vertical"
                        gap="12px"
                        padding="20px"
                        style={{
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          backgroundColor: widgetSettings.backgroundColor,
                        }}
                      >
                        <Heading size="small">{widgetSettings.title}</Heading>
                        <Text size="tiny" secondary>{widgetSettings.subtitle}</Text>

                        <Box direction="vertical" gap="8px" padding="12px" style={{ backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                          {widgetSettings.enableRatings && (
                            <Box gap="4px" verticalAlign="middle">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarFilled key={star} style={{ color: widgetSettings.ratingStarColor, width: 18, height: 18 }} />
                              ))}
                              <Text size="tiny" secondary style={{ marginLeft: 6 }}>Click to rate</Text>
                            </Box>
                          )}
                          <Input placeholder="Write your feedback..." readOnly />
                          <Box align="space-between" verticalAlign="middle">
                            <Text size="tiny" secondary>0 / {widgetSettings.maxCharacters} characters</Text>
                            <Button size="small" style={{ backgroundColor: widgetSettings.primaryColor, color: '#fff' }}>
                              Post Comment
                            </Button>
                          </Box>
                        </Box>

                        <Box direction="vertical" gap="8px" style={{ marginTop: '12px' }}>
                          {comments.filter((comment) => comment.status === 'published' && !comment.parentCommentId).slice(0, widgetSettings.pageSize).map((comment) => (
                            <Box key={comment._id} direction="vertical" gap="4px" padding="10px" style={{ border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                              <Box align="space-between">
                                <Text weight="bold" size="small">{comment.authorDisplayName}</Text>
                                {comment.rating && <Text size="small">{comment.rating} / 5</Text>}
                              </Box>
                              <Text size="small">{comment.contentText}</Text>
                              <Box gap="8px" verticalAlign="middle">
                                {widgetSettings.enableReactions && (
                                  <Text size="tiny" secondary>Likes: {comment.reactionCount || 0}</Text>
                                )}
                                {widgetSettings.enableReplies && (
                                  <Text size="tiny" secondary>Replies: {comment.replyCount || 0}</Text>
                                )}
                              </Box>
                            </Box>
                          ))}
                          {comments.filter((comment) => comment.status === 'published' && !comment.parentCommentId).length === 0 && (
                            <EmptyState title="No published comments yet" subtitle="Published comments will appear in this preview." />
                          )}
                        </Box>

                        {widgetSettings.showFooterBranding && (
                          <Text size="tiny" secondary style={{ textAlign: 'center', marginTop: 12 }}>
                            Powered by Engage Comments
                          </Text>
                        )}
                      </Box>
                    </Card.Content>
                  </Card>
                </Box>
              </Box>
            )}

            {/* TAB 4: MODERATION RULES */}
            {activeTab === 'moderation' && (
              <Card>
                <Card.Header title="Spam & Automated Moderation Rules" subtitle="Keep your community safe and prevent offensive content." />
                <Card.Content>
                  <Box direction="vertical" gap="16px">
                    <FormField label="Blocked Terms (Comma Separated)">
                      <Input
                        value={blockedWordsInput}
                        onChange={(e) => setBlockedWordsInput(e.target.value)}
                      />
                    </FormField>
                    <Text size="tiny" secondary>
                      Any submissions containing these words will be rejected automatically by the server.
                    </Text>

                    <Divider />

                    <Box align="space-between" verticalAlign="middle">
                      <Box direction="vertical">
                        <Text weight="bold">Duplicate Submission Protection</Text>
                        <Text size="tiny" secondary>Prevent identical comments submitted repeatedly by the same author</Text>
                      </Box>
                      <Badge skin="success">Active</Badge>
                    </Box>

                    <Box align="space-between" verticalAlign="middle">
                      <Box direction="vertical">
                        <Text weight="bold">Server-side HTML Sanitization</Text>
                        <Text size="tiny" secondary>All comments are stripped of dangerous scripts and raw HTML tags</Text>
                      </Box>
                      <Badge skin="success">Enforced</Badge>
                    </Box>

                    <Button priority="primary" onClick={handleSaveModerationRules}>
                      Save Moderation Rules
                    </Button>
                  </Box>
                </Card.Content>
              </Card>
            )}

            {/* TAB 5: PLANS & USAGE */}
            {activeTab === 'plans' && stats && (
              <Box direction="vertical" gap="16px">
                <Card>
                  <Card.Header title="Current Subscription & Quotas" subtitle="Check your active plan limits and upgrades." />
                  <Card.Content>
                    <Box direction="vertical" gap="16px">
                      <Box align="space-between" verticalAlign="middle">
                        <Box direction="vertical">
                          <Heading size="small">Active Tier: {stats.plan}</Heading>
                          <Text size="small" secondary>Full access to multi-widget configurations, moderation, and CSV export.</Text>
                        </Box>
                        <Badge skin={stats.plan === 'Pro' ? 'premium' : 'neutral'} size="medium">{stats.plan.toUpperCase()} ACTIVE</Badge>
                      </Box>

                      <Divider />

                      {trialStatus.available && trialStatus.upgradeUrl && (
                        <SectionHelper appearance="standard" title="Try Pro free">
                          Start your free trial to unlock advanced widgets, ratings, exports, and customization.
                          <Box marginTop="8px">
                            <Button
                              priority="primary"
                              onClick={() => window.open(trialStatus.upgradeUrl, '_blank', 'noopener,noreferrer')}
                            >
                              Start free trial
                            </Button>
                          </Box>
                        </SectionHelper>
                      )}

                      <Box direction="vertical" gap="6px">
                        <Box align="space-between">
                          <Text size="small">Monthly Comment Volume</Text>
                          <Text size="small" weight="bold">{stats.usage.commentsCreated} / {stats.usage.commentsLimit}</Text>
                        </Box>
                        <Box style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <Box style={{ width: `${Math.min(100, (stats.usage.commentsCreated / stats.usage.commentsLimit) * 100)}%`, height: '100%', backgroundColor: '#3899ec' }} />
                        </Box>
                      </Box>
                    </Box>
                  </Card.Content>
                </Card>

                <Box gap="16px">
                  <Card>
                    <Card.Header title="Free Plan" subtitle="Starter feedback features" />
                    <Card.Content>
                      <Box direction="vertical" gap="8px">
                        <Text size="small">✓ 1 Active Widget</Text>
                        <Text size="small">✓ Standard Comments & Replies</Text>
                        <Text size="small">✓ Up to 100 Comments / Month</Text>
                        <Text size="small" secondary>✗ CSV Export</Text>
                        <Text size="small" secondary>✗ Custom Themes & Colors</Text>
                      </Box>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Header title="Pro Plan" subtitle="For scaling businesses & communities" />
                    <Card.Content>
                      <Box direction="vertical" gap="8px">
                        <Text size="small">✓ Unlimited Widgets</Text>
                        <Text size="small">✓ Star Ratings & Review Displays</Text>
                        <Text size="small">✓ Up to 5,000 Comments / Month</Text>
                        <Text size="small">✓ Instant CSV Export</Text>
                        <Text size="small">✓ Full Color & Typography Customizer</Text>
                        <Text size="small">✓ Official Site Owner Replies</Text>
                      </Box>
                    </Card.Content>
                  </Card>
                </Box>
              </Box>
            )}

            {/* TAB 6: HELP & QUICKSTART */}
            {activeTab === 'help' && (
              <Card>
                <Card.Header title="Help & Getting Started" subtitle="Everything you need to successfully launch community discussions." />
                <Card.Content>
                  <Box direction="vertical" gap="16px">
                    <Box direction="vertical" gap="4px">
                      <Heading size="small">1. Add the widget in Wix Studio / Editor</Heading>
                      <Text size="small">
                        Go to your Wix Site Editor, click <strong>Add Elements &gt; App Widgets</strong>, and select <strong>Engage Comments</strong>. Place it on any page where you want visitor feedback.
                      </Text>
                    </Box>

                    <Divider />

                    <Box direction="vertical" gap="4px">
                      <Heading size="small">2. Customize through the Editor Panel or Dashboard</Heading>
                      <Text size="small">
                        Select the widget in the Wix Editor to adjust its title, guest access, ratings, replies, reactions, and colors in the widget settings panel.
                      </Text>
                    </Box>

                    <Divider />

                    <Box direction="vertical" gap="4px">
                      <Heading size="small">3. Moderate submissions seamlessly</Heading>
                      <Text size="small">
                        Enable "Require Moderation" under Moderation Rules if you want to review all visitor submissions before they become visible to the public. You can approve or pin comments with a single click.
                      </Text>
                    </Box>
                  </Box>
                </Card.Content>
              </Card>
            )}
          </Box>
        </Page.Content>
      </Page>
    </BusinessManagerTheme>
  );
};

export default DashboardApp;
