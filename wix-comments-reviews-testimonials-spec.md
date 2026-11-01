# Wix Comments, Reviews & Testimonials — Product Specification

**Working name:** Engage Comments  
**Document type:** Product and implementation specification  
**Platform:** Wix App Market  
**Status:** Proposed specification; validate every Wix API and App Market requirement against current official documentation before implementation.

---

## 1. Product overview

Build a production-ready Wix app that lets site owners add customizable comments, threaded discussions, star ratings, reviews, and testimonials to their websites. The app should work as a general-purpose feedback and discussion layer, with a clear path to deeper Wix Blog and Wix Stores integrations after their data and permission requirements have been validated.

The product should compete on ease of setup, flexible widget styling, strong moderation, accessibility, reliable notifications, and a polished dashboard—not by copying another app's branding or interface.

### Product goals

- Make installation and first-widget setup straightforward.
- Let site owners manage user-generated content from one dashboard.
- Support guest commenters and authenticated Wix site members.
- Offer a useful free plan and paid upgrades for advanced controls.
- Make the public widget responsive, accessible, fast, and configurable.
- Enforce authorization and content visibility on the server.
- Localize user-facing text for at least 20 languages.

### Non-goals for the initial release

- Building a standalone social network.
- Replacing Wix Blog, Wix Stores, Wix Forms, or Wix's native member system.
- Claiming that a review is a verified purchase unless a validated integration provides evidence.
- Automatically importing or modifying all existing site comments.
- AI-generated replies or sentiment analysis in V1.
- Promising native Google/social login unless the selected Wix authentication flow officially supports it in the intended widget context.

---

## 2. Target users and primary use cases

### Target users

- Wix site owners who want discussion on landing pages and articles.
- Store owners who want product feedback and review displays.
- Service businesses that want testimonials and customer feedback.
- Community and content publishers who need moderation tools.

### Core use cases

1. Add a comments widget to a page and style it to match the site.
2. Let visitors post as guests or authenticated site members.
3. Allow replies, reactions, sorting, and pagination.
4. Require moderation before public display, or publish automatically according to site settings.
5. Collect optional star ratings with written reviews.
6. Feature selected testimonials or comments.
7. Notify site owners about new submissions and users about replies where notification preferences and supported email capabilities permit.
8. Upgrade to Pro for higher quotas, advanced controls, and branding removal.

---

## 3. Product principles

- **Server-side trust:** Never trust widget-provided identity, role, subscription, moderation status, or permissions.
- **Privacy by default:** Collect only information needed to operate the service; explain guest identity and public display clearly.
- **Accessible UI:** Keyboard support, visible focus, meaningful labels, sufficient contrast, and screen-reader-friendly status messages.
- **Progressive enhancement:** The site remains usable if optional features such as reactions or attachments fail.
- **Transparent limits:** Show plan usage and limits before users hit them.
- **No fabricated verification:** Only label a review “verified purchase” when a supported integration supplies reliable evidence.
- **Idempotent operations:** Avoid duplicate comments, notifications, provisioning, or billing side effects on retries.

---

## 4. V1 scope

### Included

- Public comments widget.
- Threaded replies with configurable maximum depth.
- Guest posting and Wix member posting, subject to supported identity APIs.
- Optional anonymous display name for guest users.
- Optional star rating from 1–5 on review-enabled widgets.
- Reactions with a small configurable set, initially Like.
- Sorting by newest, oldest, and most-liked where relevant.
- Pagination or “Load more”.
- Optional moderation queue.
- Approve, reject, delete, pin, and owner-reply actions.
- Basic spam controls, rate limiting, duplicate detection, and configurable blocked terms.
- Optional image attachments if a supported Wix media-upload flow and safe validation are confirmed.
- Owner notifications and optional reply notifications using an approved Wix email capability.
- Per-widget settings and a React-based settings/editor component.
- Dashboard overview, moderation, widget settings, plans/usage, and help.
- Free and Pro plan support using Wix billing/subscription mechanisms.
- CSV export for eligible plans.
- At least 20 UI locales.
- Install/uninstall handling and privacy/data-retention policy.

### Explicitly deferred

- Google sign-in implemented independently of Wix authentication.
- Video and arbitrary file attachments.
- Nested discussion beyond the configured reply depth.
- Public user profiles and direct messaging.
- AI moderation, sentiment analytics, and generated replies.
- Dedicated Wix Blog or Wix Stores product review integration until API access, event behavior, and data model are confirmed.
- Importing comments from third-party platforms.
- Review syndication and SEO rich-result guarantees.

---

## 5. User experience

### 5.1 Site widget

A widget instance should support the following configurable sections:

1. Header: title, optional total count, optional average rating.
2. Composer: display name where needed, rating selector if enabled, comment input, attachment picker if enabled, submit action.
3. Sorting and filters: newest, oldest, most-liked; filters shown only when useful.
4. Comment list: avatar or initials, display name, relative timestamp, comment body, reaction, reply action, owner badge, moderation state visible only to authorized users.
5. Replies: indented thread with configurable depth and “View replies” / “Hide replies”.
6. Pagination: “Load more” or page navigation.
7. Empty state: configurable message and call to action.
8. Error/loading states: skeletons, retry action, accessible feedback.
9. Optional footer branding depending on plan.

### 5.2 Comment composer behavior

- Enforce a configurable character limit on the server and client.
- Trim leading/trailing whitespace and reject empty content.
- Preserve line breaks safely; render user content as text, never raw HTML.
- Show a clear success state only after the server confirms creation.
- Prevent double-submit and use idempotency protection where feasible.
- If moderation is enabled, tell the user the submission is awaiting review.
- If a submission fails, preserve the draft where safe and show a retry message.
- Do not expose internal moderation reasons or private data to public visitors.
- Make guest display-name requirements and public visibility explicit.

### 5.3 React widget settings/editor component

Create a dedicated React settings component that can be embedded in the Wix widget configuration experience where supported. It should edit a typed settings object and preview the widget.

Controls should include:

**Content**
- Widget title and subtitle.
- Enable/disable comments, replies, reactions, ratings, attachments, and sorting.
- Guest posting, member posting, anonymous display name, and owner badge.
- Moderation mode: auto-publish or require approval.
- Empty-state text, submit label, reply label, and count visibility.

**Layout**
- Compact, standard, and spacious density.
- List or card layout where appropriate.
- Avatar visibility and size.
- Reply indentation and maximum thread depth.
- Composer placement.
- Border radius, border width, spacing, and divider visibility.
- Responsive behavior and mobile layout.

**Typography**
- Font family from supported/safe options.
- Base font size, heading size, line height, and font weight.
- Body, metadata, and button text styling.
- Do not promise arbitrary external font loading unless supported and permitted.

**Colors**
- Widget background and surface.
- Primary text and secondary text.
- Link and accent color.
- Button background/text.
- Border and divider.
- Input background/border/text.
- Rating-star and reaction colors.
- Error, success, and moderation states.
- Provide contrast guidance and a reset-to-theme option.

**Behavior**
- Default sort order.
- Page size.
- Reply depth.
- Date format.
- Relative or absolute timestamps.
- Show/hide avatars, ratings, counts, and footer branding.
- Confirmation and empty-state behavior.

**Editor requirements**
- Use controlled React state and a validated schema (Zod in the dashboard/editor codebase where compatible).
- Include live preview and desktop/mobile preview modes.
- Include “Reset”, “Save”, and unsaved-change handling.
- Do not save secrets or authorization state in widget settings.
- Treat saved widget settings as untrusted input; validate and normalize them server-side.
- Persist settings per widget instance, with safe defaults for missing/legacy fields.
- Keep configuration UI strings localized.
- Respect the Wix editor extension APIs actually available to the selected widget type.

---

## 6. Dashboard specification

Use React, shadcn/ui, lucide-react, and Sonner for dashboard UI, subject to compatibility with the current Wix dashboard extension environment. Do not use Wix Design System for the dashboard unless a specific platform surface requires it.

### 6.1 Navigation

- Overview
- Comments
- Reviews & Testimonials
- Widgets
- Moderation
- Notifications
- Plans & Usage
- Settings
- Help

Hide or disable sections that are not included in the active plan, with an explanation and upgrade path.

### 6.2 Overview

Show:
- Total comments and reviews.
- Pending moderation count.
- Published comments in selected period.
- Average rating only for rating-enabled content.
- Recent activity.
- Widget installation/configuration status (`pluginStatus` or the actual supported installation status field).
- Clear “Add widget” action when no widget is installed.
- Offline/not-connected status near the bottom of the interface when connectivity can be reliably detected.
- Empty states that guide users to their first widget.

Do not invent analytics if the underlying event data is unavailable. Label counts and date ranges clearly.

### 6.3 Comments and moderation table

Columns:
- Content preview.
- Author display name / identity type.
- Page or target reference.
- Submission date.
- Status.
- Rating, if applicable.
- Reactions/replies count where available.
- Actions.

Filters:
- All, pending, published, rejected, spam, deleted (deleted items only where retained for authorized administration).
- Date range.
- Rating.
- Guest/member.
- Page/widget.
- Search text.

Actions:
- Open details.
- Approve/reject.
- Publish/unpublish.
- Pin/unpin.
- Delete.
- Reply as site owner.
- Bulk actions with confirmation.

Use server-side pagination and search. Require authorization for every action, not merely hiding buttons in the UI.

### 6.4 Widget management

- List widget instances and their page/placement information when the platform exposes it.
- Add widget flow.
- Configure each widget independently.
- Duplicate configuration where supported.
- Show configuration status and plan limits.
- Provide a preview and a safe reset option.
- Never imply a widget is installed unless the platform's supported status confirms it.

### 6.5 Notifications

Allow owners to configure:
- New submission alerts.
- Pending moderation alerts.
- Weekly summary, if implemented with a supported scheduled execution mechanism.
- Notification recipient settings, restricted to authorized site administrators.
- Optional user notification on replies, only when a valid recipient address and appropriate consent/notification basis exist.

Avoid emailing the entire comment body by default. Provide links to the dashboard instead.

### 6.6 Plans and usage

Display current plan, status, trial information if available, quotas, usage, renewal information when exposed by Wix, and upgrade/manage-subscription actions. Never trust client-supplied plan values.

---

## 7. Wix platform architecture

### 7.1 Stack

- Wix CLI app scaffolding and the supported Wix app extension model.
- Astro for app-owned backend HTTP endpoints under `pages/api`, using the supported Wix authentication helper (for example, the project's `fetchWithAuth` implementation where appropriate).
- React for dashboard surfaces and the widget settings/editor component.
- shadcn/ui, lucide-react, and Sonner for dashboard UI.
- Zod for schema validation.
- Wix Data for persistent app records.
- Wix-supported billing/subscription APIs for plans.
- Wix-supported email capability for transactional notifications.
- Wix-supported media upload APIs only if attachments are included after validation.

Do not add Next.js. Do not add external Postgres, Drizzle, Redis, QStash, or another hosted database to V1 unless a documented Wix platform limitation requires a separately approved service.

### 7.2 Logical components

1. **Site widget:** renders public content and submits actions.
2. **Widget configuration surface:** React editor component and live preview.
3. **Dashboard:** moderation, analytics, widget management, billing, and settings.
4. **API layer:** authenticated and public endpoints with strict request validation.
5. **Domain services:** comments, moderation, ratings, reactions, notifications, quotas, and billing.
6. **Wix Data:** app-owned collections with restrictive permissions.
7. **Platform adapters:** identity, site/page context, billing, email, media, and app lifecycle.

### 7.3 Authentication and identity

- Use the official Wix app authentication and identity mechanisms for the selected surfaces.
- Verify the site's app installation context and permissions server-side.
- Do not trust a `siteId`, member ID, owner role, or email sent in a request body without validating it against authenticated context.
- Separate site-owner dashboard authorization from public visitor actions.
- For guest users, use a server-issued anonymous/session identifier if the supported runtime permits it; protect against spoofing and abuse.
- Never treat an anonymous display name as proof of identity.
- Use the least-privilege scopes required for each feature.
- Before implementing Google/social sign-in, verify whether the selected Wix member-auth flow supports the required provider and context.

### 7.4 API implementation conventions

- Put Astro endpoint files under `pages/api`.
- Centralize authentication, site-context resolution, error mapping, logging, and validation.
- Validate request bodies, query parameters, path IDs, and settings with Zod.
- Use consistent response shapes and appropriate HTTP status codes.
- Apply per-site and per-session rate limits using a mechanism compatible with Wix's runtime. If no reliable distributed rate limiter is available, document the reduced guarantee and implement layered controls rather than claiming robust distributed enforcement.
- Make retryable operations idempotent.
- Avoid logging full comment bodies, email addresses, access tokens, or other unnecessary personal data.
- Return safe public errors; keep diagnostics in server logs.
- Enforce ownership and collection access at the data/API layer.

---

## 8. Proposed data model

Final collection names, field types, indexes, permission settings, and supported provisioning APIs must be verified against current Wix Data documentation before implementation. All records should be scoped to the correct app installation/site.

### 8.1 `EngageWidgets`

- `_id`
- `siteId`
- `widgetKey`
- `targetType` (generalPage, blogPost, product, testimonialSection)
- `targetReference` (opaque reference, nullable)
- `settings` (validated JSON object)
- `status` (active, disabled)
- `createdAt`
- `updatedAt`

Constraints:
- Unique logical key for site + widget instance.
- No secrets or billing authorization data in settings.
- Treat `targetReference` as an opaque platform identifier, not an authorization grant.

### 8.2 `EngageComments`

- `_id`
- `siteId`
- `widgetKey`
- `targetType`
- `targetReference`
- `parentCommentId` (nullable)
- `threadRootId` (nullable)
- `authorType` (guest, member, owner)
- `authorMemberId` (nullable; protected)
- `authorDisplayName`
- `authorAvatarReference` (nullable)
- `contentText`
- `rating` (nullable integer 1–5)
- `status` (pending, published, rejected, spam, deleted)
- `isPinned`
- `reactionCount`
- `replyCount`
- `createdAt`
- `updatedAt`
- `publishedAt` (nullable)
- `moderatedAt` (nullable)
- `moderatedBy` (nullable protected owner/admin reference)
- `schemaVersion`

Constraints:
- Validate parent exists, belongs to the same site and target, and does not exceed maximum depth.
- Never allow public queries to expose private author/member identifiers or moderation metadata.
- Do not trust stored aggregate counts without consistency/reconciliation safeguards.

### 8.3 `EngageReactions`

- `_id`
- `siteId`
- `commentId`
- `actorKey` (pseudonymous/member-derived server-validated key)
- `reactionType`
- `createdAt`

Constraints:
- Unique logical reaction per actor + comment + reaction type.
- Validate the comment is published and belongs to the same site.
- Protect against reaction spoofing and replay.

### 8.4 `EngageModerationEvents`

- `_id`
- `siteId`
- `commentId`
- `action`
- `actorReference`
- `reasonCode` (optional)
- `createdAt`

Keep the audit trail minimal and avoid retaining deleted content unnecessarily. Restrict access to authorized site administrators.

### 8.5 `EngageNotificationPreferences`

- `_id`
- `siteId`
- `ownerNotificationEmail` or supported owner recipient reference
- `newSubmissionEnabled`
- `pendingModerationEnabled`
- `replyNotificationEnabled`
- `weeklySummaryEnabled`
- `updatedAt`

Store only necessary recipient data, restrict access, and respect applicable consent and unsubscribe rules.

### 8.6 `EngageUsage`

- `_id`
- `siteId`
- `periodKey`
- `commentsCreated`
- `attachmentsStored`
- `notificationsSent`
- `updatedAt`

Usage counters must be updated safely enough to avoid obvious quota bypass on retries or concurrent requests. Define whether limits are per site, billing period, or feature before coding.

### 8.7 Provisioning and collection safety

- Provision collections idempotently through the supported Wix app/data setup mechanism.
- Do not create duplicate collections or overwrite existing customer data during app updates.
- Define restrictive permissions explicitly; do not rely on default permissions.
- Test public and owner access separately.
- Provide migration scripts or versioned migration logic for schema changes.
- Confirm whether the selected Wix Data API supports each needed query, index, transaction, and update pattern. Do not assume transactions or atomic counters are available.

---

## 9. Backend API outline

These are proposed app-owned route names, not Wix platform endpoints. Implement only routes required by the chosen extension architecture.

### Public/widget routes

- `GET /api/comments` — list published comments for an authorized widget/target with pagination and sorting.
- `POST /api/comments` — create a comment or review after validation, quota checks, spam checks, and authorization.
- `GET /api/comments/:id/replies` — list published replies for a comment.
- `POST /api/comments/:id/replies` — create a reply subject to thread-depth rules.
- `POST /api/comments/:id/reactions` — add/remove a supported reaction idempotently.
- `GET /api/widgets/:widgetKey/public-config` — return only public, validated settings.

### Owner/dashboard routes

- `GET /api/dashboard/overview`
- `GET /api/dashboard/comments`
- `POST /api/dashboard/comments/:id/moderate`
- `POST /api/dashboard/comments/:id/pin`
- `DELETE /api/dashboard/comments/:id`
- `POST /api/dashboard/comments/:id/owner-reply`
- `GET /api/dashboard/widgets`
- `POST /api/dashboard/widgets`
- `PATCH /api/dashboard/widgets/:widgetKey`
- `GET /api/dashboard/usage`
- `GET /api/dashboard/export` — authorize and enforce plan limits before streaming/exporting data.

### Route requirements

- Require site context and appropriate authorization.
- Verify every comment, parent, and widget belongs to the authenticated site.
- Reject unsupported fields and unexpected status transitions.
- Apply per-site and per-actor limits.
- Validate pagination bounds and sort fields against an allowlist.
- Return only fields needed by the caller.
- Use idempotency keys or equivalent duplicate prevention for retry-prone writes.
- Do not expose arbitrary collection queries through generic API endpoints.

---

## 10. Moderation, abuse prevention, and safety

- Support manual approval and auto-publish modes.
- Offer a configurable blocked-term list and basic duplicate-content detection.
- Reject malformed input, empty content, overlong text, invalid ratings, unsupported attachment types, and oversized payloads.
- Escape or safely render user content; do not render arbitrary HTML.
- Add server-side rate limits and cooldowns for repeated submissions.
- Use a honeypot or another low-friction anti-spam technique only where compatible with the embedding context.
- Consider CAPTCHA only after confirming compatibility and accessibility.
- Prevent unauthorized pinning, moderation, owner replies, and deletion.
- Prevent cross-site data access through guessed IDs.
- Make reporting/blocking or stronger abuse controls a post-V1 enhancement if not implemented initially.
- Establish a retention policy for rejected, spam, and deleted content.
- Provide a documented process for data export and deletion requests.

---

## 11. Email and notifications

Use a Wix-supported email/transactional notification capability confirmed for this app type. Verify API availability, sending limits, recipient rules, template requirements, and required scopes before implementation.

### Initial notification types

- New comment submitted.
- Comment awaiting moderation.
- New reply to a comment, if user notifications are enabled.
- Weekly activity summary, only if a supported scheduled mechanism is available.

### Requirements

- Queue or otherwise decouple notifications from the core write when possible.
- Prevent duplicate emails when requests are retried.
- Do not block comment creation indefinitely on an email-provider failure.
- Record delivery state and retry safely where supported.
- Provide clear notification preferences and unsubscribe handling where required.
- Use localized templates and safe links.
- Avoid putting sensitive content in subject lines or notification previews.
- Never claim delivery until the provider confirms an appropriate success state.

---

## 12. Billing and plan enforcement

Use the supported Wix billing/subscription flow for the app. Confirm current API names, App Market requirements, trial behavior, lifecycle events, and refund/cancellation semantics before coding.

### Proposed plans

**Free**
- One active widget configuration or another clearly defined starter allowance.
- Basic comments and replies.
- Basic moderation.
- Limited monthly comment volume or another sustainable quota.
- Basic themes and app branding.
- No CSV export or advanced filters.

**Pro**
- Higher or unlimited practical comment allowance, subject to fair-use limits.
- Multiple widget configurations.
- Full typography, color, spacing, and layout controls.
- Advanced moderation filters and bulk actions.
- Expanded attachment allowance if supported.
- Owner-reply and notification customization.
- CSV export.
- Remove app branding.
- Priority support as a business policy, not a technical feature.

### Billing rules

- Default-deny paid features until the server confirms the entitlement.
- Never trust a plan name or `isPro` value supplied by the browser.
- Handle pending, active, trial, expired, cancelled, and resubscribed states according to the official billing API.
- Keep access decisions centralized in a subscription/entitlement service.
- Do not delete user content merely because a subscription expires.
- Define graceful downgrade behavior: retain data, disable premium controls, and clearly explain any usage limits.
- Prevent duplicate billing side effects from repeated lifecycle events.
- Provide a reliable upgrade/manage subscription path.
- Do not hardcode prices until App Market packaging and target market research are complete.

---

## 13. Internationalization

Support at least 20 languages, with all UI copy stored in translation resources rather than hardcoded in components.

Requirements:
- Locale-aware dates, numbers, and pluralization.
- Translation coverage for widget, dashboard, validation, empty states, notifications, and billing UI.
- English fallback for missing keys.
- No user-facing string concatenation that breaks translation.
- Allow site owners to choose the widget language or use a supported site/visitor locale signal.
- Keep user-authored comment content unchanged.
- Validate layout for long translations and right-to-left languages if included in the supported set.

---

## 14. Accessibility, responsiveness, and performance

- Meet WCAG 2.2 AA as a target, subject to testing.
- Keyboard-operable composer, rating selector, menus, reply controls, and moderation actions.
- Accessible labels, focus handling, and status announcements.
- Avoid color as the sole indicator of status.
- Responsive behavior for narrow mobile screens and zoomed layouts.
- Paginate comments instead of loading an unbounded list.
- Avoid unnecessary re-fetching and duplicate requests.
- Lazy-load optional attachment previews.
- Provide loading, empty, offline, error, and retry states.
- Test with keyboard-only navigation and at least one screen reader.
- Do not claim a performance score without measurement.

---

## 15. Analytics and product metrics

Track only necessary, privacy-conscious product events:
- Widget installed/configured.
- First comment received.
- Comment submitted/published/rejected.
- Moderation action.
- Upgrade initiated/completed when supported.
- Quota reached.
- Notification delivery result.

Core metrics:
- Install-to-first-widget conversion.
- Install-to-first-comment conversion.
- Weekly active sites.
- Moderation time and pending queue size.
- Free-to-paid conversion.
- Churn and downgrade rate.
- Submission failure and spam rates.

Do not track comment contents for analytics. Document retention and any third-party analytics dependencies.

---

## 16. Testing requirements

### Unit tests
- Request schemas and settings normalization.
- Plan entitlements and quota rules.
- Comment status transitions.
- Thread-depth validation.
- Rating bounds and aggregation.
- Notification idempotency.
- Locale fallback.
- Safe content rendering.

### Integration tests
- Public visitor creates a comment.
- Guest and member flows where supported.
- Pending comments do not appear publicly.
- Owner approves, rejects, pins, replies, and deletes.
- Cross-site access attempts fail.
- A reply cannot attach to another site's comment.
- Quotas are enforced on server-side writes.
- Failed email delivery does not lose a valid comment.
- Repeated requests do not create duplicate comments or notifications.
- Subscription expiry removes paid entitlements without deleting customer content.
- Collection provisioning and migrations are idempotent.

### End-to-end tests
- Install app and configure first widget.
- Edit typography/colors/layout and preview changes.
- Publish widget and submit a comment from a mobile viewport.
- Moderate from dashboard.
- Upgrade and downgrade through the supported billing flow.
- Test all key empty, loading, offline, and error states.
- Verify localization and accessibility.

### App Market readiness
- Confirm required privacy policy, terms, support details, and data disclosures.
- Request only necessary permissions/scopes.
- Validate install, upgrade, uninstall, and data retention behavior.
- Confirm every public-facing claim matches the shipped feature.
- Test on supported Wix editor/site environments.
- Complete current Wix App Market review requirements.

---

## 17. Implementation phases

### Phase 0 — Wix capability validation
1. Confirm current Wix CLI scaffolding and supported extension types.
2. Verify site widget and React settings/editor integration.
3. Verify site context, member identity, and guest posting constraints.
4. Verify Wix Data collection creation, permissions, query limits, and supported indexes.
5. Verify email, billing, scheduled tasks, and media upload capabilities.
6. Verify available Blog and Stores integration APIs and required scopes.
7. Record decisions and links to official documentation in the repository.

**Exit criterion:** No critical feature is based solely on an assumed API.

### Phase 1 — Foundation
- App scaffold and environment setup.
- Authentication and site context.
- Data collection provisioning and migrations.
- Shared validation, logging, error handling, and entitlement service.
- Dashboard shell and localization infrastructure.

### Phase 2 — Core comments
- Public widget.
- Comment composer and list.
- Replies and pagination.
- Guest/member handling supported by verified APIs.
- Basic reactions.
- Moderation and safe rendering.

### Phase 3 — Customization
- React widget settings editor.
- Live preview.
- Typography, color, spacing, layout, labels, and behavior controls.
- Per-instance settings persistence and migration.

### Phase 4 — Reviews and notifications
- Ratings and average-rating display.
- Testimonials and featured content.
- Owner notifications and optional reply notifications.
- Attachment support only after media upload/security validation.

### Phase 5 — Monetization
- Wix subscription integration.
- Free/Pro entitlements and quota enforcement.
- Billing status handling and downgrade behavior.
- Upgrade/manage plan UI.

### Phase 6 — Release readiness
- Security review, accessibility, performance, localization.
- Integration and end-to-end tests.
- Privacy and data-retention documentation.
- App Market submission checklist.

### Phase 7 — Integrations
- Evaluate dedicated Wix Blog integration.
- Evaluate Wix Stores product-review integration.
- Implement only after confirming API support, data ownership, event reliability, and permissions.

---

## 18. Repository structure proposal

Adapt this to the actual Wix CLI scaffold rather than forcing an incompatible folder structure.

```text
src/
  components/
    dashboard/
    widget-editor/
    comments/
    moderation/
  lib/
    auth/
    validation/
    permissions/
    billing/
    localization/
    errors/
  services/
    comments/
    moderation/
    reactions/
    notifications/
    widgets/
    usage/
  locales/
    en/
    ...
pages/
  api/
    comments/
    dashboard/
    widgets/
    usage/
```

Use the folder conventions required by the actual Wix CLI/Astro project. Do not create duplicate implementations of authentication or billing across endpoints.

---

## 19. Open questions and technical gates

Resolve these during Phase 0 rather than silently assuming support:

1. Which exact Wix widget extension type supports the desired React configuration editor and how are per-instance settings delivered to the live widget?
2. What is the supported way to resolve the current site and current member identity in each runtime?
3. Can guest submissions be securely associated with a server-issued pseudonymous identifier in the chosen widget context?
4. Which Wix Data permission model and APIs are suitable for private moderation data and public published comments?
5. Which official Wix email API is permitted for this app type, and what are its limits?
6. Which official billing APIs and lifecycle events apply to the intended App Market distribution model?
7. Is a supported scheduled execution mechanism available for weekly summaries and cleanup?
8. Which media upload APIs are available in the widget context, and how are files validated, restricted, and deleted?
9. Which APIs support Blog post references and Stores product references without requiring unsupported direct collection access?
10. What data cleanup and deletion callbacks are required on uninstall under current Wix rules?

If a capability is unsupported, revise the feature or use an officially supported alternative. Do not ship a fake control or claim a feature is operational when it is not.

---

## 20. Definition of done

V1 is ready for release only when:

- The app can be installed and configured without manual collection setup.
- The site widget renders correctly on supported Wix environments.
- Guests and members can post according to configured permissions and supported identity flows.
- Replies, reactions, ratings, and moderation enforce server-side validation.
- Private comments and moderation data cannot be read publicly.
- Widget settings persist per instance and survive reloads and schema upgrades.
- Owner email notifications use a verified supported API and handle retries safely.
- Billing entitlements are checked server-side.
- Free and Pro quotas behave consistently.
- All important UI is localized in at least 20 languages.
- Accessibility, mobile responsiveness, security, and end-to-end tests pass.
- Privacy, retention, and deletion behavior are documented.
- All App Market claims reflect implemented and tested functionality.

---

## Official documentation research checklist

Use the current official Wix developer documentation during Phase 0 and add exact links to the implementation decision record:

- Wix CLI and app extension architecture.
- Site widgets and widget configuration/editor extensions.
- Wix app authentication, site context, and member identity.
- Wix Data collections, permissions, queries, and indexes.
- Wix billing/subscription and App Market requirements.
- Wix email/transactional messaging capability.
- Wix media upload and file handling.
- Wix Blog and Wix Stores APIs and scopes.
- App lifecycle, uninstall, and data retention requirements.

**Important:** This document is a product and engineering plan, not proof that every proposed integration is supported in every Wix extension context. The implementation team must validate the current official API contracts before coding each platform-dependent feature.
