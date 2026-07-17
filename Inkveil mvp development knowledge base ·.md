# Inkveil — MVP Development Knowledge Base

> **This document is the single source of truth for AI coding agents** (Claude Code, Gemini/Antigravity, Cursor, ChatGPT, or any other agent). Everything needed to build the prototype tonight and the full MVP afterward is in this file. Do not ask the client clarifying questions that are already answered here — follow this spec.

**Status:** Working name, unapproved by client. Colors and name are placeholders chosen for uniqueness — swap later if the client wants.

---

## 0. How To Use This Document (read this first, agents)

1. This is a **web-only** product. There is no mobile app in this scope. Ignore any reference-screenshot UI element that exists to promote a mobile app (QR codes, "Download the app" banners, "Scan to read on app" widgets) — none of that gets built.
2. **Tonight's deliverable is Phase 0 only** (see §14): a clickable frontend prototype with fake/mock data, light + dark mode, no real backend wiring. Build that first, end to end, before touching anything in later phases.
3. **Do not clone the reference product.** Screenshots of an existing GoodNovel-style site were used only to understand _what information_ a page needs to contain (fields, states, data shown) — not how it should look. Section 4 (Design System) and Section 15 (Anti-Clone Checklist) are binding. If a generated screen could be mistaken for the reference site with the logo swapped, it's wrong.
4. Work top-down through this file: Design System → Information Architecture → Page Specs → Data Models → Folder Structure. Keep components reusable; most pages share the same card, badge, button, and modal primitives.
5. Every page must work in both light and dark mode using the CSS variables defined in §4.2. Don't hardcode hex colors inside components.

---

## 1. Project Brief

Build a unique, web-first digital fiction publishing platform where authors serialize novels chapter-by-chapter and readers unlock chapters using a coin economy. Inspired in _function_ by platforms like GoodNovel/Webnovel/Dreame, but original in _visual identity, layout, and interaction design_.

**Core loop:** Author writes & schedules chapters → Reader browses/discovers → Reader reads first N chapters free → Reader buys coins → Reader unlocks further chapters or the whole book → Unlocked content stays permanently theirs → Author earns based on unlocks/reads.

---

## 2. Non-Negotiable Constraints

- **Platform:** Web application only. No native mobile app, no mobile app store presence, no "download our app" prompts anywhere in the UI.
- **Uniqueness:** No cloned layouts, spacing, or component styling from any reference site. New name, new palette, new type system, new signature interaction (all defined below).
- **Reading:** Online reading only. No PDF export/download of chapters or books — this is a piracy/copyright protection requirement from the client.
- **Digital-first:** Only digital, chapter-based books at launch. Physical book sales/order tracking is explicitly out of scope for MVP (may come in a later phase).
- **Ownership persistence:** Once a reader unlocks a chapter with coins, it is unlocked for that account forever, regardless of pricing or promo changes later.

---

## 3. Brand Identity

|                     |                                                                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Working name**    | **Inkveil**                                                                                                                                                 |
| **Tagline (draft)** | _Stories worth staying up for._                                                                                                                             |
| **Positioning**     | An editorial, slightly nocturnal reading platform — less "app store grid," more "a quiet room with good light, at dusk, for people who read past midnight." |
| **Voice**           | Plain, warm, confident. Never salesy. Buttons say what they do ("Unlock this chapter," not "Go Premium").                                                   |

Why the name: "veil" evokes the dusk/secrecy/romance themes common in the genre (werewolf, mafia, forbidden-love tropes seen across the reference catalog) without borrowing anyone's existing brand word ("Novel," "Story," "Word," "Read" — all overused in this category).

---

## 4. Design System

### 4.1 Direction

The reference product uses a bright pink/magenta brand color, white cards, and a dense "app-store" grid. **Inkveil goes the opposite direction**: a dusk/manuscript palette — deep aubergine ink, antique brass, muted mauve — on a warm stone-lavender base, with a literary display serif instead of generic rounded UI type. Explicitly avoiding: (a) the yellow/navy/blue combo used in an earlier internal draft of this project, (b) a plain cream-background-plus-terracotta-accent look (an overused "AI-generated" default), and (c) a near-black background with a single neon accent (another overused default).

**Signature element — "Wax Seal & Ribbon":** the coin/wallet icon and every "Unlock" button are styled as a small wax-seal stamp bearing an "I" monogram. Reading progress through a book is shown as a ribbon bookmark that visually unspools as chapters are read, used consistently on book cards, the reader view, and the library. This one motif is the thing Inkveil is visually remembered by — everything else stays quiet around it.

### 4.2 Color Tokens

Define as CSS custom properties so every component just reads `var(--...)`. Two full sets, swapped by a `data-theme="light"|"dark"` attribute on `<html>`.

**Brand (shared across modes):**

```
--color-primary:      #5B2A5E   /* deep aubergine — primary actions, headers */
--color-primary-pop:  #9C5FA0   /* orchid — used for primary on dark surfaces / hover states */
--color-accent:       #B8894A   /* antique brass — coins, badges, the wax-seal motif */
--color-support:      #C77B93   /* muted mauve-rose — tags, secondary chips, ratings */
--color-success:      #4F7D5C   /* moss green — "free," "unlocked," success toasts */
--color-danger:       #A8433D   /* brick red — errors, locked-content warnings */
```

**Light mode:**

```
--bg:            #F3EEF2   /* pale lavender-stone */
--surface:       #FFFFFF
--surface-alt:   #FBF7FA
--text-primary:  #241B29
--text-secondary:#6B5C6E
--border:        #E3D9E4
--shadow:        rgba(91, 42, 94, 0.10)   /* warm-tinted, never pure grey/black */
```

**Dark mode:**

```
--bg:            #1A1420
--surface:       #261D2C
--surface-alt:   #2E2334
--text-primary:  #F3EEF2
--text-secondary:#B9A9BC
--border:        #3A2E3F
--shadow:        rgba(0, 0, 0, 0.45)
```

### 4.3 Typography

| Role                              | Typeface                      | Notes                                                                                                               |
| --------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Display / headlines / book titles | **Fraunces** (variable serif) | Used with restraint — hero headline, book title on Book Detail, section headers only. Weight 500–600.               |
| Body / UI / dashboards            | **Public Sans**               | All paragraph text, forms, nav, buttons.                                                                            |
| Utility / numeric                 | **Space Mono**                | Chapter numbers, word counts, coin balances, timestamps — gives a "manuscript ledger" feel to numbers specifically. |

### 4.4 Shape, Elevation, Motion

- Corner radius: 16px for cards/modals, 10px for inputs, 999px (pill) for buttons and badges.
- Shadows are soft and warm-tinted (see `--shadow` above), never harsh drop shadows.
- Motion: one deliberate page-load reveal (cards fade/slide up on Home and Browse), gentle hover lift on cards (2–4px translate + shadow), the ribbon-unspool animation on the reader progress bar. No scattered/ambient animation beyond this — restraint is part of the identity. Respect `prefers-reduced-motion`.
- Dark/light toggle lives in the top nav at all times, persists via localStorage (prototype) / user profile setting (post-MVP).

### 4.5 Explicitly Different From the Reference Product

- No bright pink/magenta anywhere.
- No dense uniform "poster grid" homepage — use asymmetric featured/trending sections with varied card sizes.
- No mobile app download banners, no QR codes.
- Genre/trope chips are pill-shaped in the support-rose tone, not flat gray tags.
- Ratings shown as a radial/arc meter option in addition to the bar breakdown, not a plain bar list.

---

## 5. Tech Stack

**Frontend**

- Next.js 15 (App Router), TypeScript
- Tailwind CSS (mapped to the tokens in §4.2 via `tailwind.config` theme extension — do not use default Tailwind palette colors)
- Framer Motion (page reveals, ribbon animation, modal transitions)
- React Query (server state/caching)
- Zustand (client/UI state — theme, reader settings, cart-like coin flows)
- React Hook Form + Zod (all forms: auth, create book, chapter editor metadata)
- Tiptap (rich text chapter editor)

**Backend**

- Node.js + Express.js
- MongoDB + Mongoose
- JWT auth + refresh tokens (HTTP-only cookies)
- Google OAuth (social login)
- Multer (uploads) → Cloudinary (image storage/CDN: covers, avatars)

**Payments**

- Razorpay (coin pack purchases; Indian market fits Razorpay well)

**Deployment**

- Hostinger VPS, NGINX (reverse proxy + static asset serving), PM2 (Node process manager)

---

## 6. User Roles & Permissions

| Capability                                                            | Super Admin | Admin | Author               | Reader |
| --------------------------------------------------------------------- | ----------- | ----- | -------------------- | ------ |
| Manage platform settings, coin pricing rules, payment config          | ✅          | ❌    | ❌                   | ❌     |
| Manage Admin accounts                                                 | ✅          | ❌    | ❌                   | ❌     |
| Manage all users/authors/books/categories                             | ✅          | ✅    | ❌                   | ❌     |
| View all sales, revenue, platform-wide reports                        | ✅          | ✅    | ❌                   | ❌     |
| Set free-chapter count, chapter pricing, promos, bonus-coin campaigns | ✅          | ✅    | ❌                   | ❌     |
| Create/edit/publish/schedule own books & chapters                     | —           | —     | ✅                   | ❌     |
| View own book's earnings, sales, chapter performance, reader stats    | —           | —     | ✅ (own only)        | ❌     |
| Browse, purchase coins, unlock chapters, review, bookmark             | —           | —     | ✅ (as a reader too) | ✅     |

Notes from client Q&A: Authors can only ever touch their own books/profile. Admin has full operational control day-to-day; Super Admin is the one level above that (system settings, managing other admins).

---

## 7. Information Architecture

```
Public
 ├─ Home
 ├─ Browse (all books, filters)
 ├─ Categories (genre landing pages)
 ├─ Search (results)
 ├─ Book Detail
 ├─ Author Public Profile
 ├─ Login
 └─ Register

Reader (authenticated)
 ├─ Library (books added/in progress)
 ├─ Wallet (coin balance + purchase history)
 ├─ Coin Purchase (packs + Razorpay checkout)
 ├─ Reading History
 ├─ Bookmarks
 ├─ Notifications
 ├─ Profile
 └─ Reader View (the actual chapter-reading screen, reachable from Book Detail/Library)

Author (authenticated, role=author)
 ├─ Dashboard (overview)
 ├─ My Books
 ├─ Create Book
 ├─ Chapter Editor
 ├─ Drafts
 ├─ Scheduled Publishing
 ├─ Analytics
 └─ Earnings

Admin (authenticated, role=admin/super_admin)
 ├─ Dashboard (overview)
 ├─ Users
 ├─ Authors
 ├─ Books
 ├─ Categories
 ├─ Coin Packs
 ├─ Transactions
 ├─ Reports
 ├─ Offers
 └─ Settings
```

---

## 8. Page Specifications

### 8.1 Home

- Hero: one characteristic, editorial hero (not a generic carousel banner) — a featured book with title in Fraunces, a short synopsis line, and a "Start reading" CTA.
- Featured Books (asymmetric card grid, not a uniform poster wall)
- Trending
- New Releases
- Genres (pill-shaped chip row linking to Category pages)
- Top Authors (avatar + name + follower/read count)
- Testimonials (reader quotes — real reviews once live, placeholder in prototype)
- Newsletter signup
- Footer (genre links, company, resources, community/social — no app-store badges)

### 8.2 Browse / Categories / Search

- Filter sidebar or top bar: genre, content rating, status (ongoing/completed), sort (trending/newest/rating/views)
- Result grid using the same book card component as Home
- Empty state for no-results search (interface-voiced, tells the reader what to try next)

### 8.3 Book Detail

Reference screenshots showed: cover, title, language/content-rating badges, completion status, last-updated date, author byline, star rating + count, chapter count, views, synopsis, genre/trope chips, share icons, latest-chapters list with preview snippets, "More Chapters" button, ratings breakdown, reviews list with a "Write a review" CTA, and related/you-may-like/new-release carousels.

Inkveil version — same information, different composition:

- Left: cover (rounded 16px, soft shadow) with the ribbon-progress motif if the reader has started the book, Read / Add to Library pill buttons, share row.
- Right: title (Fraunces), byline linking to Author Public Profile, badges (language, content rating, status) as small pills, rating shown as a compact radial meter + count, chapter count and views in Space Mono.
- Synopsis block with genre/trope chips inline underneath (support-rose pills).
- Chapter list: first-N free chapters shown unlocked (no lock icon), remaining shown with the wax-seal lock icon + coin price; "Unlock full book" pill button with the bundle price and savings badge.
- Ratings breakdown as a horizontal bar per score (10→1) same data as reference, restyled with brand colors.
- Reviews list (avatar, name, stars, text, date, helpful count).
- Carousels: "You may also like," "Related," "New releases" — same card component as Home/Browse.
- **Not included:** any app-download promo banner/QR code block.

### 8.4 Author Public Profile

- Avatar, name, bio, follower count, total works, total reads
- Grid of their published books (same card component)

### 8.5 Login / Register

- Email/password + Google OAuth button
- Register also asks intended role context is reader by default; becoming an author is a separate "Apply to publish" flow post-registration (keeps the funnel simple)

### 8.6 Reader View (chapter reading screen)

- Top bar: back to book, chapter title, chapter position (e.g. "Ch. 14 / 344" in Space Mono)
- Reading controls: font size stepper, light/dark toggle, line-height option
- Body text in a comfortable single-column reading measure (~65ch max width)
- Bottom bar: Previous / Next chapter, bookmark toggle
- **Unlock Modal:** triggers when a reader hits a locked chapter — shows chapter price in coins, current wallet balance, "Unlock with coins" primary action, "Not enough coins? Buy more" secondary action linking to Coin Purchase. Styled with the wax-seal icon.

### 8.7 Reader Dashboard

**Library** — grid of books the reader has added or is currently reading, each with the ribbon-progress indicator and "Continue reading" CTA.

**Wallet** — current coin balance (large, Space Mono), recent coin purchase history, recent chapter-unlock history.

**Coin Purchase** — coin pack cards (coins + price + bonus tag for larger packs), Razorpay checkout on select.

**Reading History** — chronological list of chapters read, with timestamps.

**Bookmarks** — saved chapters/positions.

**Notifications** — new chapters from followed authors/books, promo/bonus-coin campaign alerts.

**Profile** — avatar, display name, email, password/OAuth management, notification preferences, theme preference.

### 8.8 Author Dashboard

**Dashboard (overview)** — quick stats: total books, total reads, total earnings this month, recent reader comments.

**My Books** — list/grid of the author's books with status (draft/ongoing/completed), quick links to edit/analytics.

**Create Book** — form fields (mirroring the reference product's actual required fields, restyled to the Inkveil design system):

- Cover image upload (recommend 600×800px, .jpg/.png; two upload paths: "Recommended covers" template picker or "Upload your own")
- Book Title (text input, ~60 character guidance)
- Language (dropdown, default English)
- Target Audience (single-select: Female / Male / General — Inkveil adds "General" as a third option beyond the reference's binary choice, since it's a small, low-cost inclusivity improvement)
- Content Rating (single-select: 4+ / 12+ / 16+ / 18+)
- Novel Type (dropdown: Original / Adaptation)
- Genre (single-select dropdown)
- Tags (multi-select via an "Edit tags" modal)
- Synopsis (textarea, 20–300 words, live word counter, helper copy encouraging genre/tag keywords)
- Primary action: **Create**. Secondary: **Skip for now** (creates a draft shell to fill in later).

**Chapter Editor** — mirroring the reference product's actual functionality:

- Left sidebar: chapter list for this book, reorderable, "+ New Chapter" primary action, each item has a "…" menu (rename/delete/reorder)
- Main panel: chapter title field, Tiptap rich-text toolbar (bold, italic, and headings/lists as sensible additions), body editor
- Footer bar: live word count with the guidance range **600–1000 words ideal** (matches reference), **Save** (draft), **Preview**, **Publish**
- Chapter-level settings (accessible from the "…" menu or a settings icon): mark as free/locked, schedule publish date/time, set an overridden coin price if different from the book default

**Drafts** — unpublished chapters/books in progress.

**Scheduled Publishing** — calendar/list view of chapters queued for future auto-publish.

**Analytics** — per-book and per-chapter reads, unlock counts, average completion, reader retention drop-off by chapter.

**Earnings** — coin-to-revenue breakdown, payout history, own-book-only sales reports (per §6 permissions).

### 8.9 Admin Dashboard

**Dashboard (overview)** — platform-wide KPIs: active readers, active authors, books published this month, gross coin revenue, top-performing books.

**Users** — search/filter/suspend reader accounts.

**Authors** — approve author applications, view/edit author accounts, suspend if needed.

**Books** — moderate all books/chapters, feature/unfeature, remove policy-violating content.

**Categories** — manage genre/category taxonomy.

**Coin Packs** — create/edit coin packs (coins granted, price, bonus %, active/inactive).

**Transactions** — all coin purchases and chapter unlocks, searchable/exportable.

**Reports** — platform-wide sales/earnings/engagement reports (Super Admin + Admin only, per §6).

**Offers** — promotional campaigns, bonus-coin events, free-chapter-count overrides for specific books/time windows.

**Settings** — global config: default free-chapter count, default chapter pricing, payment gateway keys, platform-wide announcement banner.

---

## 9. Coin Economy & Monetization Rules

(Directly from client requirements — implement exactly this logic.)

1. Every book has an admin/author-configurable **number of free chapters** (default set globally by Admin, overridable per book).
2. Chapters beyond the free count are **locked** and show a coin price.
3. Readers **purchase coins** through recharge/coin-pack plans (managed in Admin → Coin Packs).
4. Coins **unlock individual chapters**, one at a time, at that chapter's coin price.
5. Readers also have the option to **unlock the entire remaining book** in one action, typically at a bundle discount vs. unlocking chapters individually.
6. Once unlocked, a chapter **remains permanently accessible** to that reader's account — it is never re-locked, even if pricing changes later.
7. Admin controls: how many chapters are free per book, per-chapter/per-book coin pricing, promotional discounts, and bonus-coin campaigns (e.g. "+20% coins on this pack this week").
8. No PDF/offline export of unlocked content — reading happens in the Reader View only.
9. Order/purchase tracking (client Q&A #4) = no physical shipment tracking at launch; readers instead see payment status, coin purchase history, chapter-unlock history, and reading history inside the Wallet + Reading History screens.

---

## 10. Data Models (MongoDB Collections)

```
users
  _id, name, email, passwordHash, googleId, role [reader|author|admin|super_admin],
  avatarUrl, theme [light|dark], createdAt, status [active|suspended]

authors
  _id, userId (ref users), bio, followerCount, isApproved

books
  _id, authorId (ref authors), title, coverUrl, synopsis, language,
  targetAudience [female|male|general], contentRating [4+|12+|16+|18+],
  novelType [original|adaptation], genreId (ref genres), tags [ref tags/strings],
  status [draft|ongoing|completed], freeChapterCount, defaultChapterPrice,
  fullBookUnlockPrice, views, ratingAvg, ratingCount, createdAt

chapters
  _id, bookId (ref books), order, title, bodyRichText, wordCount,
  isFree (bool, derived or overridden), coinPrice (override, optional),
  status [draft|scheduled|published], scheduledAt, publishedAt

wallets
  _id, userId (ref users), coinBalance, updatedAt

transactions
  _id, userId, type [coin_purchase|chapter_unlock|full_book_unlock],
  amountInr (if purchase), coinsSpent (if unlock), coinPackId (if purchase),
  bookId, chapterId, createdAt

coinpacks
  _id, name, coinsGranted, priceInr, bonusPercent, isActive

categories / genres
  _id, name, slug

reviews
  _id, bookId, userId, rating (1–10), text, helpfulCount, createdAt

bookmarks
  _id, userId, bookId, chapterId, createdAt

readingHistory
  _id, userId, bookId, chapterId, readAt

notifications
  _id, userId, type, message, isRead, createdAt

settings
  _id, key, value   /* global config: default free chapters, default pricing, banner text, etc. */
```

---

## 11. API Route Map (high level)

```
/api/auth          POST /register, /login, /google, /refresh, /logout
/api/users         GET /me, PATCH /me, PATCH /me/theme
/api/books         GET /, GET /:id, POST /, PATCH /:id, DELETE /:id
/api/chapters      GET /book/:bookId, POST /, PATCH /:id, DELETE /:id, POST /:id/schedule
/api/genres        GET /
/api/tags          GET /
/api/reviews       GET /book/:bookId, POST /
/api/bookmarks     GET /, POST /, DELETE /:id
/api/history       GET /
/api/wallet        GET /
/api/coinpacks     GET /
/api/payments      POST /razorpay/order, POST /razorpay/verify
/api/unlock        POST /chapter/:chapterId, POST /book/:bookId/full
/api/notifications GET /, PATCH /:id/read
/api/admin/*       users, authors, books, categories, coinpacks, transactions, reports, offers, settings
```

---

## 12. Folder Structure

```
frontend/
  app/                 (Next.js routes: public, reader, author, admin route groups)
  components/          (button, card, badge, modal, chip, toggle, ribbon-progress, wax-seal-icon...)
  features/            (book-detail, chapter-editor, wallet, admin-dashboard, ...)
  hooks/
  lib/                 (api client, formatting helpers)
  services/            (react-query hooks per domain)
  store/               (zustand: theme, reader settings)
  providers/
  types/

backend/
  src/
    config/            (db, cloudinary, razorpay)
    routes/
    controllers/
    middleware/         (auth, role-guard, rate-limit, error handler)
    models/             (mongoose schemas matching §10)
    services/
    validators/         (zod/joi schemas per route)
    utils/
```

---

## 13. Security

- JWT access tokens (short-lived) + refresh tokens (HTTP-only, secure cookies).
- Role-based access control middleware on every author/admin route.
- Helmet for HTTP headers, rate limiting on auth and payment endpoints.
- Server-side validation (zod) on every mutating route, mirrored on the frontend forms.
- No chapter content ever served to the client for a chapter the requesting user hasn't unlocked (enforce server-side, not just hidden in UI).

---

## 14. Phase 0 — Tonight's Prototype Scope

Frontend only, fake/mock JSON data matching the schemas in §10, no backend calls. Goal: a clickable, believable demo.

Build these screens:

- [ ] Home
- [ ] Browse
- [ ] Book Detail
- [ ] Reader View + Unlock Modal
- [ ] Login / Register (UI only, no real auth)
- [ ] Reader Dashboard: Library, Wallet, Coin Purchase (UI only)
- [ ] Author Dashboard: My Books, Create Book form, Chapter Editor (UI only, Tiptap wired to local state)
- [ ] Admin Dashboard: single overview screen with the nav to other sections stubbed
- [ ] Global: light/dark toggle working everywhere, responsive down to ~375px width (still web-only — this is about the browser being resized, not a native app)

Explicitly **not** tonight: real auth, real payments, real database, real email/notifications.

---

## 15. Anti-Clone Checklist (verify before calling any screen done)

- [ ] No pink/magenta brand color anywhere.
- [ ] No app-store badges, "download the app," or QR-to-app banners.
- [ ] Card layout on Home/Browse is asymmetric, not a uniform poster grid.
- [ ] Book Detail composition (left cover / right meta, restyled chapter list, radial rating meter) reads as a new layout, not the reference's layout with new colors.
- [ ] The wax-seal/ribbon signature motif appears somewhere on every major screen (book cards, reader view, wallet).
- [ ] Typography uses Fraunces + Public Sans + Space Mono, not a generic rounded UI sans everywhere.

---

## 16. Roadmap After Tonight

- **Phase 1:** Wire real backend (auth, books/chapters CRUD, MongoDB) behind the Phase 0 UI.
- **Phase 2:** Razorpay integration for real coin purchases + unlock logic enforced server-side.
- **Phase 3:** Admin moderation tools, analytics/reporting, scheduled publishing cron, notifications.
- **Phase 4 (later, out of current scope):** physical book sales/order tracking, if the client wants to expand beyond digital.
