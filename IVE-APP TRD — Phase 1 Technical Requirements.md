# IVE-APP — Technical Requirements Document (TRD)

**Phase 1 — Foundation (Umum + CMS + Interactive Components)** · Version 1.0 · 2026-10-19 · Status: Draft for review

**Inputs:** PRD v2.0 (IVE-APP-PRD-v2) · TAD v1.0 (2026-09-16) · **Audience:** engineers, AI coding agents, QA, tech lead · **Language:** English; user-facing copy is quoted in Indonesian

## 0. Purpose, Hierarchy, and Conventions

### 0.1 Purpose

The PRD says what the product must do. The TAD says how the system is shaped. This TRD turns both into numbered, testable technical requirements that can be implemented, reviewed and verified one at a time.

The TAD (2026-09-16) was written against PRD v1.0. PRD v2.0 changed scope, phasing and several product rules. Section 2 therefore lists every difference between the two documents and states the TRD decision for each.

### 0.2 Hierarchy and precedence

| Document | Answers | Authority |
| --- | --- | --- |
| PRD v2.0 | What and why: scope, priorities, phases, acceptance | Scope and priority |
| TAD v1.0 | System shape: stack, modules, data and API patterns | Architecture patterns, unless Section 2 changes them |
| TRD (this document) | Testable requirements, interfaces, limits, test duties | Technical detail |
| AGENTS.md | How coding agents work | Process |

Precedence: (1) scope and priority follow PRD v2.0; (2) architecture follows TAD v1.0 except where Section 2 records a deliberate change; (3) everything else follows this TRD. Conflicts are recorded, never silently overridden (PRD §13).

Items tagged **\[CONFIRM\]** need product or tech-lead sign-off. Until then, implement the *interim default* stated in the same row.

### 0.3 Requirement format

Each requirement has an ID (TR-AREA-nnn), a statement using RFC 2119 keywords (MUST, SHOULD, MAY), a priority, a source, and a verification code.

| Field | Values |
| --- | --- |
| Priority | **P0** required for MVP · **P1** after P0 is stable · **PH2** Phase 2 preparation only (do not build) |
| Source | PRD FR or section; TAD section number |
| Verification | **U** unit · **I** integration (real PostgreSQL) · **E** end-to-end · **A** accessibility check · **P** performance check · **S** security test · **R** review or CI inspection |

Numeric limits marked *(proposed)* are starting values. They SHOULD be env- or config-tunable and validated in the first load and usability test.

## 1. Phase 1 Technical Scope

| Class | Items |
| --- | --- |
| **P0** | Catalog and hierarchical navigation for level Umum · lesson page · Content Block Engine · Interactive Registry with Formula Sandbox, Projectile Simulator, Trigonometry Visualizer, Cell Explorer · lesson quiz, practice and evaluation · AI tutor (session history) · auth with roles user/admin · guest and account progress with merge · Admin CMS with sources and publish gate · minimal analytics · seed · tests |
| **P1** | Search · favorites · My Learning · rule-based recommendations · Atom Explorer · History Timeline · Experiments gallery · standalone practice bank page · persisted AI history · extended analytics · state-aware AI |
| **Out of scope** | All Phase 2 and 3 items, backlog items, BullMQ workers, pgvector, microservices, video hosting (TAD §3) |

### 1.1 Forward-compatibility requirements (PRD §5.3)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-FWD-001 | Every lesson MUST carry `educationLevelId`. All four levels MUST exist in schema and seed; only Umum has lessons. | P0 | PRD 5.3; TAD 7.2 | I |
| TR-FWD-002 | Authorization MUST go through one policy function `can(actor, action, resource)`. Handlers MUST NOT compare role strings inline, so adding a TEACHER role is additive. | P0 | PRD 4.3 | R, U |
| TR-FWD-003 | Questions MUST be standalone entities linked to lessons by a join table (RC-07). | P0 | PRD 5.3 | I |
| TR-FWD-004 | Lessons MUST record author, reviewer and review time. | P0 | PRD 5.3, 7.5 | I |
| TR-FWD-005 | Interactive component configuration MUST be separate from implementation (registry plus schema). | P0 | PRD 5.3 | R |
| TR-FWD-006 | Phase 1 MUST NOT create class, enrolment or access-code tables. | P0 | PRD 5.3 | R |

## 2. Reconciliation Register: PRD v2.0 vs TAD v1.0

| ID | Topic | Conflict or gap | TRD decision |
| --- | --- | --- | --- |
| RC-01 | Level scope | PRD: only Umum has content in Phase 1. TAD §1, §2, §39, §42, §46 treat four levels and 40+ lessons as P0 and use an SMA path for E2E. | Schema and seed keep all four levels. Only Umum receives lessons (≥15, PRD §10.1). Levels without a visible lesson render “Segera hadir” as a non-link. E2E uses the Umum path. **\[CONFIRM seed count\]** |
| RC-02 | Interactive set | PRD: P0 is Formula Sandbox, Projectile, Trigonometry, Cell Explorer; P1 is Atom and Timeline. TAD §10 lists five keys as P0 and has no Formula Sandbox. | Registry keys: `formula-sandbox` (new), `projectile-simulator`, `trigonometry-visualizer`, `cell-explorer` (P0); `atom-explorer`, `history-timeline` (P1). |
| RC-03 | Search, favorites, recommendations | PRD: P1. TAD §2: Search and Favorites are P0. | Build after P0 is stable. The Favorite table and search indexes go into the first migration because they are cheap. |
| RC-04 | Analytics | PRD: minimal events are P0 because metrics need them (§3.6), plus three new events. TAD §7.13, §44: optional, eight events. | AnalyticsEvent table and adapter are P0 with five core events. New events: `interactive_used`, `source_viewed`, `ai_feedback`. External vendor stays optional. |
| RC-05 | Lesson lifecycle | PRD §7.5: DRAFT, IN\_REVIEW, PUBLISHED, ARCHIVED with reviewer recorded. TAD §7.5: three statuses. | Add IN\_REVIEW, `authorId`, `reviewerId`, `reviewedAt`, `publishedAt`, `version`. State machine in 4.9. |
| RC-06 | Sources and publish gate | PRD FR-19: at least one complete source, learning objectives, alt text and fallback text are required to publish. TAD §27 has none of these and no source model. | Add `LessonSource`, `learningObjectives`, and an extended publish gate that returns structured failures (TR-CMS-004). |
| RC-07 | Question reuse | PRD FR-08, FR-20: questions are reusable across lessons and a bank. TAD §7.7: `Question.lessonId` is required. | Standalone `Question` plus ordered `QuestionLesson` join. Only the join is used in P0. |
| RC-08 | Quiz access and attempts | PRD: guests take server-graded quizzes; double submit must not duplicate records; evaluation follows the quiz. TAD §22 lists `POST /api/quiz/submit` as authenticated, §7.9 keeps guest attempts local-only, and there is no per-answer record. | Quiz endpoints are public. Three-step attempt lifecycle with a signed attempt token (TR-QZ-003). Authenticated completions persist `QuizAttempt` and `QuizAttemptAnswer`. Guests store nothing server-side. The TAD rule never to send `correctAnswer` before submit is kept. |
| RC-09 | AI access and history | PRD: guests are not barred from AI; history for logged-in users is P1. TAD §22 lists `/api/ai/chat` as authenticated, yet §20 plans non-authenticated rate limiting, and §46 Step 10 persists conversations. | Guests MAY use AI under a stricter quota **\[CONFIRM, PRD D-10\]**. Session history lives in the client in P0. Persistence is P1 behind `AI_HISTORY_ENABLED`. Interim default: allow guests with the guest quota. |
| RC-10 | AI behaviour | PRD FR-09 adds grounding in lesson and sources, no leaking of active-quiz answers, feedback, and sandbox-aware context (stretch). TAD §17, §18 cover none of these. | Added as TR-AI-005 to TR-AI-009. |
| RC-11 | Branding strings | PRD: product is IVE-APP; the AI entry point is “Tanya AI”. TAD uses ‘ive’ in SEO titles and ‘Edu AI’ in error copy. | All user-facing strings live in one Indonesian message catalog. SEO template is \`%s |
| RC-12 | Roles | PRD §4.3: guru is reserved for Phase 2. TAD §21: USER and ADMIN. | Enum stays USER and ADMIN in Phase 1. All checks go through `can()` (TR-FWD-002). TEACHER is added by migration in Phase 2. |
| RC-13 | Slug scope | PRD §9 routes use four-segment paths and Fisika will exist at several levels. TAD §22 addresses subjects, topics and lessons by one slug and only hints at scoped uniqueness. | Unique per parent: Subject (level, slug), Topic (subject, slug), Lesson (topic, slug). Public API addresses content by path tuple (§6). |
| RC-14 | Interactive config | PRD: config is validated and the admin form is generated. TAD §10: config is free JSON. | Each registry entry carries a Zod config schema, validated on write and publish (TR-INT-003, TR-INT-004). |
| RC-15 | CMS UX and concurrency | PRD FR-16: three-panel editor, schema-driven inspector, publish checklist, confirmed destructive actions. TAD §25: plain CRUD. | See 4.9. Add `Lesson.version` with HTTP 409 on stale writes. Up/down reorder is required; drag and drop is optional. |
| RC-16 | Navigation | PRD FR-18: tree menu, breadcrumbs, sidebar TOC. TAD has no navigation endpoint. | Add `GET /api/navigation` (4.1). |
| RC-17 | Guest favorites | PRD §4.3: favorites need an account. TAD §13 defines `ive_favorites` in localStorage. | Drop `ive_favorites` in Phase 1 and show a login prompt. **\[CONFIRM\]** Interim default: no guest favorites. |
| RC-18 | Infrastructure | PRD NFR-04: add Redis, queues or search engines only when measured. TAD §0, §31, §32 list Redis, BullMQ and pgvector as foundations. | Redis is OPTIONAL (rate limits, cache) with a documented in-memory fallback. BullMQ and pgvector are not installed in Phase 1. AI context is built from the lesson itself. |
| RC-19 | Seed and E2E | PRD §10.1, §15: ≥15 Umum lessons; flows E2E-01 to E2E-07. TAD §39, §42: 40+ lessons, SMA path. | Follow PRD. PRD §15 replaces the TAD §42 flow lists. |
| RC-20 | Supabase exposure (TAD gap) | TAD names Supabase Auth and Prisma but does not say how tables reachable through Supabase's auto-generated API are protected, or where the role lives. | RLS enabled with deny-by-default on every application table. Role is read only from the PostgreSQL User row (TR-AUTH-002, TR-AUTH-003). |
| RC-21 | Web-layer security (TAD gap) | TAD §28 omits CSRF and origin checks, CSP and security headers. | Added as TR-SEC-006 to TR-SEC-009. |
| RC-22 | Environment | TAD §40 variable list. | Adds `QUIZ_TOKEN_SECRET`, `RATE_LIMIT_SALT`, `AI_ENABLED`, `AI_HISTORY_ENABLED`, `ANALYTICS_ENABLED`, `SENTRY_DSN` (§10). |

## 3. Architecture Requirements

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-ARC-001 | The system MUST be one deployable modular monolith. Routes that touch the database or AI MUST declare the Node.js runtime. | P0 | TAD 0, 4 | R |
| TR-ARC-002 | Dependency direction MUST be UI → service → repository → Prisma. Prisma imports MUST appear only in `*.repository.ts` and `prisma/`. Enforce with a lint or dependency-graph rule. | P0 | TAD 0, 48 | R |
| TR-ARC-003 | Modules are the TAD §6 list plus `formula`, `sources`, `navigation`, `audit`. A module owns its tables and exposes only service interfaces to others. | P0 | TAD 6 | R |
| TR-ARC-004 | AI, storage, cache and rate limiting, analytics and auth MUST sit behind adapter interfaces with in-memory or fake implementations for tests and local development. | P0 | TAD 0, 16 | U |
| TR-ARC-005 | Server-only code (Prisma, service-role key, AI adapter, token signing) MUST be guarded with `server-only`. CI MUST fail if such modules appear in a client bundle. | P0 | TAD 28 | R, S |
| TR-ARC-006 | The Next.js process MUST stay stateless. Durable state lives in PostgreSQL, cache in Redis, files in object storage. | P0 | TAD 4 | R |
| TR-ARC-007 | The formula evaluator and content-block Zod schemas MUST be isomorphic, one source used by the CMS, the server publish gate and the client renderer. | P0 | PRD FR-06, FR-07 | U, R |
| TR-ARC-008 | Environment variables MUST be validated with Zod at boot, with separate server and public schemas. Production MUST fail fast on missing required values. | P0 | TAD 40 | U |
| TR-ARC-009 | Optional features MUST sit behind env flags (`AI_ENABLED`, `AI_HISTORY_ENABLED`, `ANALYTICS_ENABLED`). A disabled feature MUST hide its UI entirely (no dead buttons). | P0 | PRD 7.3 #11 | E |
| TR-ARC-010 | Public catalog and lesson pages MUST be server-rendered and cacheable with tag-based revalidation. Interactive blocks are client islands. Admin and user-specific responses are `no-store`. | P0 | TAD 29, 30 | P, I |
| TR-ARC-011 | A new runtime dependency MUST have a one-line ADR (reason, size, license, maintenance). Lockfile committed. Versions pinned at bootstrap and recorded in the README. CI MUST flag disallowed licenses. | P0 | TAD 48 R10–12 | R |
| TR-ARC-012 | Errors MUST use a typed `AppError` with a code. A route wrapper maps it to the API envelope. Unknown errors return INTERNAL\_ERROR plus a request ID, never a stack trace. | P0 | TAD 23 | U, I |
| TR-ARC-013 | The TAD §5 folder layout stays. Additions: `src/modules/{formula,sources,navigation,audit}`, `src/messages/id.ts`, and `src/components/interactive/<key>/{index,calc,schema,fallback}`. | P0 | TAD 5 | R |

## 4. Functional Technical Requirements

### 4.1 Catalog and navigation (PRD FR-01 to FR-04, FR-18)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-CAT-001 | Slugs MUST be unique per parent: Subject (educationLevelId, slug), Topic (subjectId, slug), Lesson (topicId, slug). Public lookups use the path tuple. | P0 | RC-13 | I |
| TR-CAT-002 | A lesson is public only if the lesson, its topic and its subject are all PUBLISHED. This rule MUST live in one repository builder (`publicLessonWhere`). No other code path may build a public lesson query. | P0 | TAD 7.5 | I |
| TR-CAT-003 | A level is active iff it has at least one publicly visible lesson. Homepage, menu and level picker derive from this (cached, tag `catalog`). With exactly one active level the picker MUST be hidden (PRD FR-02). | P0 | PRD FR-01, FR-02 | I, E |
| TR-CAT-004 | An inactive level page returns HTTP 200 with a “Segera hadir” message and `noindex`. It MUST NOT link into empty catalogs. | P0 | PRD FR-01 | E |
| TR-CAT-005 | `GET /api/navigation?level=umum` returns subjects → topics with lesson counts and `hasInteractive` counts, not lessons. Lesson lists for a topic load on demand. It is cached with tag `catalog`. | P0 | PRD FR-18 | I, P |
| TR-CAT-006 | The lesson sidebar lists sibling lessons of the topic by `order`. Server HTML MUST NOT contain per-user progress. Progress is applied client-side after hydration so the page stays cacheable. | P0 | PRD FR-18 | P, E |
| TR-CAT-007 | `Lesson.hasInteractive` is a denormalized boolean recomputed by the lesson service on every save. A test MUST verify it matches the blocks. | P0 | PRD FR-04 | U |
| TR-CAT-008 | Ordering uses an integer `order`, reordered gap-free in one transaction. Ties break by (`createdAt`, `id`). | P0 | TAD 7.4 | I |
| TR-CAT-009 | Breadcrumbs are built server-side from the path. Previous and next lesson are computed inside the topic. | P0 | PRD FR-05, FR-18 | E |
| TR-CAT-010 | The mega menu (desktop) and nested drawer (mobile) MUST be keyboard operable with correct ARIA, and MUST cause no layout shift. From any lesson the user can reach the subject or topic in at most two actions. | P0 | PRD FR-18 | A, E |
| TR-CAT-011 | Unknown or archived paths return 404 with friendly copy and a link back to the catalog. | P0 | PRD FR-03 | E |

### 4.2 Content Block Engine (PRD FR-06)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-CNT-001 | `contentBlocks` is JSON validated by a Zod discriminated union on `type`. A `contentSchemaVersion` integer is stored. An unknown version renders a safe fallback and logs. | P0 | TAD 7.6, 24 | U |
| TR-CNT-002 | Every block has a stable `id` (unique within the lesson), a `type`, and optional `sourceRefs` (LessonSource ids). Block ids double as anchors and analytics references. | P0 | PRD FR-19 | U |
| TR-CNT-003 | Limits *(proposed)*: at most 150 blocks and 512 KB of block JSON per lesson, enforced on write with HTTP 413 or 400. | P0 | TAD 28 | I |
| TR-CNT-004 | Rich text is a restricted Markdown subset (paragraphs, emphasis, lists, links, inline code) rendered with raw HTML disabled. Links allow only http, https and mailto, and external links use `rel` with noopener and noreferrer. Any path that must render HTML MUST pass an allow-list sanitizer documented in an ADR. | P0 | TAD 7.6, 9 | U, S |
| TR-CNT-005 | Formulas use KaTeX with `trust` false and `throwOnError` false, plus size and macro-expansion limits. A render failure shows the raw LaTeX in code style. KaTeX's MathML output MUST stay enabled for assistive technology. | P0 | PRD FR-06 | U, A |
| TR-CNT-006 | Video blocks accept only a YouTube id matching `^[A-Za-z0-9_-]{11}$`, embed via youtube-nocookie, require a `title`, and load the iframe only after the user clicks a thumbnail facade. | P0 | TAD 33, 29 | U, P |
| TR-CNT-007 | Image blocks require `alt` (1 to 250 chars) unless explicitly marked `decorative`. Width and height are required to prevent layout shift. Image hosts are limited to the storage CDN. | P0 | PRD FR-06 | U, A |
| TR-CNT-008 | One `LessonContentRenderer` serves the public lesson and admin preview. Each block sits in its own error boundary so one failure renders a compact fallback only. Unknown types render a safe fallback. | P0 | TAD 9, 26 | U, E |
| TR-CNT-009 | Interactive blocks are loaded with a dynamic client-only import, only when within about 200 px of the viewport. Server HTML renders a fixed-height placeholder plus the required `fallbackText`, so the lesson stays understandable without JavaScript. | P0 | PRD FR-05, FR-07.9 | P, E |
| TR-CNT-010 | Block types and limits *(proposed)*: heading (level 2 or 3, ≤200 chars) · text (≤5,000) · formula (latex ≤1,000, display flag) · callout (variant info, tip, warning, note; ≤1,000) · example (kind real-world or worked; ≤3,000) · interactive (key, config, fallbackText ≤1,000) · quiz (lesson mode or explicit question ids) · divider. | P0 | PRD FR-06 | U |
| TR-CNT-011 | The lesson title is the only h1. Authored headings are h2 or h3. The validator SHOULD warn on skipped levels. | P0 | PRD 11 | A |

### 4.3 Interactive Registry and components (PRD FR-07)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-INT-001 | A registry entry MUST define: `key`, `title`, `category` (A formula, B custom simulation, C explorer), `configSchema` (Zod), `defaultConfig`, a lazy `component`, a pure `describe(config, state)` that returns plain-language text, `minHeight`, and `supportsFullscreen`. | P0 | TAD 10; PRD FR-07.1 | U, R |
| TR-INT-002 | Keys: `formula-sandbox`, `projectile-simulator`, `trigonometry-visualizer`, `cell-explorer` (P0); `atom-explorer`, `history-timeline` (P1). A published key MUST NOT be renamed without a data migration. | P0 | RC-02 | R |
| TR-INT-003 | The CMS stores only a key and a config object, never executable code. Config is validated against the entry's `configSchema` on write and again on publish. An invalid config blocks publishing with code INTERACTIVE\_CONFIG\_INVALID. | P0 | TAD 10; PRD FR-16 | U, I |
| TR-INT-004 | The admin selector and the Properties Inspector form MUST be generated from registry metadata and schema. Adding a component MUST NOT need admin-UI changes. A test fixture component proves this. | P0 | PRD FR-16 | U, E |
| TR-INT-005 | An unknown key renders “Simulasi ini sedang tidak tersedia.” plus the block's `fallbackText`, without crashing and without executing anything. | P0 | TAD 10 | U, E |
| TR-INT-006 | Educational text (organelle descriptions, element data, timeline events, explanations) MUST come from config or database content, not component source. Components may hold geometry, art and math only. | P0 | TAD 48 R14 | R |
| TR-INT-007 | Calculations MUST live in pure functions (`calc.ts`) with no React or DOM imports, unit-tested independently of the UI. | P0 | TAD 42 | U |
| TR-INT-008 | Common behaviour: reset control; labelled inputs; results announced through a throttled `aria-live=polite` region; sliders are native range inputs or follow the ARIA slider pattern with arrow-key support; touch targets are at least 44 by 44 CSS px; `prefers-reduced-motion` replaces animation with a static end state or step control. | P0 | PRD FR-07.9; TAD 35 | A |
| TR-INT-009 | Fullscreen mode MUST use the Fullscreen API where available and a CSS full-viewport modal as fallback, because iPhone Safari does not support the API on arbitrary elements. Focus is trapped while open and restored on close. | P0 | PRD FR-05 | E, A |
| TR-INT-010 | Performance *(proposed)*: each lazy chunk ≤ 100 KB gzip; animation uses `requestAnimationFrame`; updates from slider drags are coalesced per frame; animation pauses when offscreen or the tab is hidden; target 60 fps on desktop and at least 30 fps on mid-range mobile. | P0 | TAD 29 | P |
| TR-INT-011 | Displayed numbers MUST use `Intl.NumberFormat` with locale `id-ID` (decimal comma) and configured decimals (default 2). NaN or Infinity MUST never reach the screen; show a dash and an explanation instead. | P0 | PRD 11 | U |
| TR-INT-012 | Components emit `interactive_used` per TR-ANA-004 and are wrapped in an error boundary that renders `fallbackText` on failure. | P0 | PRD FR-17 | U, E |

#### Formula Sandbox (Type A, P0, PRD FR-07.2)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-FSB-001 | Config fields: `variables[]` (key, label, unit, min, max, step, default), `outputs[]` (key, label, expression, unit, decimals), `angleUnit` (deg or rad, default rad), `visualization` (type, x, y, samples), optional `latex`, `assumptions`, `explanation`, and required `fallbackText`. Variable keys match `^[a-zA-Z_][a-zA-Z0-9_]*$` and are unique. Min < max, step > 0, default within range. | P0 | PRD FR-07.2 | U |
| TR-FSB-002 | Expression language: decimal and scientific number literals; identifiers that are declared variable keys, earlier output keys, or constants `pi` and `e`; operators `+ - * / ^` and unary minus; parentheses; whitelisted functions `sin cos tan asin acos atan sqrt abs exp ln log10 min max pow floor ceil round`. `^` is right-associative and binds tighter than unary minus, so `-2^2` is -4 and `2^3^2` is 512. Everything else is a syntax error: member access, indexing, strings, assignment, semicolons, `**`. | P0 | PRD FR-07.2 | U |
| TR-FSB-003 | The evaluator MUST be a purpose-built tokenizer, Pratt or recursive-descent parser and tree-walking interpreter. It MUST NOT use `eval`, `Function`, dynamic import, or lookups on plain objects with author-controlled keys (use `Map` or null-prototype objects). General-purpose expression libraries are not used unless a security review is recorded in an ADR. | P0 | TAD 48 R7; PRD NFR-02 | S, R |
| TR-FSB-004 | Limits *(proposed)*: expression ≤ 300 chars; AST ≤ 200 nodes; depth ≤ 32; ≤ 1,000 node visits per evaluation. Any non-finite result is a typed error, never a thrown crash. | P0 | PRD NFR-02 | U |
| TR-FSB-005 | Outputs may reference variables and earlier outputs only. Cycles and forward references are rejected at validation. | P0 | PRD FR-07.2 | U |
| TR-FSB-006 | Visualizations: P0 `line`, `bar`, `readout`; P1 `scatter`. A `line` sweeps variable `x` from min to max with `samples` points (default 200, max 500). A domain error at a sample leaves a gap in the series, not an exception. If every sample fails, show an explanatory message. | P0 | PRD FR-07.3 | U, E |
| TR-FSB-007 | Publish validation MUST parse every expression, check identifiers, and evaluate at the defaults, which MUST be finite. It SHOULD also evaluate at range corners (at most 4 variables) and return a warning, not an error, for non-finite corners. | P0 | PRD FR-16 | U, I |
| TR-FSB-008 | The same evaluator code runs on client and server and is deterministic. Rounding happens only at display time. | P0 | TR-ARC-007 | U |
| TR-FSB-009 | Charts MUST be accessible SVG with title and description, labelled axes with units, `id-ID` tick formatting, and a “Lihat data” toggle that shows the plotted values as a table. Colour MUST NOT be the only encoding. The chart library or custom SVG choice is an ADR (TD-02) and MUST meet TR-INT-010. | P0 | PRD 11 | A, P |
| TR-FSB-010 | If `latex` is shown next to the expression, the plain `expression` remains the computational truth. The editor SHOULD display both so authors can spot mismatches. | P0 | PRD FR-07.2 | R |

Required parser test vectors (all MUST pass): `2+3*4` → 14; `-2^2` → -4; `2^3^2` → 512; `sqrt(16)` → 4; `sin(30)` with deg → 0.5; `1/0` → DIVISION\_BY\_ZERO. These MUST be rejected: `a.b`, `constructor`, `__proto__`, `process`, `x[0]`, `eval(1)`, a string literal, `1;2`, `2**3`, an expression longer than 300 chars, and nesting deeper than 32.

#### Projectile Simulator (Type B, P0, TAD §11)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-PRJ-001 | Inputs and default ranges *(proposed, config-overridable)*: velocity 1–100 m/s, step 1, default 20; angle 0–90 degrees, step 1, default 45; gravity 1–25 m/s², step 0.1, default 9.8. | P0 | TAD 11 | U |
| TR-PRJ-002 | Formulas (ideal, no air resistance, level ground): range R = v² sin(2θ) / g; maximum height H = v² sin²(θ) / (2g); flight time T = 2 v sin(θ) / g; trajectory y = x tanθ − g x² / (2 v² cos²θ). The UI MUST state these assumptions. | P0 | PRD FR-07.4 | U |
| TR-PRJ-003 | Test vectors, relative tolerance 1e-9: v=20, θ=45, g=9.8 → R 40.8163, H 10.2041, T 2.8861. v=20, θ=30, g=9.8 → R 35.3480, H 5.1020, T 2.0408. At θ=0 all outputs are 0 with a “tidak ada waktu terbang” note. At θ=90 R is 0 (clamp values below 1e-9 to 0). | P0 | TAD 42 | U |
| TR-PRJ-004 | The trajectory is sampled at 100 points over \[0, T\]. A text readout of R, H and T is always visible as the fallback. Reset restores defaults. | P0 | TAD 11 | E, A |

#### Trigonometry Visualizer (Type B, P0)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-TRG-001 | Angle input 0–360 degrees. sin, cos and tan are shown to 4 decimals, and negative zero is normalized to 0. Multiples of 90 degrees use exact values instead of floating-point trig. | P0 | TAD 11 | U |
| TR-TRG-002 | tan is “tidak terdefinisi” when the angle is a multiple of 90 degrees at which cos is 0 (cos magnitude below 1e-9). No Infinity or NaN is displayed. | P0 | TAD 11 | U |
| TR-TRG-003 | Test vectors: 30° → 0.5000, 0.8660, 0.5774; 45° → 0.7071, 0.7071, 1.0000; 90° → 1, 0, undefined; 180° → 0, -1, 0; 270° → -1, 0, undefined. | P0 | TAD 42 | U |
| TR-TRG-004 | The unit circle is always drawn. The right triangle is drawn for 0 < angle < 90 and as a reference triangle otherwise. An age-appropriate explanation is shown from config. | P0 | PRD FR-07.5 | E |

#### Cell Explorer (Type C, P0)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-CEL-001 | Organelle data (nucleus, mitochondria, ribosome, cell membrane, cytoplasm, Golgi apparatus) with name, function and explanation lives in config. Seed provides the default dataset. | P0 | PRD FR-07.5; TAD 11 | U |
| TR-CEL-002 | The diagram is an inline SVG with one focusable region per organelle (keyboard and touch). A plain list of organelles offers the same selection for accessibility and small screens. The selected state is announced. | P0 | PRD FR-07.9 | A, E |

#### P1 components (PRD FR-07.6 to FR-07.8)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-P1C-001 | Atom Explorer is data-driven for H, He, C, O and Na. Neutrons are mass number minus atomic number, electrons equal protons for a neutral atom, and the UI states the view is simplified. | P1 | TAD 11 | U |
| TR-P1C-002 | History Timeline events (Budi Utomo 1908, Sumpah Pemuda 1928, Proklamasi Kemerdekaan 1945) are sorted by year, keyboard navigable, and fact-checked by a named reviewer. | P1 | TAD 11 | E |
| TR-P1C-003 | The Experiments gallery lists components from publicly visible lessons through the same registry. Each has a shareable URL with a link back to its lesson. | P1 | PRD FR-07.8 | E |

### 4.4 Quiz, practice and evaluation (PRD FR-08, FR-20)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-QZ-001 | Question rules: type multiple choice with exactly one correct option; 2 to 6 options with unique ids; question ≤ 1,000 chars; option ≤ 500 chars; non-empty explanation (≤ 1,500) required for any question linked to a published lesson. | P0 | PRD FR-08; TAD 25 | U |
| TR-QZ-002 | Public question DTOs MUST whitelist fields: `id`, `question`, `options[id,text]`, `difficulty`. A mapper MUST build them field by field, never by spreading database rows. A test scans every public quiz response for `correctAnswer`, `explanation` and `isCorrect` before an answer is submitted. | P0 | TAD 12; PRD FR-08 | I, S |
| TR-QZ-003 | Attempt lifecycle, all public endpoints. (1) `POST /api/quiz/attempts` takes a lessonId and returns an `attemptId` (UUID), ordered question DTOs (at most 30) and a signed `attemptToken`. (2) `POST /api/quiz/attempts/:attemptId/answers` takes token, questionId and optionId and returns correctness, the correct option id, the explanation and a new token. (3) `POST /api/quiz/attempts/:attemptId/complete` takes the token and returns the result and review. | P0 | PRD FR-08; RC-08 | I, E |
| TR-QZ-004 | The token is HMAC-SHA256 (or JWT HS256) over: version, attemptId, lessonId, questionIds, answers so far, issued-at, expiry (2 hours *(proposed)*), and userId or null. The secret is `QUIZ_TOKEN_SECRET` (at least 32 random bytes) with a key id for rotation. Comparison is constant-time. | P0 | RC-08 | U, S |
| TR-QZ-005 | The server re-verifies every recorded answer against the database on completion and computes the score itself. The client never sends a score. Score is `round(correct / total * 100)`. | P0 | TAD 12, 48 R5 | U, I |
| TR-QZ-006 | Idempotency: repeating the same answer returns the same result; a different option for an answered question returns 409 QUIZ\_ALREADY\_ANSWERED; repeating complete returns the same result and, for logged-in users, creates no second row (unique `attemptId`). Completion is allowed only when every question is answered. | P0 | PRD FR-08 | I |
| TR-QZ-007 | Persistence: for an authenticated user, completion writes `QuizAttempt` and `QuizAttemptAnswer` in one transaction. Guests persist nothing on the server. Guest results stay local and display-only, and are never merged into an account. | P0 | PRD FR-11 | I |
| TR-QZ-008 | The completion response includes a per-question review (selected option, correct option, explanation) and a de-duplicated list of lessons to revisit, derived from missed questions. Copy bands for encouragement and supportive wrong-answer text come from the message catalog. | P0 | PRD FR-08 | I, E |
| TR-QZ-009 | A lesson with no published questions MUST hide the quiz call to action. Questions of draft or archived lessons are never served. | P0 | PRD FR-05 | I |
| TR-QZ-010 | Accepted limitation: with stateless tokens a user can replay an older token to retry a question. This is acceptable for low-stakes practice and MUST be reconsidered with server-held attempts for Phase 2 class assessments. | P0 | RC-08 | R |
| TR-QZ-011 | Option and question shuffling per attempt (seeded in the token) SHOULD be supported. Default is fixed order. | P1 | PRD FR-08 | U |
| TR-QZ-012 | Practice bank (`GET /api/practice/questions` with subject, topic and difficulty filters) reuses the same attempt mechanism with a bank scope in the token. Logged-in users can reopen results via `GET /api/quiz/attempts/:attemptId` (owner only). | P1 | PRD FR-20 | I |

### 4.5 Progress, favorites and My Learning (PRD FR-11 to FR-13, FR-15)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-PRG-001 | Server contract per user and lesson: `progress` integer 0–100, `completed` boolean, `lastPosition` as a block id string (stable under edits). | P0 | TAD 7.8 | U, I |
| TR-PRG-002 | Writes are monotonic, enforced in SQL upsert: `progress = GREATEST(existing, incoming)` and `completed = existing OR incoming`. Progress never decreases and completion never reverts. | P0 | TAD 13, 14 | I |
| TR-PRG-003 | Client sync: debounce 3–5 s, flush on `visibilitychange` and `pagehide` with a keepalive request, at most one write per lesson per 3 s, and completion is written immediately. | P0 | PRD FR-11 | E |
| TR-PRG-004 | Guest storage uses localStorage key `ive_progress` with a versioned shape (`v`, `items` keyed by lessonId with progress, completed, position, updatedAt). Access is wrapped in try/catch for disabled storage or quota errors; corrupt JSON is discarded; size cap 200 KB. | P0 | TAD 13 | U |
| TR-PRG-005 | `POST /api/progress/merge` accepts at most 500 items, validated with Zod. Unknown or non-public lessonIds are dropped and counted. One transaction applies TR-PRG-002 rules. It is idempotent and returns the merged server state. The client clears merged local items on success and keeps them on failure. | P0 | PRD FR-11 | U, I |
| TR-PRG-006 | Merge never touches quiz attempts, and never lowers server progress (property test: merging twice equals merging once; merge never decreases any value). | P0 | PRD FR-11 | U |
| TR-PRG-007 | Lesson pages stay cacheable (TR-CAT-006). User state loads after hydration through `GET /api/progress`, which is `private, no-store`. | P0 | TAD 30 | P, I |
| TR-PRG-008 | Favorites: `POST /api/favorites` is an idempotent upsert; `DELETE /api/favorites/:lessonId` is idempotent (204); at most 500 per user *(proposed)*. Guests see a login prompt, never a silent failure. | P1 | PRD FR-12; RC-17 | I, E |
| TR-PRG-009 | “Lanjutkan belajar” comes from the latest incomplete `UserProgress` (index on userId, updatedAt) or from local data for guests. My Learning is dynamic and private, shows no fabricated statistics, and has explicit empty states. | P1 | PRD FR-13 | E |
| TR-PRG-010 | Recommendations live in their own module with the three deterministic rules of TAD §38, covered by unit tests. | P1 | TAD 38 | U |

### 4.6 AI tutor (PRD FR-09)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-AI-001 | `POST /api/ai/chat` runs on the Node runtime and streams the reply. The request (Zod) carries `lessonId`, `message`, and `history` (≤ 8 messages). The response is a stream with a terminal event and typed error events. | P0 | TAD 17 | I, E |
| TR-AI-002 | The provider sits behind `AIProvider.streamChat` with an OpenAI-compatible implementation configured by `AI_API_KEY`, `AI_MODEL`, `AI_BASE_URL`. These variables are server-only and never use the `NEXT_PUBLIC_` prefix. | P0 | TAD 16 | R, S |
| TR-AI-003 | Limits *(proposed, env-tunable)*: message ≤ 1,000 chars; history ≤ 4,000 chars total; lesson context ≤ 12,000 chars; `AI_MAX_OUTPUT_TOKENS` default 700; temperature default 0.3. Oversize input returns VALIDATION\_ERROR. | P0 | TAD 20 | U |
| TR-AI-004 | The context builder converts a publicly visible lesson into plain text: level, subject, topic, title, description, learning objectives, source titles, then blocks. Truncation priority: objectives, headings and text, formulas, examples, interactive descriptions. Snapshot tests cover it. | P0 | TAD 17; PRD FR-09 | U |
| TR-AI-005 | Grounding: the system prompt tells the model to answer from the lesson and its sources first, to say plainly when a question is outside them, and not to invent facts. The prompt is versioned in code (`PROMPT_VERSION`) and never exposed. | P0 | PRD FR-09 | U, R |
| TR-AI-006 | No quiz leakage: the context builder MUST exclude questions, options, correct answers and explanations. A test seeds a canary string in an answer key and asserts it never reaches the provider input. When an attempt is active the prompt adds an instruction to guide without revealing the answer. | P0 | PRD FR-09 | U, S |
| TR-AI-007 | Injection posture: user text is always a user-role message, never concatenated into the system prompt. Lesson content is passed as delimited data. Phase 1 gives the model no tools, no function calling and no database access. Output is rendered as plain text or safe Markdown, never HTML. | P0 | PRD FR-09; TAD 28 | S |
| TR-AI-008 | State-aware context (stretch): an optional `sandboxState` (blockId and values, ≤ 2 KB) is validated against the registry schema and summarized through the component's `describe()`. | P1 | PRD FR-09 | U |
| TR-AI-009 | `POST /api/ai/feedback` accepts lessonId and an up or down rating, emits `ai_feedback`, and stores no message content. | P1 | PRD FR-17 | I |
| TR-AI-010 | Streaming robustness: abort upstream on client disconnect; first-token timeout 10 s and total 60 s *(proposed)*; one retry only on connection error or 5xx before any chunk is sent; none afterwards. Failures map to AI\_UNAVAILABLE and the copy in the message catalog. | P0 | TAD 19 | I |
| TR-AI-011 | Abuse and cost control: per-user and per-guest limits (§7), HTTP 429 with `Retry-After`, an `AI_ENABLED` kill switch, and an optional daily token budget that degrades to AI\_UNAVAILABLE. Log token counts and latency, never message content. | P0 | TAD 20; PRD risks | I, S |
| TR-AI-012 | Persistence is P1 behind `AI_HISTORY_ENABLED`. `AIConversation` and `AIMessage` follow TAD §7.11 and §7.12, are readable only by their owner, and are deleted with the account. Retention 90 days *(proposed)* **\[CONFIRM, PRD D-13\]**. | P1 | TAD 7.11; RC-09 | I |
| TR-AI-013 | The lesson page MUST keep working when AI fails. The panel shows a retry button. A static FAQ for seeded lessons MAY be added. | P0 | TAD 19 | E |
| TR-AI-014 | The prompt MUST require age-appropriate, educational answers. Use of a provider moderation endpoint is a decision (TD-08). | P0 | PRD FR-09 | R |

### 4.7 Authentication and authorization (PRD FR-10)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-AUTH-001 | Authentication uses Supabase Auth with server-side cookie sessions. Server code MUST verify the session with the auth provider (or verify the JWT signature) instead of trusting unverified cookie contents. | P0 | TAD 21 | I, S |
| TR-AUTH-002 | The role source of truth is the PostgreSQL `User.role`. Code MUST NOT read the role from user-editable auth metadata. Registration cannot set a role. Default is USER. | P0 | TAD 7.1; RC-20 | I, S |
| TR-AUTH-003 | The `User` row is created idempotently on the first authenticated request, keyed by the auth user id, and syncs email, name and avatar. | P0 | TAD 7.1 | I |
| TR-AUTH-004 | Every admin route handler, server action and page loader MUST call `requireAdmin()` or `can()`. Middleware is only a coarse redirect. An authorization matrix test covers every admin endpoint for anonymous (401), USER (403) and ADMIN (2xx). | P0 | TAD 21 | I, S |
| TR-AUTH-005 | Development admin comes from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in seed only. Production admins are promoted by a documented one-off operator script. Boot MUST fail in production if `ADMIN_PASSWORD` is set. | P0 | TAD 41 | R, I |
| TR-AUTH-006 | RLS MUST be enabled on every application table, with no permissive policies for the anon and authenticated roles. Prisma's connection role is the table owner. A test using the public anon key against the auto-generated REST API MUST read nothing from any table. The migration template includes `ENABLE ROW LEVEL SECURITY`. | P0 | RC-20 | S |
| TR-AUTH-007 | The service-role key is server-only, used by seed and server adapters. It never appears in a client bundle or log. | P0 | TAD 40 | S, R |
| TR-AUTH-008 | Sign-in methods and email-verification policy are decided in TD-09. Whatever is chosen, content browsing stays login-free. | P0 | PRD FR-10 | E |

### 4.8 Search (PRD FR-14, P1)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-SRCH-001 | Lesson has a stored `tsvector` (title weight A, keywords B, description plus topic and subject names C) maintained in the database via a raw-SQL migration (Prisma `Unsupported` type), with a GIN index. A `pg_trgm` index on title supports typo tolerance. | P1 | TAD 15 | I |
| TR-SRCH-002 | Text-search configuration is `simple` unless the target PostgreSQL provides `indonesian` and a benchmark shows better results (TD-05). | P1 | TAD 15 | I |
| TR-SRCH-003 | Query rules: `q` 2–100 chars; page size ≤ 20; filters for level, subject, difficulty and `hasInteractive`; public results go through `publicLessonWhere`. Admin search is a separate endpoint and may include drafts. | P1 | PRD FR-14 | I |
| TR-SRCH-004 | The client debounces 300 ms, cancels the previous request, and shows loading and empty states (“Belum menemukan materi yang cocok.”). | P1 | TAD 15, 45 | E |

### 4.9 Admin CMS and source validity (PRD FR-16, FR-19)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-CMS-001 | Lesson state machine, executed in one transaction with an audit entry and cache revalidation: DRAFT → IN\_REVIEW (author); IN\_REVIEW → DRAFT (reviewer, with note); IN\_REVIEW → PUBLISHED (admin, runs the gate); PUBLISHED → DRAFT (unpublish); DRAFT or PUBLISHED → ARCHIVED; ARCHIVED → DRAFT. Reviewer SHOULD differ from author. **\[CONFIRM\]** Interim default for a one-person team: self-review is allowed and recorded as `selfReviewed` in the audit log. | P0 | PRD 7.5; RC-05 | I |
| TR-CMS-002 | Optimistic concurrency: updates require the current `version`. A mismatch returns 409 VERSION\_CONFLICT with the current version, and the UI offers reload. | P0 | RC-15 | I |
| TR-CMS-003 | Editor layout: Block Library (left), Content Canvas (center), Properties Inspector (right), top bar with title, status and Preview & Publish. Save is explicit. The editor warns on unsaved changes. Autosave is P1. | P0 | PRD FR-16 | E |
| TR-CMS-004 | A single function `validateForPublish(lesson)` backs both the dry-run `POST /api/admin/lessons/:id/validate` and the publish transition. It returns issues with `code`, `path`, `message`, `severity`. Errors block with 422 PUBLISH\_BLOCKED and a details array that drives the UI checklist. Error codes: TITLE\_INVALID, SLUG\_INVALID, DESCRIPTION\_MISSING, OBJECTIVES\_MISSING, TAXONOMY\_NOT\_PUBLISHED, SOURCE\_MISSING, SOURCE\_INCOMPLETE, SOURCE\_LICENSE\_UNKNOWN, BLOCK\_SCHEMA\_INVALID, INTERACTIVE\_KEY\_UNKNOWN, INTERACTIVE\_CONFIG\_INVALID, FALLBACK\_TEXT\_MISSING, IMAGE\_ALT\_MISSING, VIDEO\_TITLE\_MISSING, QUESTION\_INVALID, REVIEW\_REQUIRED. Warnings: HEADING\_SKIP, NO\_QUESTIONS, NON\_FINITE\_CORNER. | P0 | PRD FR-16, FR-19 | U, I, E |
| TR-CMS-005 | A source is complete when it has title, creator, type, a license other than UNKNOWN, and a URL or year. At least one complete source is required to publish. Block-level `sourceRefs` MUST point to sources of the same lesson. | P0 | PRD FR-19 | U |
| TR-CMS-006 | Slugs are generated from the title (lowercase, diacritics stripped, hyphens), match `^[a-z0-9]+(-[a-z0-9]+)*$`, are ≤ 80 chars, and reject reserved words (`admin`, `api`, `learn`, `search`, `explore`, `quiz`, `login`). A slug is locked after the first publish **\[CONFIRM\]**; redirects on slug change are P1. | P0 | TAD 27 | U |
| TR-CMS-007 | Preview uses `LessonContentRenderer`, is admin-only, `no-store`, and `noindex`. | P0 | TAD 26 | E, S |
| TR-CMS-008 | Block reorder MUST work with keyboard-accessible up and down controls. Drag and drop MAY be added through an ADR. | P0 | PRD 11 | A |
| TR-CMS-009 | Media upload: `POST /api/admin/uploads/sign` returns a short-lived presigned URL. Allowed types are PNG, JPEG, WebP and AVIF; SVG is rejected. Max 5 MB and 4,000 px *(proposed)*. The server verifies content type and magic bytes, keys are random, and only the key is stored. | P0 | TAD 28, 33 | I, S |
| TR-CMS-010 | Hard delete is allowed only for a DRAFT lesson that was never published and has no dependents. Everything else is archived. Destructive actions need a confirmation dialog. Taxonomy foreign keys use `onDelete: Restrict`. | P0 | TAD 27; PRD FR-16 | I, E |
| TR-CMS-011 | Any update or transition revalidates tags `lesson:<id>`, `topic:<id>`, `catalog` and `nav`. An integration test shows a publish becomes visible publicly on the next request. | P0 | TAD 30 | I |
| TR-CMS-012 | `AuditLog` is append-only and records publish, unpublish, archive, delete, source changes and role changes, with actor and a change summary (no full content bodies). | P0 | PRD FR-19 | I |
| TR-CMS-013 | Public and admin reads use separate repository functions, with no boolean flag that could be forgotten. Tests prove drafts never leak into public API, sitemap, search or AI context. | P0 | TAD 7.5 | I, S |
| TR-CMS-014 | The CMS covers subject, topic and ordering CRUD (with archive), the question editor with TR-QZ-001 validation and lesson linking, and a dashboard whose counts come from one aggregate query (TAD §25). | P0 | TAD 25 | I, E |

### 4.10 Analytics (PRD FR-17, metrics in §3.6)

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-ANA-001 | `analytics.track()` goes through an adapter. P0 sink is the `AnalyticsEvent` table. A vendor sink such as PostHog is optional. Analytics failures MUST NOT affect the user experience. | P0 | TAD 44 | U |
| TR-ANA-002 | P0 events: `lesson_viewed`, `lesson_completed`, `interactive_used`, `interactive_error`, `quiz_started`, `quiz_completed`, `ai_question_asked`. P1: `lesson_started`, `ai_opened`, `search_performed`, `source_viewed`, `ai_feedback`. This refines RC-04: `quiz_started` and `interactive_error` are P0 because the quiz-completion and component-reliability metrics cannot be computed without them. | P0 | PRD 3.6 | U |
| TR-ANA-003 | `POST /api/analytics/events` accepts a batch of at most 20 events and 16 KB, validates each event name and properties with Zod, rejects unknown events, is rate-limited, and returns 202. | P0 | PRD FR-17 | I |
| TR-ANA-004 | `interactive_used` fires once per interactive block instance per page view, after the first parameter change or selection (500 ms debounce). An `interactions` count is sent best-effort on `pagehide`. Slider ticks never produce individual events. | P0 | PRD FR-17 | U, E |
| TR-ANA-005 | Identity: `userId` when logged in, otherwise a random `anonymousId` kept in localStorage (`ive_aid`) so 7-day retention can be measured. No IP, email, name or AI message content is stored. Collection follows the privacy review outcome **\[CONFIRM, PRD D-13\]**. | P0 | PRD NFR-06 | R |
| TR-ANA-006 | Metric derivations are documented as queries. Interaction rate = sessions with `interactive_used` divided by sessions that viewed a lesson with `hasInteractive`. Quiz completion = `quiz_completed` over `quiz_started`. Component reliability = 1 minus `interactive_error` over interactive loads. 7-day retention = ids returning in days 1–7 after first seen. AI helpfulness = up-ratings over all ratings. | P0 | PRD 3.6 | I |
| TR-ANA-007 | Events are batched and sent with `sendBeacon` or keepalive fetch. Retention of raw events is 12 months *(proposed)* with a purge script **\[CONFIRM\]**. | P0 | PRD NFR-06 | R |

## 5. Data Requirements

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-DAT-001 | The initial migration contains the TAD §7 schema plus the delta below. Subject and Topic use `ContentStatus`; Lesson uses `LessonStatus`. `UserProgress.lastPosition` becomes a nullable string (block id). | P0 | TAD 7; RC-05..07 | I |
| TR-DAT-002 | Migrations are applied with `prisma migrate deploy` in CI and production. `db push` is for local experiments only. Destructive changes use expand then contract. Every migration SQL is reviewed and includes RLS statements for new tables (TR-AUTH-006). | P0 | TAD 41 | R |
| TR-DAT-003 | Seed is idempotent (upsert by deterministic slug or id) and contains all four levels, the five subjects, at least 15 Umum lessons (PRD §10.1) each with sources and at least 3 questions where relevant, and no lorem ipsum. **Every seeded lesson MUST pass `validateForPublish`**, enforced by a test. | P0 | TAD 39; PRD 10.1 | I |
| TR-DAT-004 | Required constraints: User.email unique; EducationLevel.slug unique; the three scoped slug uniques (TR-CAT-001); Favorite (userId, lessonId) unique; UserProgress (userId, lessonId) unique; QuizAttemptAnswer (attemptId, questionId) primary key; AIMessage belongs to an existing conversation. | P0 | TAD 8 | I |
| TR-DAT-005 | Transactions are required for: lesson state transitions, quiz completion, progress merge, and reorder. | P0 | TAD 8 | I |
| TR-DAT-006 | Indexes: those in TAD §7 plus Lesson (status, educationLevelId), QuestionLesson (lessonId, order), UserProgress (userId, updatedAt), AnalyticsEvent (eventName, createdAt) and (lessonId, createdAt), AuditLog (entityType, entityId, createdAt). Hot paths MUST NOT filter on JSON content. | P0 | TAD 29 | I, P |
| TR-DAT-007 | Deleting a user cascades progress, favorites, quiz attempts and AI conversations, and sets `AnalyticsEvent.userId` to null. A documented script or endpoint performs account data deletion (scope in TD-10). | P0 | PRD NFR-06 | I |
| TR-DAT-008 | Managed PostgreSQL MUST have automated backups, and a restore drill MUST succeed in staging before public launch. RPO and RTO targets are TD-11. | P0 | PRD NFR-03 | R |

Schema delta (Prisma). Fields from TAD §7 not shown here are unchanged.

```prisma
enum ContentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum LessonStatus {
  DRAFT
  IN_REVIEW
  PUBLISHED
  ARCHIVED
}

enum SourceType {
  TEXTBOOK
  OFFICIAL_BOOK
  JOURNAL
  OFFICIAL_SITE
  OER
  OTHER
}

enum SourceLicense {
  PUBLIC_DOMAIN
  CC_BY
  CC_BY_SA
  CC_BY_NC
  CC_BY_NC_SA
  PERMISSION_GRANTED
  CITED_ONLY
  UNKNOWN
}

// Subject: add @@unique([educationLevelId, slug]); status ContentStatus
// Topic:   add @@unique([subjectId, slug]);        status ContentStatus

model Lesson {
  // TAD 7.5 fields, plus:
  learningObjectives   String[]
  contentBlocks        Json
  contentSchemaVersion Int            @default(1)
  hasInteractive       Boolean        @default(false)
  status               LessonStatus   @default(DRAFT)
  version              Int            @default(1)
  authorId             String?
  reviewerId           String?
  reviewedAt           DateTime?
  publishedAt          DateTime?
  sources              LessonSource[]
  questions            QuestionLesson[]

  @@unique([topicId, slug])
  @@index([status, educationLevelId])
}

model LessonSource {
  id         String        @id @default(cuid())
  lessonId   String
  title      String
  creator    String?
  type       SourceType
  url        String?
  year       Int?
  accessedAt DateTime?     @db.Date
  license    SourceLicense @default(UNKNOWN)
  usageNote  String?
  order      Int           @default(0)
  lesson     Lesson        @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@index([lessonId, order])
}

model Question {
  id            String           @id @default(cuid())
  subjectId     String
  topicId       String?
  question      String
  options       Json
  correctAnswer String
  explanation   String
  difficulty    Difficulty?
  status        ContentStatus    @default(DRAFT)
  lessons       QuestionLesson[]
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  @@index([subjectId, topicId, status])
}

model QuestionLesson {
  questionId String
  lessonId   String
  order      Int
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  lesson     Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@id([questionId, lessonId])
  @@index([lessonId, order])
}

model QuizAttempt {
  id             String              @id
  userId         String
  lessonId       String?
  score          Int
  totalQuestions Int
  correctAnswers Int
  startedAt      DateTime
  completedAt    DateTime            @default(now())
  answers        QuizAttemptAnswer[]

  @@index([userId, completedAt])
  @@index([lessonId])
}

model QuizAttemptAnswer {
  attemptId        String
  questionId       String
  selectedOptionId String
  isCorrect        Boolean
  attempt          QuizAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)

  @@id([attemptId, questionId])
}

model AuditLog {
  id         String   @id @default(cuid())
  actorId    String
  action     String
  entityType String
  entityId   String
  summary    Json?
  createdAt  DateTime @default(now())

  @@index([entityType, entityId, createdAt])
}

model AnalyticsEvent {
  id          String   @id @default(cuid())
  userId      String?
  anonymousId String?
  eventName   String
  lessonId    String?
  properties  Json?
  createdAt   DateTime @default(now())

  @@index([eventName, createdAt])
  @@index([lessonId, createdAt])
}
```

The search vector and trigram index (TR-SRCH-001) and the RLS statements are added in raw-SQL migrations.

## 6. API Requirements

### 6.1 Conventions

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-API-001 | Success is `{ data, meta }`. Errors are `{ error: { code, message } }` with an Indonesian message (TAD §23). Responses carry an `x-request-id` that also appears in logs. | P0 | TAD 23 | I |
| TR-API-002 | Handlers stay thin: validate, authorize, call service, map response. Zod validates params, query, body and any header used. | P0 | TAD 22, 24 | R, I |
| TR-API-003 | Public content responses send `Cache-Control` with `s-maxage` and `stale-while-revalidate` and are invalidated by tags (TR-CMS-011). Admin and user-specific responses send `private, no-store`. | P0 | TAD 30 | I, P |
| TR-API-004 | Lists use `meta: { page, pageSize, total }` with pageSize capped at 50 (search 20). | P0 | TAD 22 | I |
| TR-API-005 | Mutations MUST be idempotent where TR-QZ-006, TR-PRG-002, TR-PRG-008 say so. | P0 | PRD FR-08, FR-11 | I |
| TR-API-006 | No URL version prefix in Phase 1 because the API is first-party. Revisit when a mobile client is planned. | P0 | PRD backlog | R |

### 6.2 Endpoints (replaces TAD §22 where different)

| Method and path | Access | Pri | Notes |
| --- | --- | --- | --- |
| GET `/api/levels` | Public | P0 | Includes derived `active` flag |
| GET `/api/navigation?level=` | Public | P0 | Subjects and topics with counts (TR-CAT-005) |
| GET `/api/levels/:level/subjects` and `/:subject` | Public | P0 | Replaces `/api/subjects` and `/api/subjects/:slug` (RC-13) |
| GET `/api/levels/:level/subjects/:subject/topics/:topic` | Public | P0 | Replaces `/api/topics/:slug` |
| GET `.../topics/:topic/lessons/:lesson` | Public | P0 | Replaces `/api/lessons/:slug`; published only |
| POST `/api/quiz/attempts`, `/:id/answers`, `/:id/complete` | Public (user-aware) | P0 | Replaces `/api/quiz/submit` and `/api/lessons/:slug/questions` (TR-QZ-003) |
| GET `/api/quiz/attempts/:id` | Owner | P1 | Result reopen |
| GET `/api/practice/questions` | Public | P1 | Bank (TR-QZ-012) |
| GET `/api/search` | Public | P1 | TR-SRCH |
| POST `/api/ai/chat` | Public with quota | P0 | Streaming |
| POST `/api/ai/feedback` | Public with quota | P1 | No content stored |
| POST `/api/analytics/events` | Public | P0 | Returns 202 |
| GET and POST `/api/progress`, POST `/api/progress/merge` | Authenticated | P0 |  |
| POST `/api/favorites`, DELETE `/api/favorites/:lessonId` | Authenticated | P1 |  |
| POST, PUT, DELETE `/api/admin/{subjects,topics,lessons,questions}[/:id]` | Admin | P0 | Lesson PUT carries `version` and the sources array |
| POST `/api/admin/lessons/:id/transition` | Admin | P0 | Body: target status, optional note |
| POST `/api/admin/lessons/:id/validate` | Admin | P0 | Dry-run publish gate |
| POST `/api/admin/interactive/validate` | Admin | P0 | Validates a component config |
| POST `/api/admin/uploads/sign` | Admin | P0 | TR-CMS-009 |
| GET `/api/admin/search` | Admin | P1 | Includes drafts |
| GET `/api/health`, `/api/health/ready` | Public | P0 | Liveness and readiness (DB check); no internal detail in the body |

### 6.3 Error catalog

| Code | HTTP | Meaning |
| --- | --- | --- |
| VALIDATION\_ERROR | 400 | Body, query or params failed validation |
| UNAUTHENTICATED | 401 | Login required or session invalid |
| FORBIDDEN | 403 | Authenticated but not allowed |
| NOT\_FOUND | 404 | Missing or not public |
| VERSION\_CONFLICT | 409 | Stale `version` on a lesson update |
| QUIZ\_ALREADY\_ANSWERED | 409 | Different option for an answered question |
| QUIZ\_ATTEMPT\_INVALID | 400 | Token invalid, expired or mismatched |
| PAYLOAD\_TOO\_LARGE | 413 | Above content or upload limits |
| PUBLISH\_BLOCKED | 422 | Publish gate has errors; details list issues |
| RATE\_LIMITED | 429 | Includes `Retry-After` |
| AI\_UNAVAILABLE | 503 | Provider down, disabled or over budget |
| INTERNAL\_ERROR | 500 | Unexpected; request id returned |

## 7. Security Requirements

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-SEC-001 | Authorization is default-deny, evaluated on the server for every protected operation, and covered by the matrix test in TR-AUTH-004. | P0 | TAD 21, 28 | I, S |
| TR-SEC-002 | Answer keys, explanations before answering, drafts, internal prompts, API keys and database errors MUST never appear in any response (tests TR-QZ-002, TR-CMS-013, TR-AI-006). | P0 | TAD 28 | S |
| TR-SEC-003 | Secrets exist only in environment configuration. `.env*` files are git-ignored and `.env.example` holds no real values. CI runs a secret scan. | P0 | TAD 40 | R |
| TR-SEC-004 | Rate limits *(proposed, env-tunable)* are in the table below. Limiter keys use a salted hash of the IP (`RATE_LIMIT_SALT`), never the raw address. | P0 | TAD 20 | I |
| TR-SEC-005 | Production without Redis uses a documented per-instance in-memory limiter and logs a startup warning. This is a degraded mode, not the target. | P0 | TAD 31 | I |
| TR-SEC-006 | Mutating route handlers that rely on cookie sessions MUST verify the `Origin` header against the app origin and reject mismatches with 403. Server Actions keep the framework's origin check. | P0 | RC-21 | I, S |
| TR-SEC-007 | A Content Security Policy is sent: nonce-based `script-src` without `unsafe-eval` in production; `frame-src` limited to youtube-nocookie; `img-src` limited to self, the storage CDN and data URIs; `connect-src` limited to self, Supabase and the error-monitoring host; `object-src` none; `base-uri` self; `frame-ancestors` none. Start in report-only, then enforce. | P0 | RC-21 | S |
| TR-SEC-008 | Also send HSTS, `X-Content-Type-Options: nosniff`, a strict-origin-when-cross-origin referrer policy, and a minimal Permissions-Policy. Admin routes send `X-Robots-Tag: noindex`. | P0 | TAD 34; RC-21 | S |
| TR-SEC-009 | `dangerouslySetInnerHTML` is banned by lint except in the KaTeX wrapper and JSON-LD output with `<` escaped. | P0 | TAD 9 | R |
| TR-SEC-010 | The server MUST NOT fetch URLs supplied by authors or users. YouTube thumbnails are built from a validated id against a fixed host. | P0 | TR-CNT-006 | R |
| TR-SEC-011 | CI runs a dependency audit that fails on high or critical findings, and keeps the lockfile authoritative. | P0 | TR-ARC-011 | R |
| TR-SEC-012 | Logs MUST NOT contain passwords, tokens, API keys, AI message content or quiz answers. Client and server error reporting scrub personal data. | P0 | TAD 43 | R, S |

| Endpoint group | Authenticated | Guest (per hashed IP) |
| --- | --- | --- |
| AI chat | 30 per hour | 10 per hour plus daily cap |
| Quiz attempts and answers | 300 per 10 min | 300 per 10 min |
| Search | 60 per minute | 60 per minute |
| Analytics ingest | 120 per minute | 120 per minute |
| Progress writes | 120 per minute | not applicable |
| Admin mutations | 120 per minute | not applicable |

Threat summary:

| Threat | Primary controls |
| --- | --- |
| Scraping answer keys | TR-QZ-002, TR-QZ-004, TR-SEC-004 (residual risk accepted, TR-QZ-010) |
| Draft or archived content leaks | TR-CAT-002, TR-CMS-013 |
| Privilege escalation to admin | TR-AUTH-002, TR-AUTH-004, TR-AUTH-006 |
| Code or script injection through formulas | TR-FSB-002 to TR-FSB-004 |
| Stored XSS through content | TR-CNT-004, TR-SEC-007, TR-SEC-009 |
| Prompt injection and cost abuse | TR-AI-006, TR-AI-007, TR-AI-011 |
| Direct database access via the auto-generated API | TR-AUTH-006 |
| Over-collection of data about minors | TR-ANA-005, TR-DAT-007, PRD NFR-06 |

## 8. Performance and Reliability

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-PERF-001 | Core Web Vitals at p75 on mobile for catalog and lesson pages *(targets)*: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Measured with Lighthouse CI on an emulated mid-range Android profile and slow 4G. | P0 | PRD NFR-01 | P |
| TR-PERF-002 | Initial JavaScript for the lesson page ≤ 170 KB gzip excluding lazy interactive chunks *(proposed)*. CI fails the build when the budget is exceeded. | P0 | TAD 29 | P, R |
| TR-PERF-003 | Server time p95 *(proposed)*: cached public reads ≤ 300 ms; quiz answer ≤ 300 ms; AI first token p75 ≤ 3 s (provider dependent, reported not gated). | P0 | TAD 29 | P |
| TR-PERF-004 | A lesson page render issues at most 5 database queries with no N+1. A test counts queries for the seeded Gerak Parabola lesson. | P0 | TAD 29 | I |
| TR-PERF-005 | Use the pooled connection string for runtime and `DIRECT_URL` for migrations. Fonts use `next/font` with swap. Images use the framework optimizer with explicit sizes. | P0 | TAD 40 | R |
| TR-PERF-006 | Load smoke test with k6: 100 concurrent readers on a lesson page, p95 ≤ 800 ms and no errors *(proposed)*, run against staging before launch. | P0 | PRD NFR-01 | P |
| TR-REL-001 | Degradation behaviour: Redis down → in-memory limiter and cache bypass; AI down → TR-AI-013; storage down → images fail to alt text; analytics down → silent; auth provider down → guests unaffected; database down → friendly error page and failing readiness check. | P0 | TAD 19, 31 | I, E |
| TR-REL-002 | Every outbound call (database, AI, storage, auth) has an explicit timeout *(proposed default 10 s, AI per TR-AI-010)*. Retries apply only to idempotent operations. | P0 | PRD NFR-03 | R |
| TR-REL-003 | `/api/health` is liveness only. `/api/health/ready` checks the database. Neither reveals versions or internals. | P0 | §6.2 | I |

## 9. Accessibility, Localization, SEO and Compatibility

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-A11Y-001 | Student-facing pages target WCAG 2.2 AA **\[CONFIRM, TD-12\]**. Playwright runs axe on home, catalog, lesson, quiz and result pages with zero serious or critical violations. | P0 | PRD 11; TAD 35 | A |
| TR-A11Y-002 | Full keyboard operation with visible focus; correct heading order; labelled inputs; 200 percent zoom and 320 px reflow with no horizontal overflow; reduced-motion respected; correct and incorrect answers are not distinguished by colour alone. | P0 | PRD 11 | A, E |
| TR-I18N-001 | All user-facing strings come from `src/messages/id.ts`, including error, empty and AI copy. A lint or grep check blocks hardcoded UI strings. `<html lang=id>`. Dates and numbers use `id-ID`. Keys are structured so another language can be added later. | P0 | RC-11 | R |
| TR-SEO-001 | Metadata for home, level, subject, topic and lesson pages with canonical URL and OpenGraph. Title template \`%s | IVE-APP\`, for example “Gerak Parabola — Fisika Umum | IVE-APP”. Description is the lesson description. | P0 |
| TR-SEO-002 | The sitemap lists only publicly visible lessons of active levels. `robots` disallows `/admin` and `/api`. Coming-soon level pages are `noindex`. A BreadcrumbList JSON-LD block is optional. | P0 | TAD 34; RC-01 | I |
| TR-COMP-001 | Supported browsers *(proposed)*: last two major versions of Chrome, Edge, Firefox and desktop Safari; iOS Safari 16 and later; current Android Chrome. Viewports tested: 390 by 844, 768 by 1024, 1280 by 800. | P0 | PRD 6 | E |

## 10. Operations and Delivery

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-OPS-001 | Environments: local, preview, staging, production. Preview and staging MUST NOT use production databases or keys. App and database run in a region close to Indonesia **\[CONFIRM, TD-01\]**. | P0 | PRD 6 | R |
| TR-OPS-002 | CI stages, all required to pass: lint, typecheck, unit, integration (PostgreSQL service container), build, bundle-size budget, e2e (seeded database), axe, migration dry-run, secret scan, dependency audit, license check. | P0 | TAD 42, 47 | R |
| TR-OPS-003 | Observability: Sentry-compatible monitoring on client and server with source maps and release tags; structured JSON logs with request id, route, error code and latency; personal data scrubbed (TR-SEC-012). | P0 | TAD 43 | R |
| TR-OPS-004 | The README documents: install, configure env, migrate, seed, run, test, and how to promote a production admin. | P0 | TAD 41 | R |
| TR-OPS-005 | Rollback is forward-fix. Schema changes use expand then contract so the previous release keeps working during deploys. | P0 | TAD 29 | R |

Environment variables (extends TAD §40):

| Variable | Visibility | Notes |
| --- | --- | --- |
| `DATABASE_URL`, `DIRECT_URL` | Server secret | Pooled runtime URL and direct migration URL |
| `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_MEDIA_BASE_URL` | Public | Browser-safe only |
| `SUPABASE_SERVICE_ROLE_KEY` | Server secret | Seed and server adapters only |
| `AI_API_KEY`, `AI_MODEL`, `AI_BASE_URL` | Server secret | Required when `AI_ENABLED` is true |
| `AI_ENABLED`, `AI_HISTORY_ENABLED`, `ANALYTICS_ENABLED` | Server flag | Default AI and analytics on, history off |
| `AI_MAX_OUTPUT_TOKENS`, `AI_DAILY_TOKEN_BUDGET` | Server | Optional tuning |
| `QUIZ_TOKEN_SECRET`, `RATE_LIMIT_SALT` | Server secret | At least 32 random bytes each |
| `REDIS_URL` | Server secret | Optional (RC-18) |
| `STORAGE_ENDPOINT`, `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY` | Server secret | Object storage |
| `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` | Server and public | Optional |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Dev only | MUST be unset in production (TR-AUTH-005) |

## 11. Testing Requirements

| ID | Requirement | Pri | Src | Ver |
| --- | --- | --- | --- | --- |
| TR-TST-001 | Unit tests are mandatory for: the formula evaluator (all TR-FSB vectors and rejections), projectile and trigonometry calculations (TR-PRJ-003, TR-TRG-003), quiz token signing, tamper and scoring, progress merge (idempotency and monotonicity as property tests), block schemas, `validateForPublish`, slug utilities, `can()` policy, recommendations, and the AI context builder. Line coverage of these domain modules is at least 80 percent *(proposed)*. | P0 | TAD 42 | U |
| TR-TST-002 | Integration tests run against real PostgreSQL, not mocks. They cover: public visibility rule and draft isolation, quiz lifecycle and idempotency, progress persistence and merge, authorization matrix, publish gate and state machine, optimistic concurrency, cache revalidation after publish, and seed-passes-gate. | P0 | TAD 42 | I |
| TR-TST-003 | Security tests: no answer-key fields in pre-answer responses; AI canary test; draft never in public API, sitemap, search or AI context; RLS denial with the anon key; admin matrix; formula injection corpus; Origin check; no secrets in the client bundle. | P0 | TAD 28 | S |
| TR-TST-004 | E2E flows follow PRD §15 on the Umum path: E2E-01 (Gerak Parabola with AI and quiz), E2E-02 (trigonometry), E2E-03 (Cell Explorer), E2E-04 (CMS create to publish), E2E-05 (guest to account merge), E2E-06 (Formula Sandbox authored then used, including divide by zero), E2E-07 (publish blocked without source). Each runs on the three viewports of TR-COMP-001. | P0 | PRD 15 | E |
| TR-TST-005 | AI tests use a mocked provider and an adapter contract test. Provider outages, timeouts, 429 and stream aborts each have a test. | P0 | TAD 19 | I |
| TR-TST-006 | Accessibility (axe plus a scripted keyboard path through a sandbox), Lighthouse CI budgets (TR-PERF-001, TR-PERF-002) and the k6 smoke test run in CI or a pre-release job. | P0 | §8, §9 | A, P |
| TR-TST-007 | Release gate for Phase 1: every P0 requirement verified; PRD §14.1 checklist complete; no open high or critical vulnerabilities; backup restore drill passed (TR-DAT-008); privacy review done (PRD NFR-06); CSP enforced; seed passes the publish gate; E2E green on all viewports. | P0 | PRD 14.1 | R |

## 12. Traceability Matrix

| PRD requirement | TRD requirements | TAD sections |
| --- | --- | --- |
| FR-01 to FR-04 Catalog | TR-CAT-001 to 004, 007, 008, 011 | 5, 7.2–7.5, 37 |
| FR-05 Lesson page | TR-CAT-006, 009; TR-CNT-008, 009; TR-INT-009 | 9, 26, 29 |
| FR-06 Content blocks | TR-CNT-001 to 011 | 7.6, 9, 24 |
| FR-07 Interactive | TR-INT-*, TR-FSB-*, TR-PRJ-*, TR-TRG-*, TR-CEL-*, TR-P1C-* | 10, 11 |
| FR-08 Quiz and evaluation | TR-QZ-001 to 011 | 7.7, 7.9, 12 |
| FR-09 AI tutor | TR-AI-\* | 16 to 20 |
| FR-10 Auth | TR-AUTH-\* | 21 |
| FR-11 Progress | TR-PRG-001 to 007 | 7.8, 13, 14 |
| FR-12 to FR-15 | TR-PRG-008 to 010; TR-SRCH-\* | 15, 38 |
| FR-16 CMS | TR-CMS-\*, TR-INT-003, TR-INT-004 | 25 to 27 |
| FR-17 Analytics | TR-ANA-\* | 7.13, 44 |
| FR-18 Navigation | TR-CAT-005, 006, 010 | none (gap, RC-16) |
| FR-19 Sources | TR-CMS-004, 005; TR-DAT-001; TR-AI-004 | none (gap, RC-06) |
| FR-20 Practice bank | TR-QZ-012 | 7.7 |
| FR-21 Classes (Phase 2) | TR-FWD-001 to 006 only | none |
| NFR-01 to NFR-06 | TR-PERF-*; TR-SEC-*, TR-FSB-003; TR-REL-*; TR-ARC-*; TR-ARC-002, 011, TR-TST-\*; TR-ANA-005, TR-DAT-007 | 28 to 31, 42, 43 |

## 13. Delivery Sequence

### 13.1 Timeboxed spikes (before the main build)

| Spike | Question answered | Feeds |
| --- | --- | --- |
| S1 | Do the formula evaluator and chart rendering meet the budget on a mid-range Android? | TD-02, TD-04, TR-INT-010 |
| S2 | Does Supabase plus Prisma plus RLS work end to end, including the anon-key denial test? | TR-AUTH-006 |
| S3 | Does AI streaming work on the chosen host within its time limits? | TD-01, TR-AI-010 |
| S4 | Do the quiz token and idempotency behave correctly under repeated and concurrent requests? | TR-QZ-003 to 006 |
| S5 | Can the Properties Inspector be generated from registry schemas? | TD-03, TR-INT-004 |

### 13.2 Order of work (changes against TAD §46)

| Order | Work | Change vs TAD |
| --- | --- | --- |
| 1 | Bootstrap, lint, test setup | Add message catalog and env validation |
| 2 | Database, migration, seed skeleton | Add RLS statements and the schema delta |
| 3 | Auth, roles, `can()` | Role from database only; admin matrix test |
| 4 | Core domain: levels, subjects, topics, lessons, navigation | Scoped slugs; derived active levels |
| 5 | Content engine | Isomorphic block schemas; per-block error boundaries |
| 6 | Formula evaluator and interactive registry | New; before student UI |
| 7 | Student UI for Umum | Navigation tree, sources section, “Segera hadir” |
| 8 | Four P0 interactive components | Atom and Timeline move to P1 |
| 9 | Quiz, practice, evaluation | Attempt lifecycle and token |
| 10 | Progress and merge | Monotonic upsert; no guest favorites |
| 11 | AI | History persistence deferred to P1 |
| 12 | Admin CMS | State machine, publish gate, sources, media, audit log |
| 13 | Minimal analytics wiring | Promoted to P0 |
| 14 | SEO, performance, accessibility, security headers | CSP and Origin checks added |
| 15 | Test hardening and release gate | TR-TST-007 |
| P1 | Search, favorites, My Learning, recommendations, Atom, Timeline, gallery, bank page, AI history | After the release gate or in parallel if capacity allows |

## 14. Open Technical Decisions

| ID | Decision | Options | Recommendation | Needed by |
| --- | --- | --- | --- | --- |
| TD-01 | Hosting, runtime and region | Managed Next.js platform vs container host; region near Indonesia | Choose before S3; verify streaming and function time limits | Before S3 |
| TD-02 | Chart rendering | Custom SVG vs small charting library | Decide from S1 against the bundle budget and accessibility needs | After S1 |
| TD-03 | Inspector generation | Derive from Zod vs hand-written field descriptors | Decide from S5 | After S5 |
| TD-04 | Formula parser | Purpose-built (TR-FSB-003) vs reviewed library | Purpose-built | Before step 6 |
| TD-05 | Search configuration | `simple` vs `indonesian` | `simple` plus trigram unless a benchmark favors `indonesian` | P1 start |
| TD-06 | Redis provider and launch requirement | Required vs optional at launch | Optional, with the documented fallback | Before launch |
| TD-07 | AI provider, model, quotas and guest access | See PRD D-10 | Allow guests with a lower quota | Before step 11 |
| TD-08 | Moderation endpoint for AI input | Use vs rely on prompt rules | Use if the provider offers one at acceptable cost | Before step 11 |
| TD-09 | Sign-in methods and email verification | Email and password, magic link, social | Decide with product | Before step 3 |
| TD-10 | Account data deletion scope | Self-service vs operator script | Operator script for Phase 1 | Before launch |
| TD-11 | RPO, RTO and backup retention | Provider defaults vs stricter | Set after provider choice | Before launch |
| TD-12 | WCAG level and browser floor | AA vs partial; versions | WCAG 2.2 AA; versions in TR-COMP-001 | Before step 7 |
| TD-13 | Error monitoring and analytics sink | Sentry and database vs adding PostHog | Sentry plus database sink | Before step 13 |
| TD-14 | Version pins | Node, Next.js, React, Prisma, Zod | Record current stable versions at bootstrap in the README | Step 1 |
| TD-15 | Slug lock and redirects | Lock after publish vs redirect table | Lock in P0, redirects in P1 | Before step 12 |
| TD-16 | Review policy for a one-person team | Mandatory second reviewer vs recorded self-review | Recorded self-review until a second reviewer exists | Before step 12 |
