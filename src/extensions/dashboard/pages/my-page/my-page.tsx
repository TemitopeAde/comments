import React, { useState, useEffect, useCallback } from "react";
import { httpClient } from "@wix/essentials";
import { Toaster, toast } from "sonner";
import {
  MessageSquare,
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  CircleHelp,
  Download,
  RefreshCw,
  Check,
  X,
  Pin,
  Trash2,
  Star,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import "./dashboard.css";
import type { EngageComment, WidgetSettings } from "../../../../lib/types";

const { fetchWithAuth } = httpClient;
const API_ORIGIN = new URL(import.meta.url).origin;
const apiUrl = (path: string) => new URL(path, API_ORIGIN).toString();
const DASHBOARD_COMMENT_PREVIEW_LENGTH = 500;

const sanitizeRichText = (html: string) => {
  if (typeof document === "undefined") return html.replace(/<[^>]*>/g, " ");

  const template = document.createElement("template");
  template.innerHTML = html;
  template.content
    .querySelectorAll("script,style,iframe,object,embed,form")
    .forEach((node) => node.remove());
  template.content.querySelectorAll("*").forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      if (attribute.name.toLowerCase().startsWith("on"))
        element.removeAttribute(attribute.name);
      if (
        attribute.name === "href" &&
        !/^(https?:|mailto:)/i.test(attribute.value)
      ) {
        element.removeAttribute(attribute.name);
      }
      if (
        attribute.name === "src" &&
        !/^(https?:|data:image\/)/i.test(attribute.value)
      ) {
        element.removeAttribute(attribute.name);
      }
    });
  });
  template.content.querySelectorAll("img").forEach((image) => {
    image.setAttribute("alt", image.getAttribute("alt") || "Comment image");
    image.setAttribute(
      "style",
      "display:block;max-width:100%;max-height:320px;width:auto;height:auto;object-fit:contain;margin:8px 0;",
    );
  });
  return template.innerHTML;
};

const getRichTextPlainText = (html: string) => {
  if (typeof document === "undefined") return html.replace(/<[^>]*>/g, " ");

  const container = document.createElement("div");
  container.innerHTML = html;
  return container.textContent?.replace(/\u00a0/g, " ") || "";
};

const getRichTextPreview = (html: string, maxLength: number) => {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]*>/g, "").slice(0, maxLength);
  }

  const container = document.createElement("div");
  container.innerHTML = sanitizeRichText(html);
  let remaining = maxLength;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node: Node | null;

  while ((node = walker.nextNode())) textNodes.push(node as Text);

  for (const textNode of textNodes) {
    if (remaining <= 0) {
      textNode.remove();
    } else if (textNode.data.length > remaining) {
      textNode.data = textNode.data.slice(0, remaining);
      remaining = 0;
    } else {
      remaining -= textNode.data.length;
    }
  }

  return container.innerHTML;
};

const RichTextContent = ({
  content,
  size = "small",
}: {
  content: string;
  size?: "small" | "medium";
}) => {
  const isLong = getRichTextPlainText(content).trim().length > DASHBOARD_COMMENT_PREVIEW_LENGTH;
  const displayContent = isLong
    ? `${getRichTextPreview(content, DASHBOARD_COMMENT_PREVIEW_LENGTH)}…`
    : sanitizeRichText(content);

  return (
    <div
      style={{
        fontSize: size === "medium" ? 14 : 13,
        lineHeight: 1.5,
        overflowWrap: "anywhere",
        color: "#334155",
      }}
      dangerouslySetInnerHTML={{ __html: displayContent }}
    />
  );
};

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
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loadError, setLoadError] = useState(false);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [comments, setComments] = useState<EngageComment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyOpenMap, setReplyOpenMap] = useState<Record<string, boolean>>({});
  const [ownerReplySubmittingId, setOwnerReplySubmittingId] = useState<string | null>(null);
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    available: false,
  });

  // Widget settings state
  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings>({
    title: "Comments & Feedback",
    subtitle: "Join the conversation and share your verified thoughts",
    enableComments: true,
    enableReplies: true,
    enableRatings: false,
    enableReactions: true,
    allowGuestPosting: true,
    requireApproval: false,
    maxThreadDepth: 3,
    maxCharacters: 1000,
    density: "standard",
    primaryColor: "#3899ec",
    backgroundColor: "transparent",
    ratingStarColor: "#ffb800",
    defaultSort: "newest",
    pageSize: 10,
    showAvatars: true,
    showFooterBranding: true,
    blockedWords: ["spam", "viagra", "casino", "scam"],
  });

  const [blockedWordsInput, setBlockedWordsInput] = useState<string>("");
  const [moderationSaveState, setModerationSaveState] = useState<
    "idle" | "saving"
  >("idle");

  const fetchOverview = useCallback(async () => {
    try {
      setLoadError(false);
      const res = await fetchWithAuth(apiUrl("/api/dashboard/overview"));
      if (!res.ok) throw new Error("Overview unavailable");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
      setLoadError(true);
    }
  }, []);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetchWithAuth(
        apiUrl(`/api/dashboard/comments?${params.toString()}`),
      );
      if (!res.ok) throw new Error("Comments unavailable");
      if (res.ok) {
        const data = await res.json();
        setComments(data.items || []);
      }
    } catch (e) {
      console.error(e);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  const fetchWidgetConfig = useCallback(async () => {
    try {
      const res = await fetchWithAuth(
        apiUrl("/api/widgets/engage-comments/public-config"),
      );
      if (res.ok) {
        const data = await res.json();
        setWidgetSettings((prev) => ({ ...prev, ...data }));
        if (Array.isArray(data.blockedWords))
          setWidgetSettings((prev) => ({
            ...prev,
            blockedWords: data.blockedWords,
          }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchTrialStatus = useCallback(async () => {
    try {
      const res = await fetchWithAuth(apiUrl("/api/dashboard/trial-status"));
      if (res.ok) {
        setTrialStatus(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchWidgetConfig();
    fetchTrialStatus();
  }, [fetchOverview, fetchWidgetConfig, fetchTrialStatus]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleModerate = async (
    commentId: string,
    action: "approve" | "reject" | "pin" | "unpin" | "delete" | "owner-reply",
  ) => {
    if (action === "owner-reply") {
      if (ownerReplySubmittingId) return;
      setOwnerReplySubmittingId(commentId);
    }

    try {
      const replyText = replyTextMap[commentId];
      const res = await fetchWithAuth(apiUrl("/api/dashboard/moderate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, action, replyText }),
      });

      if (res.ok) {
        fetchComments();
        fetchOverview();
        const actionLabel =
          action === "owner-reply"
            ? "Owner reply sent"
            : action === "approve"
              ? "Comment approved"
              : action === "reject"
                ? "Comment rejected"
                : action === "pin"
                  ? "Comment pinned"
                  : action === "unpin"
                    ? "Comment unpinned"
                    : "Comment deleted";
        toast.success(`${actionLabel}.`);
        if (action === "owner-reply") {
          setReplyOpenMap((prev) => ({ ...prev, [commentId]: false }));
          setReplyTextMap((prev) => ({ ...prev, [commentId]: "" }));
        }
      } else {
        toast.error("Unable to update this comment. Please try again.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Unable to update this comment. Please try again.");
    } finally {
      if (action === "owner-reply") setOwnerReplySubmittingId(null);
    }
  };

  const handleSaveModerationRules = async () => {
    if (moderationSaveState === "saving") return;
    setModerationSaveState("saving");
    try {
      const words = widgetSettings.blockedWords;
      const res = await fetchWithAuth(apiUrl("/api/dashboard/widgets"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widgetKey: "engage-comments",
          settings: {
            blockedWords: words,
            requireApproval: widgetSettings.requireApproval,
          },
        }),
      });

      if (res.ok) {
        setWidgetSettings((prev) => ({ ...prev, blockedWords: words }));
        toast.success("Moderation rules saved.");
      } else {
        toast.error("Could not save moderation rules. Please try again.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Could not save moderation rules. Please try again.");
    } finally {
      setModerationSaveState("idle");
    }
  };

  const handleAddBlockedWord = () => {
    const word = blockedWordsInput.trim();
    if (
      !word ||
      widgetSettings.blockedWords.some(
        (existing) => existing.toLowerCase() === word.toLowerCase(),
      )
    )
      return;
    setWidgetSettings((prev) => ({
      ...prev,
      blockedWords: [...prev.blockedWords, word],
    }));
    setBlockedWordsInput("");
  };

  const handleRemoveBlockedWord = (wordToRemove: string) => {
    setWidgetSettings((prev) => ({
      ...prev,
      blockedWords: prev.blockedWords.filter((word) => word !== wordToRemove),
    }));
  };

  const handleExportCsv = async () => {
    try {
      const res = await fetchWithAuth(apiUrl("/api/dashboard/export"));
      if (!res.ok) {
        throw new Error("Failed to export comments");
      }

      const blobUrl = URL.createObjectURL(await res.blob());
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "engage-comments-export.csv";
      link.click();
      URL.revokeObjectURL(blobUrl);
      toast.success("Comments exported successfully.");
    } catch (e) {
      console.error(e);
      toast.error("Unable to export comments. Please try again.");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "comments", label: "Comments & reviews", icon: MessageSquare },
    { id: "moderation", label: "Moderation rules", icon: ShieldCheck },
    { id: "plans", label: "Plans & usage", icon: CreditCard },
    { id: "help", label: "Getting started", icon: CircleHelp },
  ];
  const showComments = (items: EngageComment[]) =>
    items.length === 0 ? (
      <div className="empty">
        <MessageSquare size={30} />
        <h3>No conversations here yet</h3>
        <p>
          Visitor comments will appear here. Try another filter if you’re
          searching.
        </p>
      </div>
    ) : (
      items.map((item) => (
        <article className="comment" key={item._id}>
          <div className="comment-top">
            <div className="avatar">
              {item.authorDisplayName?.slice(0, 2).toUpperCase() || "?"}
            </div>
            <div className="author">
              <strong>{item.authorDisplayName}</strong>
              <span>
                {item.authorType} ·{" "}
                {item._createdDate
                  ? new Date(item._createdDate).toLocaleDateString()
                  : "Date unavailable"}
              </span>
            </div>
            <span className={"badge " + item.status}>{item.status}</span>
          </div>
          <div className="comment-content">
            <RichTextContent content={item.contentText} size="medium" />
          </div>
          <div className="comment-bottom">
            <span className="muted">
              {item.rating ? (
                <>
                  <Star size={14} /> {item.rating} / 5 ·{" "}
                </>
              ) : null}
              {item.reactionCount || 0} likes · {item.replyCount || 0} replies{" "}
              {item.isPinned && " · Pinned"}
            </span>
            <div className="actions">
              {item.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleModerate(item._id, "approve")}
                  >
                    <Check />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleModerate(item._id, "reject")}
                  >
                    Reject
                  </Button>
                </>
              )}
              {activeTab === "comments" && (
                <>
                  {item.status === "published" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleModerate(item._id, "reject")}
                    >
                      Unpublish
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      handleModerate(item._id, item.isPinned ? "unpin" : "pin")
                    }
                  >
                    <Pin />
                    {item.isPinned ? "Unpin" : "Pin"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    aria-expanded={!!replyOpenMap[item._id]}
                    onClick={() =>
                      setReplyOpenMap((prev) => ({
                        ...prev,
                        [item._id]: !prev[item._id],
                      }))
                    }
                  >
                    Reply
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={"Delete comment by " + item.authorDisplayName}
                    onClick={() => {
                      if (window.confirm("Permanently delete this comment?"))
                        handleModerate(item._id, "delete");
                    }}
                  >
                    <Trash2 />
                  </Button>
                </>
              )}
            </div>
          </div>
          {replyOpenMap[item._id] && (
            <div className="reply">
              <label htmlFor={"reply-" + item._id}>Reply as site owner</label>
              <textarea
                id={"reply-" + item._id}
                value={replyTextMap[item._id] || ""}
                onChange={(e) =>
                  setReplyTextMap((prev) => ({
                    ...prev,
                    [item._id]: e.target.value,
                  }))
                }
              />
              <div className="actions">
                <Button
                  variant="outline"
                  onClick={() =>
                    setReplyOpenMap((prev) => ({ ...prev, [item._id]: false }))
                  }
                >
                  Cancel
                </Button>
                <Button
                  disabled={
                    !replyTextMap[item._id]?.trim() ||
                    ownerReplySubmittingId === item._id
                  }
                  onClick={() => handleModerate(item._id, "owner-reply")}
                >
                  {ownerReplySubmittingId === item._id && (
                    <LoaderCircle className="button-spinner" aria-hidden="true" />
                  )}
                  {ownerReplySubmittingId === item._id ? "Sending…" : "Send reply"}
                </Button>
              </div>
            </div>
          )}
        </article>
      ))
    );

  return (
    <div className="engage-dashboard">
      <Toaster position="top-center" richColors />
      <aside className="sidebar">
        <div className="brand">
          <span>
            <MessageSquare size={20} />
          </span>
          engage<span className="brand-dot">.</span>
        </div>
        <p className="nav-label">WORKSPACE</p>
        <nav aria-label="Dashboard">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              aria-current={activeTab === id ? "page" : undefined}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={18} />
              {label}
              {id === "comments" && !!stats?.pendingModerationCount && (
                <span className="nav-count">
                  {stats.pendingModerationCount}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <ShieldCheck size={20} />
          <strong>Your community, cared for.</strong>
          <p>Make room for meaningful conversations.</p>
        </div>
      </aside>
      <main>
        <div className="breadcrumb">
          Workspace <span>/</span> {tabs.find((t) => t.id === activeTab)?.label}
        </div>
        <header className="page-header">
          <div>
            <p className="eyebrow">COMMENTS & CUSTOMER FEEDBACK</p>
            <h1>{tabs.find((t) => t.id === activeTab)?.label}</h1>
            <p>A little conversation goes a long way. Keep yours moving.</p>
          </div>
          <div className="actions">
            <Button
              variant="outline"
              aria-label="Refresh dashboard"
              onClick={() => {
                fetchOverview();
                fetchComments();
              }}
            >
              <RefreshCw />
              Refresh
            </Button>
            <Button onClick={handleExportCsv}>
              <Download />
              Export CSV
            </Button>
          </div>
        </header>
        {loadError && (
          <div role="alert" className="notice">
            Some dashboard data couldn’t load. Use Refresh to try again.
          </div>
        )}
        {activeTab === "overview" &&
          (!stats ? (
            <div role="status" className="empty">
              {loadError ? "Overview unavailable." : "Loading your overview…"}
            </div>
          ) : (
            <>
              <section className="stats" aria-label="Community statistics">
                {[
                  [
                    "Total submissions",
                    stats.totalComments,
                    "Across your site",
                    MessageSquare,
                  ],
                  [
                    "Published",
                    stats.publishedComments,
                    "Conversations live on site",
                    Check,
                  ],
                  [
                    "Awaiting review",
                    stats.pendingModerationCount,
                    "Ready for your attention",
                    ShieldCheck,
                  ],
                  [
                    "Average rating",
                    stats.totalReviews ? stats.averageRating + " / 5" : "—",
                    stats.totalReviews + " customer reviews",
                    Star,
                  ],
                ].map(([label, value, hint, Icon]) => {
                  const MetricIcon = Icon as typeof Star;
                  return (
                    <div className="metric" key={String(label)}>
                      <div>
                        {String(label)}
                        <MetricIcon size={17} />
                      </div>
                      <strong>{String(value)}</strong>
                      <small>{String(hint)}</small>
                    </div>
                  );
                })}
              </section>
              <div className="notice">
                <ShieldCheck />
                <div>
                  <strong>
                    {stats.pendingModerationCount
                      ? "Your community is talking."
                      : "You’re all caught up."}
                  </strong>
                  <p>
                    {stats.pendingModerationCount
                      ? `${stats.pendingModerationCount} submissions are waiting for your review.`
                      : "New submissions will appear here as your community grows."}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter("pending");
                    setActiveTab("comments");
                  }}
                >
                  Review queue
                  <ArrowRight />
                </Button>
              </div>
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent conversations</h2>
                    <p>The latest feedback from your community.</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab("comments")}
                  >
                    View all
                    <ArrowRight />
                  </Button>
                </div>
                {showComments(stats.recentActivity)}
              </section>
            </>
          ))}
        {activeTab === "comments" && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>All conversations</h2>
                <p>
                  Review feedback, join discussions, and highlight great
                  contributions.
                </p>
              </div>
            </div>
            <div className="filters">
              <input
                aria-label="Search comments"
                type="search"
                placeholder="Search author or content…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                aria-label="Filter status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending approval</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            {loading ? (
              <div className="empty" role="status">
                Loading conversations…
              </div>
            ) : (
              showComments(comments)
            )}
          </section>
        )}
        {activeTab === "moderation" && (
          <section className="panel settings">
            <h2>A welcoming space starts here</h2>
            <p>Set the ground rules for your community.</p>
            <div className="setting-row">
              <div>
                <h3>Review before publishing</h3>
                <p>Hold new comments and replies until you approve them.</p>
              </div>
              <input
                className="switch"
                type="checkbox"
                role="switch"
                aria-label="Require approval"
                checked={widgetSettings.requireApproval}
                onChange={(e) =>
                  setWidgetSettings((prev) => ({
                    ...prev,
                    requireApproval: e.target.checked,
                  }))
                }
              />
            </div>
            <div className="setting-row vertical">
              <label htmlFor="blocked-word">Blocked words & phrases</label>
              <p>
                Submissions containing these terms are automatically rejected.
              </p>
              <div className="filters">
                <input
                  id="blocked-word"
                  placeholder="Add a word or phrase"
                  value={blockedWordsInput}
                  onChange={(e) => setBlockedWordsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddBlockedWord();
                    }
                  }}
                />
                <Button variant="outline" onClick={handleAddBlockedWord}>
                  Add term
                </Button>
              </div>
              <div className="terms">
                {widgetSettings.blockedWords.map((word) => (
                  <span className="badge" key={word}>
                    {word}
                    <button
                      aria-label={"Remove " + word}
                      onClick={() => handleRemoveBlockedWord(word)}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            {[
              "Duplicate submission protection",
              "Server-side HTML sanitization",
            ].map((label) => (
              <div className="setting-row" key={label}>
                <strong>{label}</strong>
                <span className="badge published">Active</span>
              </div>
            ))}
            <Button
              disabled={moderationSaveState === "saving"}
              onClick={handleSaveModerationRules}
            >
              {moderationSaveState === "saving"
                ? "Saving…"
                : "Save moderation rules"}
            </Button>
          </section>
        )}
        {activeTab === "plans" &&
          (stats ? (
            <section className="panel settings">
              <span className="badge">YOUR SUBSCRIPTION</span>
              <h2>{stats.plan} plan</h2>
              <p>Keep an eye on your community’s monthly usage.</p>
              <div className="setting-row">
                <strong>Monthly comments</strong>
                <span>
                  {stats.usage.commentsCreated} / {stats.usage.commentsLimit}
                </span>
              </div>
              <progress
                aria-label="Monthly comment usage"
                max={Math.max(1, stats.usage.commentsLimit)}
                value={stats.usage.commentsCreated}
              />
              <div className="plan-grid">
                <div>
                  <h3>Free</h3>
                  <p>For starting a conversation.</p>
                  <ul>
                    <li>1 active widget</li>
                    <li>Comments & replies</li>
                    <li>100 comments per month</li>
                  </ul>
                </div>
                <div>
                  <h3>Pro</h3>
                  <p>For growing communities.</p>
                  <ul>
                    <li>Unlimited widgets</li>
                    <li>Star ratings & reviews</li>
                    <li>5,000 comments per month</li>
                    <li>CSV exports & custom themes</li>
                    <li>Official owner replies</li>
                  </ul>
                </div>
              </div>
              {trialStatus.available && trialStatus.upgradeUrl && (
                <Button
                  onClick={() =>
                    window.open(
                      trialStatus.upgradeUrl,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  Start free trial
                  <ArrowRight />
                </Button>
              )}
            </section>
          ) : (
            <p role="status">
              {loadError ? "Plan information unavailable." : "Loading plan…"}
            </p>
          ))}
        {activeTab === "help" && (
          <section className="panel settings">
            <h2>Your first conversation starts here</h2>
            <p>Three steps to bringing your community together.</p>
            {[
              [
                "Add your widget",
                "In your Wix Site Editor, open Add Elements → App Widgets and select Engage Comments. Place it on a page where you want feedback.",
              ],
              [
                "Make it yours",
                "Select the widget in the editor to adjust its title, guest access, ratings, replies, reactions, and colors.",
              ],
              [
                "Set your community rules",
                "Use Moderation rules to require approval and block unwanted terms. Review, pin, and reply to submissions in Comments & reviews.",
              ],
            ].map(([title, description], index) => (
              <div className="help-step" key={title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </section>
        )}
        <footer>Engage · Better conversations. Stronger communities.</footer>
      </main>
    </div>
  );
}
export default DashboardApp;
