# TECHNICAL ARCHITECTURE DOCUMENT (TAD)
## IVE-APP — Phase 1: General-Purpose Interactive Learning + Content CMS

**Document status:** Draft for implementation
**Version:** 2.0 (supersedes 1.0 dated 2026-09-16)
**Date:** 2026-10-19
**Audience:** AI coding agents, full-stack engineers, technical leads
**Source basis:** IVE 5W1H product definition (WHY / WHAT / WHEN / WHERE / HOW) + TAD v1.0

---

## 0. EXECUTIVE DECISION

Build IVE-APP as a **modular monolith** first.

Do NOT start with microservices, Kubernetes, Kafka, or a distributed event architecture.

### Phase 1 stack (unchanged from v1.0)

- Frontend: Next.js + React + TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Animation: Framer Motion
- Backend: Next.js Route Handlers / Server Actions where appropriate
- Database: PostgreSQL
- ORM: Prisma
- Auth: Supabase Auth
- Validation: Zod
- Cache/rate limiting foundation: Redis
- Queue foundation: BullMQ, only where asynchronous work is actually needed
- Object storage: S3-compatible storage / Cloudflare R2 / Supabase Storage
- AI: provider-agnostic OpenAI-compatible server-side adapter
- Vector search: pgvector when RAG is introduced (not required in Phase 1)
- Math rendering: KaTeX
- Testing: Vitest + React Testing Library + Playwright
- Observability: Sentry-compatible error monitoring
- Analytics: PostHog-compatible event analytics, optional in Phase 1

No new infrastructure is introduced by v2.0. Any new package (for example a rich-text editor library or a math-expression parser) MUST be justified in writing per Agent Rules 10–12.

### Core architecture rule

Business logic MUST live in domain/application modules, not inside React components or route handlers.

```text
UI -> Application Service -> Repository -> Prisma -> PostgreSQL
Application Service -> Adapter Interface -> Provider
```

This makes later service extraction possible without rewriting the product.

### What changed from v1.0

| Area | v1.0 | v2.0 (this document) |
|---|---|---|
| Product framing | Four education levels from day one | Phase 1 = general-purpose ("Umum") content only; SD/SMP/SMA kept in schema but inactive |
| Users | USER, ADMIN | Unchanged roles; architecture made ready for a TEACHER role in Phase 2 (not built) |
| Content | Blocks: text, image, video, formula, callout, example | Adds real-world-practice block, illustration metadata, and mandatory source references |
| Source validity | Not modelled | `Source` + `LessonSource`; at least one source required to publish |
| CMS | One block editor | Two explicit tracks: (1) content authoring, (2) interactive composition |
| Interactive | Fixed registry of 5 components | Registry + per-component config schema + admin config form + live preview; optional no-code Formula Sandbox |
| Question bank | Questions belong to a lesson only | Questions belong to a topic (optionally pinned to a lesson); practice and quiz modes |
| Evaluation | Score and result only | Per-question review, difficulty breakdown, rule-based "review these lessons", attempt history |
| Navigation | Basic routes | Explicit hierarchy navigation spec (mega menu, outline tree, breadcrumbs) |
| Experiments | Not modelled | `Lesson.kind = EXPERIMENT` powers a standalone `/lab` for quick simulations |
| Access-code question bank (teacher ↔ student) | Out of scope, not discussed | Explicitly deferred to Phase 2, extension points documented |

---

# 1. PRODUCT DEFINITION (5W1H)

## WHY

- Contribute to the Indonesia Emas 2045 goal by improving the quality of learning.
- Help teaching and learning between students and teachers through interactive visual elements, so learning is more immersive and students understand a topic more deeply.

## WHAT

IVE-APP is an interactive education web application. Its purpose is to give students a more immersive learning experience.

Core features (product level):

1. Subject selection.
2. Interaction with elements inside a subject (sandbox-style): students change values in a formula (for example a physics formula) and immediately see the result visually.
3. A user-friendly navigation system with a clear menu hierarchy, because there will be many subjects.
4. Learning material with a **verifiable source**.
5. Practice questions / question bank. The two-way teacher-student bank via teacher-issued access code is a **Phase 2** capability.

Additional features the architecture adds to support the above:

- Standalone **Lab** for quick simulations (curious users, "just let me try it").
- **Classroom-friendly display** (fullscreen interactive, large readable type) for teachers projecting content.
- Per-lesson **source references** and a visible "Sumber" section.
- Evaluation history and per-question review.

## WHERE

- In the classroom during teaching and learning (teacher projects or students open on their own devices).
- General public access: self-study at home, tutoring centers (bimbel).
- Low-bandwidth and mid-range mobile devices must be treated as first-class targets. Phase 1 therefore enforces lazy loading, small client bundles, and text fallbacks for every interactive component.

## WHEN

Usage moments:

- Whenever someone wants to learn or is simply curious about a topic.
- Whenever someone wants to run a quick experiment/simulation; IVE acts as a first visual reference for the material.

Delivery phases:

| Phase | Definition | Status in this TAD |
|---|---|---|
| **Phase 1** | App + CMS for **general-purpose** material, with its interactive components | **Implement now** |
| Phase 2 | CMS usable by other users (teachers / education staff) so IVE can be a classroom reference | Extension points only |
| Phase 3 | General material for Indonesian compulsory education levels: SD, SMP, SMA, UMUM | Schema-ready, content not built |

## HOW

### How the app works — four core pillars

| # | Pillar | Phase 1 deliverable |
|---|---|---|
| 1 | User chooses a learning material from the web app | Subject → Topic → Lesson catalog, search, favorites, progress |
| 2 | Material is presented as text, illustration, formula (when formula-based), explanation video, real-world practice/implementation example, and interactive components as needed | Content block engine + interactive engine |
| 3 | Practice questions, quizzes, and evaluation of the user's work | Question bank, practice mode, quiz mode, result review, attempt history |
| 4 | "Tanya AI" as learning assistant | Lesson-aware AI tutor with streaming |

### How learning material is provided

Through the **Admin CMS**. Material is curated from sources spread across the internet and from learning books. Every published lesson MUST carry its source references (see Section 13).

### How CMS content is created

Two distinct tracks, both managed from the CMS but authored differently:

1. **Content authoring** — create/update text, images, formulas, videos, and questions through an editor.
2. **Interactive composition** — assemble interactive experiences (for example a projectile-motion simulation or a parameter experiment). Interaction requires **pre-programmed components** or a **purpose-built interaction tool**. Phase 1 supports both: a registry of coded components configured from the CMS, plus an optional config-driven Formula Sandbox.

---

# 2. PHASE 1 SCOPE

## Learning loop

```text
DISCOVER -> LEARN -> INTERACT -> PRACTICE -> ASK AI -> EVALUATE -> CONTINUE
```

## P0 — MUST WORK

### Public

- Homepage with subject catalog for the active level (Umum)
- Subject page, Topic page, Lesson page
- Hierarchy navigation (mega menu, outline tree, breadcrumbs, prev/next)
- Content block renderer (text, illustration, formula, video, real-world example, interactive)
- Source references displayed on each lesson
- Interactive components: Projectile Simulator, Trigonometry Visualizer, Cell Explorer, Atom Explorer, History Timeline
- Lab page listing standalone experiments
- Practice mode and Quiz mode, server-side scoring, evaluation review
- AI Assistant when configured
- Guest local progress and authenticated progress
- Search
- Favorites
- Responsive mobile/tablet/desktop experience

### Admin

- Admin authentication and server-side authorization
- Dashboard
- Subject, Topic, Lesson CRUD
- Question CRUD (question bank)
- Source CRUD and lesson-source linking
- Block editor (content authoring track)
- Interactive component selection + config form + live preview (interaction track)
- Preview using the public renderer
- Draft / publish / unpublish / archive

### Technical

- Prisma schema, migration, seed script, `.env.example`
- Zod validation at all boundaries
- Server-side AI key handling
- Error/loading/empty states
- No production secrets in source control
- Primary end-to-end journeys tested

## P1 — SHOULD HAVE (cut first if time is short)

- Formula Sandbox: config-driven, no-code interactive builder (Section 11.6)
- Shareable interactive state via URL query parameters
- AI context that includes current simulator parameter values
- Analytics events
- Fallback FAQ for AI on seeded lessons

---

# 3. NON-GOALS (PHASE 1)

Do NOT implement in Phase 1:

- **Teacher accounts, teacher CMS access, classrooms, or teacher-issued access codes** (Phase 2)
- **Two-way teacher ↔ student question bank via access code** (Phase 2)
- **Active SD / SMP / SMA content and level-based curriculum mapping** (Phase 3)
- Global leaderboard, XP economy, coins, rewards store, certificates
- Teacher marketplace and advanced teacher tools
- Machine-learning recommendations
- Full video hosting (YouTube embeds only)
- Real-time collaborative classrooms
- Complex analytics warehouse
- Arbitrary code authored in the CMS (HTML/JS injection, user-defined components)
- Microservices, Kubernetes, Kafka, service mesh
- Dedicated vector database unless PostgreSQL/pgvector proves insufficient

Architecture MAY leave extension points for these (Section 34) but they are not implementation requirements.

---

# 4. DOMAIN MODEL AND HIERARCHY

```text
Education Level   (Phase 1: only "umum" active)
-> Subject
-> Topic
-> Lesson          (kind: LESSON | EXPERIMENT)
   -> Content Blocks (JSON)
   -> Sources        (many-to-many)
Topic
-> Questions       (question bank; optionally pinned to a lesson)
```

Key decisions:

1. **Level stays in the model and URL, but only `umum` is active.** Public URLs are `/learn/umum/...`. When Phase 3 activates SD/SMP/SMA, no URL changes are needed.
2. **Question bank belongs to a Topic**, optionally pinned to a Lesson. Practice and quiz sets can be built for a lesson (pinned questions) or for a whole topic (all published questions in the topic).
3. **Experiments are lessons.** A `LESSON` is a full learning unit. An `EXPERIMENT` is a lightweight lesson built mostly around one interactive block, listed in `/lab`. They reuse the same CMS, renderer, sources, search, and progress logic.

---

# 5. HIGH-LEVEL ARCHITECTURE

```text
                         CDN / Edge
                             |
                         Next.js App
                             |
          +------------------+------------------+
          |                  |                  |
       Student UI         Admin UI         API / Actions
          |                  |                  |
          +------------------+------------------+
                             |
                    Application Modules
                             |
   +--------+--------+-------+-------+--------+--------+
   |        |        |       |       |        |        |
Learning Content  Interactive Quiz  Progress   AI    Search
   |        |        |       |       |        |        |
   +--------+--------+-------+-------+--------+--------+
                             |
                    Repository / Adapters
                             |
          +------------------+------------------+
          |                  |                  |
      PostgreSQL           Redis          Object Storage
          |
       pgvector (later)
```

### Important

- The Next.js process stays stateless; never rely on process memory for durable state.
- Durable state → PostgreSQL. Cache/temporary coordination → Redis. Files → object storage.

---

# 6. REPOSITORY STRUCTURE

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                       # homepage = subject catalog (Umum)
│   │   ├── explore/
│   │   ├── lab/                           # standalone experiments
│   │   │   └── [slug]/
│   │   ├── search/
│   │   ├── my-learning/                   # progress, favorites, attempt history
│   │   ├── login/
│   │   └── learn/
│   │       └── [level]/
│   │           └── [subject]/
│   │               └── [topic]/
│   │                   └── [lesson]/
│   │
│   ├── quiz/
│   │   └── [lesson]/                      # practice/quiz runner
│   │
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   ├── subjects/
│   │   ├── topics/
│   │   ├── lessons/
│   │   ├── questions/
│   │   ├── sources/
│   │   └── interactive/                   # interaction track: library + config + preview
│   │
│   └── api/
│       ├── levels/  subjects/  topics/  lessons/
│       ├── quiz/    progress/  favorites/ search/
│       ├── ai/      admin/
│
├── components/
│   ├── ui/                                # foundational primitives (modular-card, section-header, tab-switcher, neo-card)
│   ├── layout/  navigation/  learning/  lesson/  quiz/  ai/  search/
│   └── interactive/
│       ├── registry.ts
│       ├── projectile-simulator/
│       ├── trigonometry-visualizer/
│       ├── cell-explorer/
│       ├── atom-explorer/
│       ├── history-timeline/
│       └── formula-sandbox/               # P1
│
├── data/                                  # typed view datasets (Separation of Concerns, DRY)
│   └── home/                              # active-learning, learning-loop, subject-showcase, hero-lab-tabs
│
├── modules/
│   ├── levels/  subjects/  topics/  lessons/
│   ├── content/        # block schemas, sanitization, publish validation
│   ├── interactive/    # registry metadata, config schemas, expression evaluator (P1)
│   ├── sources/
│   ├── quiz/           # question bank, scoring, evaluation
│   ├── progress/  favorites/  search/  ai/
│   ├── navigation/     # menu tree, outline, breadcrumbs
│   ├── recommendations/  analytics/  authz/
│   │
├── lib/       (db, auth, cache, storage, validation, rate-limit, utils)
├── server/    (auth, services, adapters)
├── prisma/    (schema.prisma, migrations/, seed.ts)
├── styles/    (globals.css)
└── tests/     (unit, integration, e2e)
```

Agents may adjust exact folders, but MUST preserve module boundaries.

---

# 7. DOMAIN MODULES

Pattern, where useful:

```text
modules/<domain>/
├── <domain>.service.ts
├── <domain>.repository.ts
├── <domain>.schema.ts
├── <domain>.types.ts
└── <domain>.mapper.ts
```

Do not force empty files solely to satisfy the pattern.

| Module | Responsibility |
|---|---|
| levels | Level retrieval; only `isActive` levels are public |
| subjects / topics | Listing, lookup, CRUD, ordering |
| lessons | Retrieval, publishing, ordering, metadata, `kind` handling |
| content | Block validation, sanitization, publish-readiness checks |
| interactive | Component metadata, per-component config schemas, safe expression evaluation (P1) |
| sources | Source CRUD, lesson linking, citation formatting |
| quiz | Question bank, set building, check, scoring, evaluation, attempt history |
| progress | Guest/server progress, merge logic, completion |
| favorites | Add/remove favorites |
| search | Lesson/subject/topic search |
| ai | Context building, orchestration, provider adapter |
| navigation | Menu tree, outline tree, breadcrumbs, prev/next |
| recommendations | Deterministic rules only |
| analytics | Event recording abstraction |
| authz | Central permission checks (`can(user, action, resource)`) |

---

# 8. DATABASE DESIGN

PostgreSQL through Prisma.

## 8.1 User

```text
User: id, name, email (unique), avatar, role, createdAt, updatedAt
Role enum: USER | ADMIN        (default USER)
```

- Users MUST NOT select their role at registration.
- Phase 2 will add `TEACHER`. Adding an enum value is a non-breaking migration; do not add it now.

## 8.2 EducationLevel

```text
EducationLevel: id, name, slug (unique), description, isActive, order, createdAt, updatedAt
```

Seed all four, but only `umum` is active in Phase 1:

| slug | isActive |
|---|---|
| umum | true |
| sd | false |
| smp | false |
| sma | false |

Public queries MUST filter `isActive = true`. Inactive levels are not listed, routable, or searchable.

## 8.3 Subject

```text
Subject: id, educationLevelId, name, slug, description, icon, coverImage,
         status, order, createdById, updatedById, createdAt, updatedAt
```

Indexes: educationLevelId, slug, status, educationLevelId + order.
Slug uniqueness is scoped by education level: `unique(educationLevelId, slug)`.

## 8.4 Topic

```text
Topic: id, subjectId, name, slug, description, order, status,
       createdById, updatedById, createdAt, updatedAt
```

Indexes: subjectId, slug, status, subjectId + order. Unique: `(subjectId, slug)`.

## 8.5 Lesson

```text
Lesson: id, educationLevelId, subjectId, topicId, kind, title, slug,
        description, difficulty, estimatedMinutes, thumbnail, keywords,
        contentBlocks (JSON), status, order, publishedAt,
        createdById, updatedById, createdAt, updatedAt

LessonKind:   LESSON | EXPERIMENT
LessonStatus: DRAFT | PUBLISHED | ARCHIVED
Difficulty:   BEGINNER | INTERMEDIATE | ADVANCED
```

Indexes: educationLevelId, subjectId, topicId, status, slug, kind + status, topicId + order, subjectId + status. Unique: `(topicId, slug)`.

Invariants:

- Published lessons MUST reference valid, published/active taxonomy entities.
- Public queries MUST filter `status = PUBLISHED` and an active level.
- `educationLevelId` and `subjectId` are denormalized from the topic for query speed; the service layer keeps them consistent in a transaction.

## 8.6 Content blocks (JSON on Lesson)

Stored as JSON on `Lesson.contentBlocks` for Phase 1. Normalize only if editor complexity or querying requires it.

Supported types:

```text
heading | text | image | video | formula | callout | example |
realworld | interactive | quiz | divider
```

Recommended shapes:

```json
[
  { "id": "b1", "type": "heading", "level": 2, "content": "Apa itu Gerak Parabola?" },
  { "id": "b2", "type": "text", "content": "<sanitized rich text or structured nodes>" },
  { "id": "b3", "type": "formula", "latex": "x = v_0 \\cos(\\theta)\\, t", "display": true, "caption": "Posisi horizontal" },
  { "id": "b4", "type": "image", "src": "storage-key", "alt": "Lintasan bola", "caption": "Lintasan parabola", "credit": "…", "sourceId": null },
  { "id": "b5", "type": "video", "provider": "youtube", "videoId": "XXXXXXXXXXX", "title": "…" },
  { "id": "b6", "type": "example", "title": "Contoh soal", "steps": [ { "text": "…", "latex": "…" } ] },
  { "id": "b7", "type": "realworld", "title": "Dalam kehidupan sehari-hari", "content": "…", "image": null },
  { "id": "b8", "type": "interactive", "component": "projectile-simulator", "config": { "gravity": 9.8 } }
]
```

Rules:

- Unknown block types MUST render a safe fallback, not crash the lesson.
- All admin-authored rich text MUST be sanitized before rendering.
- `video` stores a YouTube video ID and is rendered through a privacy-friendly lazy embed; arbitrary iframe HTML is never stored.
- `image` requires `alt`. Illustrations from external works need `credit` and, where applicable, a `sourceId`.
- Block schemas use a Zod discriminated union on `type`.

## 8.7 Source and LessonSource

```text
Source: id, title, author, publisher, url, type, year, licenseNote,
        createdById, createdAt, updatedAt
SourceType: BOOK | ARTICLE | WEBSITE | JOURNAL | GOVERNMENT | OTHER

LessonSource: lessonId, sourceId, citationNote (e.g. page/chapter), order
Unique: (lessonId, sourceId)
Indexes: lessonId, sourceId
```

A `Source` is reusable across lessons. See Section 13 for validity rules.

## 8.8 Question (question bank)

```text
Question: id, topicId, lessonId (nullable), type, question, options (JSON),
          correctOptionId, explanation, difficulty, order, status,
          createdById, updatedById, createdAt, updatedAt

QuestionType:   MULTIPLE_CHOICE      (only value in Phase 1)
QuestionStatus: DRAFT | PUBLISHED | ARCHIVED
```

`options` JSON:

```json
[ {"id":"A","text":"…"}, {"id":"B","text":"…"}, {"id":"C","text":"…"}, {"id":"D","text":"…"} ]
```

Indexes: topicId, lessonId, topicId + status, lessonId + status.

- Never trust a client-supplied correct answer; the server decides from database truth.
- If `lessonId` is set, the lesson MUST belong to `topicId`.
- Only `PUBLISHED` questions are served to learners.

## 8.9 QuizAttempt and QuizAttemptAnswer

```text
QuizAttempt: id, userId, scopeType, lessonId (nullable), topicId (nullable),
             mode, score, totalQuestions, correctAnswers, durationSeconds, createdAt
ScopeType: LESSON | TOPIC
Mode:      PRACTICE | QUIZ

QuizAttemptAnswer: id, attemptId, questionId, selectedOptionId, isCorrect, createdAt
Unique: (attemptId, questionId)
```

Indexes: `QuizAttempt(userId)`, `(userId, createdAt)`, `(lessonId)`, `(topicId)`; `QuizAttemptAnswer(attemptId)`, `(questionId)`.

Guest attempts are local-only in Phase 1. The server still scores them (stateless) but does not persist them.

## 8.10 UserProgress

```text
UserProgress: id, userId, lessonId, progress (0–100), completed,
              lastPosition, updatedAt, createdAt
Unique: (userId, lessonId)
Indexes: userId, lessonId, userId + updatedAt
```

`lastPosition` is a block index or stable block ID.

## 8.11 Favorite

```text
Favorite: id, userId, lessonId, createdAt
Unique: (userId, lessonId)    Indexes: userId, lessonId
```

## 8.12 AIConversation and AIMessage

```text
AIConversation: id, userId, lessonId, createdAt, updatedAt     Index: (userId, lessonId)
AIMessage: id, conversationId, role (USER | ASSISTANT), content, createdAt
                                                                Index: (conversationId, createdAt)
```

Conversations are persisted for authenticated users only.

## 8.13 AnalyticsEvent (optional but recommended)

```text
AnalyticsEvent: id, userId (nullable), eventName, lessonId (nullable),
                metadata (JSON, nullable), createdAt
```

Events: `lesson_viewed`, `lesson_started`, `lesson_completed`, `interactive_used`, `quiz_started`, `quiz_completed`, `ai_opened`, `ai_question_asked`, `search_performed`.
Do not build a dashboard around this in Phase 1.

---

# 9. DATA INTEGRITY

Database-level uniqueness where possible:

- `EducationLevel.slug`, `User.email`
- `Favorite(userId, lessonId)`, `UserProgress(userId, lessonId)`
- `LessonSource(lessonId, sourceId)`, `QuizAttemptAnswer(attemptId, questionId)`
- Foreign keys for every relation (AIMessage → conversation, Question → topic, etc.)

Use transactions for:

- publishing a lesson (validation + status + `publishedAt` + cache invalidation trigger)
- persisting a quiz attempt together with its answers
- progress merge and local-to-cloud migration
- keeping denormalized lesson taxonomy columns consistent

---

# 10. CONTENT BLOCK ENGINE

One renderer:

```text
LessonContentRenderer({ blocks: ContentBlock[] })
```

Dispatch through a registry:

```text
ContentBlockRenderer
   +-- heading | text | image | video | formula | callout
   +-- example | realworld | interactive | quiz | divider
```

Rules:

- Never use `dangerouslySetInnerHTML` with unsanitized content.
- Interactive blocks MUST be lazy-loaded.
- Formula blocks render with KaTeX; invalid LaTeX renders a readable fallback (raw text), not an error page.
- The same renderer serves public pages and admin preview (Agent Rule 15).

### Recommended lesson template (soft guidance in CMS, not hard validation)

```text
Pengantar → Konsep (teks + ilustrasi [+ rumus]) → Video penjelasan →
Eksplorasi interaktif → Contoh praktik dunia nyata → Latihan → Sumber
```

The CMS may show a non-blocking checklist ("belum ada ilustrasi", "belum ada contoh dunia nyata") but MUST NOT force every lesson to contain every block type. Formula blocks are only expected for formula-based material.

## 10.2 Modular UI Component Primitives & View Data Layer (DRY & SoC)

To eliminate visual inconsistency, bloated markup, and repetitive styling across views, all pages and components MUST adhere to the DRY component hierarchy:

1. **Foundational UI Primitives (`src/components/ui/`):**
   - `ModularCard` (`src/components/ui/modular-card.tsx`): Primary polymorphic card for features, lessons, bento grids, search results, and carousels. Supports semantic slots (`heading`, `subheading`, `text`, `metric`, `badge`, `icon`, `features`, `action`, `href`), strict conditional rendering of HTML tags, layout modes (`vertical` | `horizontal`), and slot overrides (`contentClassName`, `headingClassName`, `textClassName`).
     - *Layout Rule:* In `horizontal` mode, `subheading`, `heading`, and `text` are strictly grouped inside an internal `flex-col` wrapper (`contentClassName`) to prevent column fragmentation.
   - `SectionHeader` (`src/components/ui/section-header.tsx`): Standardized semantic section and page header (`badge`, `heading`, `subheading`, `text`, `action`).
   - `TabSwitcher` (`src/components/ui/tab-switcher.tsx`): Generic, accessible tab selector (`role="tablist"`, `role="tab"`).
   - `NeoCard` (`src/components/ui/neo-card.tsx`) & Design Utilities: `.neo-card`, `.neo-card-lg`, `.neo-card-soft`, `.neo-badge`, `.neo-btn-primary`.
2. **Separation of Concerns (SoC) for View Datasets (`src/data/<domain>/`):**
   - Repetitive display data (comparison points, process steps, subject bento showcases, interactive hero tabs) MUST NOT be inlined in JSX.
   - Extract data to typed structures under `src/data/<domain>/` with a guaranteed unique `id: string` property on every record.
   - Always iterate with `.map((item) => <ModularCard key={item.id} ... />)` using stable IDs as React keys.

---


# 11. INTERACTIVE ENGINE

## 11.1 Principle

The CMS stores a **component key and a validated config**, never executable code.

```json
{ "type": "interactive", "component": "projectile-simulator", "config": { "gravity": 9.8 } }
```

## 11.2 Component definition contract

Every interactive component is registered with metadata:

```typescript
interface InteractiveDefinition<C> {
  key: string                       // e.g. "projectile-simulator"
  title: string
  description: string
  subjectHints: string[]            // for CMS filtering
  configSchema: ZodType<C>          // validates CMS config
  defaultConfig: C
  component: LazyExoticComponent<ComponentType<{ config: C }>>
  textFallback: (config: C) => string   // accessibility + no-JS/low-bandwidth
}
```

Rules:

- The CMS reads `title`, `description`, `configSchema`, and `defaultConfig` to render a **config form** automatically.
- Unknown component key → friendly "unavailable" message; never crash, never execute anything.
- Admin can only select registered components.
- Every component supports **fullscreen** (classroom/projector use) and a **reset** control.
- Every component shows a textual explanation as fallback.

## 11.3 Registry

Supported keys in Phase 1:

```text
projectile-simulator
trigonometry-visualizer
cell-explorer
atom-explorer
history-timeline
formula-sandbox        (P1)
```

## 11.4 Interaction composition flow (CMS interaction track)

```text
Admin picks component → edits config form (validated by configSchema)
→ live preview using the public component → inserts into lesson block list
→ lesson publish validates config again server-side
```

Config validation happens on save AND on publish.

## 11.5 Component requirements

### Projectile Simulator

- Inputs: initial velocity, angle, gravity
- Outputs: trajectory, maximum height, horizontal range, flight time
- Real physics equations. Defaults: 20 m/s, 45°, 9.8 m/s²
- Reset; touch-friendly controls; text values as fallback
- Config may constrain slider ranges and preset scenarios

### Trigonometry Visualizer

- Input: angle. Output: sin, cos, tan
- Visualization: right triangle and/or unit circle
- Avoid division instability near undefined `tan` values; display a clear "tak terdefinisi" state
- Educational explanation shown

### Cell Explorer

- Clickable organelles: nucleus, mitochondria, ribosome, cell membrane, cytoplasm, Golgi apparatus
- Click shows name, function, and a clear explanation for a general audience

### Atom Explorer

- Elements: Hydrogen, Helium, Carbon, Oxygen, Sodium
- Shows atomic number, proton, neutron, and electron counts
- Visualization clearly labelled as simplified

### History Timeline

- Seed events: 1908 Budi Utomo; 1928 Sumpah Pemuda; 1945 Proklamasi Kemerdekaan
- Click shows year, event, description, historical significance
- Present historical information carefully and factually, with sources attached to the lesson

## 11.6 Formula Sandbox (P1 — the "interaction builder" without code)

A generic component that lets an admin define a small experiment purely through config:

```json
{
  "title": "Hukum Ohm",
  "variables": [
    { "name": "V", "label": "Tegangan", "unit": "V", "min": 0, "max": 24, "step": 0.5, "default": 12 },
    { "name": "R", "label": "Hambatan", "unit": "Ω", "min": 1, "max": 100, "step": 1, "default": 10 }
  ],
  "outputs": [
    { "name": "I", "label": "Arus", "unit": "A", "expression": "V / R" }
  ],
  "visualization": { "type": "line", "x": "V", "y": "I", "sweepVariable": "V" }
}
```

Constraints:

- Expressions are evaluated by a **restricted expression evaluator** with an allowlist of operators and math functions. `eval`, `new Function`, and user-supplied JavaScript are forbidden.
- Limits: maximum expression length, maximum variable/output count, maximum sweep points, evaluation guarded against `NaN`/`Infinity`.
- Visualization types in Phase 1: live value readouts and a single line/scatter chart.
- The evaluator may be a small in-house parser or a vetted library; the choice requires a written justification (Rules 11–12).
- Unit tests for the evaluator are mandatory (including injection attempts).

---

# 12. ADMIN CMS

Admin is intentionally simple but covers both authoring tracks.

## 12.1 Dashboard

Cards: total subjects, topics, lessons, experiments, questions, published lessons, draft lessons, **lessons without sources**. Recent lessons and updates.

## 12.2 Track 1 — Content authoring

### Subject
Fields: name, slug, description, education level (defaults to Umum), icon, cover image, order, status. Actions: create, edit, archive.

### Topic
Fields: name, slug, subject, description, order, status.

### Lesson
Fields: kind, title, slug, level/subject/topic, description, difficulty, estimated time, thumbnail, keywords, content blocks, sources, status.

Actions: save draft, preview, publish, unpublish, archive.

### Block editor
- Add, reorder, duplicate, delete blocks.
- Block types per Section 8.6, each with its own form (heading, rich text, image upload with alt/credit, YouTube URL → video ID extraction, LaTeX formula with live KaTeX preview, example steps, real-world practice, interactive picker).
- Autosave draft is allowed; autosave MUST NOT publish.
- Rich-text editing uses a library only after the Rule 12 justification; output is stored as sanitized structured content.

### Question bank editor
- Multiple-choice editor with: at least 2 options, exactly one correct option, explanation strongly recommended (warn if missing), difficulty, topic, optional lesson pin, status.
- Bulk list by topic with filters (status, difficulty, lesson).

### Media
- Images and thumbnails go to object storage via validated upload (type, size, dimensions). Never store binaries in PostgreSQL.
- Video is never hosted; only YouTube references.

## 12.3 Track 2 — Interactive composition

- `/admin/interactive` shows the **Interactive Library**: all registered components with description and live sandbox.
- Selecting a component inside the lesson editor opens the auto-generated config form and live preview (Section 11.4).
- Formula Sandbox (P1) offers a structured form for variables/outputs with immediate preview and expression validation errors.
- No free-form code field exists anywhere in the CMS.

## 12.4 Preview

Admin preview MUST use the same `LessonContentRenderer` as public pages. Preview of unpublished lessons is available only to authorized admins.

## 12.5 Publishing rules

Hard requirements to publish a lesson:

- valid title and slug
- level, subject, topic assigned (and active)
- description
- valid content blocks (Zod)
- no invalid interactive component reference or invalid config
- **at least one linked Source** (Section 13)
- every image block has `alt`

Published content is publicly visible; unpublished is not. Archive is preferred over hard deletion for published educational content.

## 12.6 Authorization model

- Phase 1 role check: `ADMIN` only for all `/admin` and `/api/admin` routes.
- All checks go through `modules/authz` (`can(user, action, resource)`), never ad-hoc `role === "ADMIN"` in handlers. Phase 2 will extend this module (teacher ownership) without touching handlers.
- Content tables record `createdById` / `updatedById` now.

---

# 13. SOURCE VALIDITY

Because "Akses materi mata pelajaran yang valid sumbernya" is a core feature:

- Every published lesson shows a **"Sumber"** section listing its sources (title, author/publisher, year, link when available, citation note).
- A lesson cannot be published without at least one source; factual, historical, and scientific lessons should have two or more (CMS warns).
- Source types: books, articles, websites, journals, government publications.
- Editors **write or adapt** material in their own words. Verbatim copying of copyrighted text is not allowed. `licenseNote` records license/usage terms; images require `credit` and license notes.
- Prefer authoritative sources (textbooks, government/education bodies, peer-reviewed or institution-published material) over anonymous pages.
- The AI assistant is instructed to prefer the lesson's content and, when uncertain, say so (Section 18).

The system verifies **presence and structure** of sources, not their truthfulness. Truthfulness remains an editorial responsibility; the CMS surfaces the missing-source warnings to support it.

---

# 14. STUDENT NAVIGATION AND DISCOVERY

Because the catalog will grow large, navigation must be clear and shallow.

## 14.1 Rules

- Any subject reachable in **≤ 2 clicks** from the homepage; any lesson in **≤ 4 clicks**.
- Hierarchy always visible: breadcrumbs on every learning page.
- Phase 1 has a single active level, so the level picker is **hidden**. `/` shows the Umum subject catalog directly; `/learn` redirects to `/learn/umum`.

## 14.2 Components

| Surface | Behavior |
|---|---|
| Header | Logo, "Mata Pelajaran" mega menu (Subject → Topics), "Lab", search (keyboard shortcut), "Belajarku", login |
| Homepage | Subject grid, "Lanjutkan belajar" (progress), featured experiments, search entry |
| Subject page | Topics with lesson counts and progress |
| Topic page | Ordered lessons, progress bar, start/continue button, practice-the-topic button |
| Lesson page | Collapsible outline tree (subject → topics → lessons) on desktop; heading table of contents; prev/next within topic |
| Mobile | Outline becomes a bottom drawer; mega menu becomes a full-screen menu |
| Lab | Grid of `EXPERIMENT` lessons filterable by subject; each page links to the related full lesson when one exists |

## 14.3 Classroom-friendly display

- Fullscreen mode for interactive blocks.
- Large, high-contrast readable typography; no dependency on hover.
- Deep links to a lesson and to a specific block anchor so a teacher can open it directly.
- P1: shareable parameter presets through query string (validated by the component's `configSchema`).

---

# 15. PRACTICE, QUIZ, AND EVALUATION

## 15.1 Modes

| Mode | Behavior |
|---|---|
| **PRACTICE** (Latihan) | Instant feedback after each answer, explanation shown immediately, unlimited retries, low-pressure |
| **QUIZ** | Answers submitted without per-question feedback; scored and reviewed at the end |

Scope: a **lesson** (its pinned questions) or a **topic** (all published questions in the topic, optionally limited to N random questions).

## 15.2 Flow

```text
GET question set (no answer keys)
        ↓
User answers
        ↓
PRACTICE: POST /api/quiz/check  → feedback for that question
QUIZ:     collect locally
        ↓
POST /api/quiz/submit  → server scores all answers against DB
        ↓
Evaluation result (persisted if authenticated)
```

Server-side scoring is authoritative. `correctOptionId` is never sent before the user answers that question. In PRACTICE mode, `check` reveals the correct answer only for the question just answered.

## 15.3 Evaluation output

- score percentage, correct / incorrect / total, encouraging message
- **per-question review:** question, selected option, correct option, explanation, difficulty
- **difficulty breakdown**
- for TOPIC scope: **per-lesson breakdown** (based on pinned lessons)
- **"Pelajari lagi":** deterministic links to lessons connected to incorrectly answered questions (feeds the recommendations module)
- authenticated users: attempt history in `/my-learning` with ability to reopen a past review

Guests receive the same evaluation screen; the attempt is stored in `localStorage` (`ive_quiz_attempts`) only.

## 15.4 Rules

- Fetch question data without answer keys.
- Questions must be `PUBLISHED` to be served.
- Submit validates `questionId`s against the requested scope; unknown or out-of-scope IDs are rejected.
- Rate-limit `check` and `submit` against scripted answer-key harvesting.

---

# 16. PROGRESS SYSTEM

## Guest — `localStorage`

Keys: `ive_progress`, `ive_favorites`, `ive_quiz_attempts`. Do not store sensitive data.

## Authenticated — PostgreSQL

On login:

```text
local progress → merge → server progress
```

Merge rules:

- preserve higher progress
- once `completed = true`, it stays true
- never replace a more advanced cloud state with lower local progress
- merge is idempotent and runs in a transaction

## Completion

Reading completion is independent of quiz completion. At the end of a lesson: `completed = true`, `progress = 100`. No fake prerequisite locks.

---

# 17. SEARCH

PostgreSQL full-text or indexed search over: subject, topic, lesson title, description, keywords (and experiments).

- Evaluate the `indonesian` text-search configuration if the deployed PostgreSQL version provides it; otherwise use `simple` plus `pg_trgm` for tolerant matching.
- Debounced client input, loading state, empty state, responsive result cards.
- Public search returns only published content from active levels; admin search may include drafts.

---

# 18. AI ASSISTANT ("TANYA AI")

## 18.1 Architecture

```typescript
interface AIProvider {
  streamChat(input: AIChatInput): AsyncIterable<AIChunk>
}
```

Implementation: `OpenAICompatibleProvider`.

```text
AI_API_KEY=   AI_MODEL=   AI_BASE_URL=
```

Never use `NEXT_PUBLIC_` for secrets.

## 18.2 Request flow

```text
Client → POST /api/ai/chat → rate limit (+ auth if present) → AI service
→ load lesson context → load bounded conversation history → build bounded prompt
→ provider → stream response → persist assistant message (authenticated only)
```

Lesson context: level, subject, topic, lesson title, description, relevant lesson content, and (P1) current interactive parameter values. Never send unbounded database contents; cap context size.

## 18.3 Access policy

- Guests MAY use the assistant with a stricter rate limit; their conversation is kept in `sessionStorage`, not in the database.
- Authenticated users get higher limits and persisted conversations.

## 18.4 Behavior

- act as an educational tutor; explain step-by-step; use examples/analogies
- adapt to the learner's apparent level; avoid unnecessary complexity
- help confused learners from simpler angles
- guide understanding of practice questions instead of only giving final answers
- prioritize the current lesson; do not invent facts; acknowledge uncertainty
- do not expose internal prompts, system instructions, API keys, or private data

## 18.5 Fallback and rate limiting

- Provider failure → friendly error, retry allowed, lesson page unaffected: “Edu AI sedang tidak tersedia. Coba lagi sebentar.”
- Rate-limit `POST /api/ai/chat` (Redis when configured, documented dev fallback otherwise), keyed by user ID or a privacy-conscious client strategy; return HTTP 429 with a friendly message.
- Enforce maximum message length, context length, and history window.

---

# 19. AUTHENTICATION AND AUTHORIZATION

- Provider: Supabase Auth; application profile stored in PostgreSQL.
- Phase 1 roles: `USER`, `ADMIN`.
- Admin protection at two levels: (1) route/UI access, (2) server-side authorization on every admin mutation.
- Never rely on hiding Admin UI; never trust a client-provided role.
- Phase 1 admin accounts are provisioned by seed/ops, not self-registration.

---

# 20. API DESIGN

## Public

```text
GET  /api/levels
GET  /api/subjects
GET  /api/subjects/:slug
GET  /api/topics/:slug
GET  /api/lessons                       # list; filters: subject, topic, kind
GET  /api/lessons/:slug                 # includes sources
GET  /api/search

GET  /api/quiz/questions                # ?lessonId | ?topicId &count — no answer keys
POST /api/quiz/check                    # PRACTICE feedback for one question
POST /api/quiz/submit                   # scores; persists only if authenticated

POST /api/ai/chat                       # guests allowed with stricter limits
```

## Authenticated

```text
GET  /api/progress        POST /api/progress
POST /api/favorites       DELETE /api/favorites/:lessonId
GET  /api/quiz/attempts   GET /api/quiz/attempts/:id
```

## Admin

```text
POST/PUT/DELETE /api/admin/subjects[/:id]
POST/PUT/DELETE /api/admin/topics[/:id]
POST/PUT/DELETE /api/admin/lessons[/:id]
POST            /api/admin/lessons/:id/publish | unpublish | archive
POST/PUT/DELETE /api/admin/questions[/:id]
POST/PUT/DELETE /api/admin/sources[/:id]
PUT             /api/admin/lessons/:id/sources
POST            /api/admin/media                      # validated upload / signed URL
```

Route handlers stay thin: `validate request → authorize → call service → map response`.

## Response convention

Success:

```json
{ "data": {}, "meta": {} }
```

Error:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Data yang dikirim belum valid." } }
```

Never return stack traces or expose SQL/ORM internals.

## Validation (Zod)

Validate route params, query params, request bodies, content-block structure, interactive configs, quiz answers, admin mutations, and AI requests. Content blocks use discriminated schemas by `type`; interactive `config` is validated by the registered component's `configSchema`.

---

# 21. SECURITY

Mandatory:

- server-side authorization on all admin routes and mutations
- Zod validation; Prisma parameterized queries
- rich-content sanitization; no `dangerouslySetInnerHTML` on raw input
- secure authentication/session handling
- server-side AI secrets
- rate limiting (AI chat, quiz check/submit)
- validated file uploads (type, size, content sniffing)
- **no arbitrary code execution through CMS** — no `eval`, no stored scripts, no free-form iframes; Formula Sandbox uses a restricted evaluator
- no production credentials in source

Never expose: correct quiz answers before answering, draft/unpublished content, inactive-level content, internal prompts, AI API keys, database errors.

---

# 22. PERFORMANCE, CACHING, REDIS, JOBS, STORAGE

## Performance

- Server-render lesson content; cache published content where practical.
- Lazy-load interactive components; do not initialize all simulations immediately.
- Optimized images, lazy YouTube embeds, minimal client JavaScript.
- Avoid N+1 queries; use Prisma `select`/`include`; rely on defined indexes.
- Treat low-bandwidth devices as a target: define and test a page-weight budget for lesson pages and verify text fallbacks load without the interactive bundle.

## Caching

Cache candidates: levels, subject/topic lists, published lesson metadata and content.

```text
Public content   → Next.js caching / revalidation
Hot shared data  → Redis if needed
User-specific    → PostgreSQL
```

Explicit invalidation after admin publish/update/archive. Do not cache user-specific data without user-keyed invalidation.

## Redis

Used for AI/quiz rate limiting, hot content caching, future queues. Must not be mandatory for basic local development; features that do not need it keep working, and rate limiting has a documented dev fallback.

## Background jobs

No workers for normal CRUD. BullMQ only for analytics aggregation, expensive recommendation calculations, future AI indexing, notifications. Core lesson reading and quiz submission MUST NOT depend on a worker.

## Object storage

Lesson images, thumbnails, avatars, CMS media. No large binaries in PostgreSQL. No video hosting; YouTube embeds only.

---

# 23. SEO, ACCESSIBILITY, UI

## SEO

Metadata for homepage, subject, topic, lesson, and lab pages. Canonical URLs and OpenGraph. Published lessons crawlable; admin routes not indexed; inactive levels not indexed.

Lesson example — Title: `Gerak Parabola — Fisika | ive`; Description: `Pelajari konsep gerak parabola melalui penjelasan, visualisasi interaktif, dan latihan soal.`

## Responsive / accessibility

Semantic HTML, keyboard navigation, visible focus states, accessible labels, alt text, heading hierarchy, contrast, touch-friendly controls.

Mobile: no horizontal overflow, large quiz answer cards, responsive interactive controls, AI drawer becomes bottom sheet/full screen, usable navigation.

Every interactive component has a textual fallback explanation.

## UI principles

Student UI: friendly, visual, spacious, rounded, progress-oriented, welcoming for a general audience (not childish-only, since Phase 3 will serve multiple levels).

Avoid: corporate SaaS look, dense enterprise tables, tiny typography, excessive gray, old-fashioned school-website patterns. Do not copy another product's branding. Primary action must be obvious on every page.

---

# 24. ROUTING

Public:

```text
/
/explore
/lab
/lab/:slug
/search
/my-learning
/login

/learn                       → redirects to /learn/umum
/learn/umum                  (sd, smp, sma exist in schema but are inactive → 404)
/learn/:level/:subject
/learn/:level/:subject/:topic
/learn/:level/:subject/:topic/:lesson

/quiz/:lesson
```

Admin:

```text
/admin  /admin/dashboard  /admin/subjects  /admin/topics
/admin/lessons  /admin/questions  /admin/sources  /admin/interactive
```

Stable slug-based public URLs.

---

# 25. RECOMMENDATIONS

Deterministic rules only; separate module so it can be replaced later:

1. Completed a lesson → recommend the next lesson in the same topic.
2. No progress → recommend beginner content and featured experiments.
3. Frequent subject → recommend more from that subject.
4. After an evaluation → recommend lessons linked to incorrectly answered questions.

No ML.

---

# 26. SEED DATA

The app MUST NOT start empty.

Phase 1 content is **general-purpose (Umum)**. Not tied to a school grade.

Minimum:

- Subjects (suggested): Fisika, Matematika, Biologi, Kimia, Sejarah Indonesia
- At least 20 published lessons/experiments in total, target 30+
- At least 3 published experiments for `/lab`

Each lesson has: title, description, realistic Indonesian learning content, at least one visual/content block, **at least one linked source**, and at least 3 questions where appropriate.

Priority polished lesson:

```text
Umum → Fisika → Gerak → Gerak Parabola
```

Also integrate: Trigonometry Visualizer, Cell Explorer, Atom Explorer, History Timeline (and Formula Sandbox if P1 is built).

Seed rules: no lorem ipsum, no fake "coming soon" primary content, no copied copyrighted text. Seed is idempotent (deterministic slugs/IDs or upserts). SD/SMP/SMA levels are seeded with `isActive = false` and no content.

---

# 27. LOCAL DEVELOPMENT AND MIGRATION

`.env.example`:

```text
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_APP_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

AI_API_KEY=
AI_MODEL=
AI_BASE_URL=

REDIS_URL=

STORAGE_ENDPOINT=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=

ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Only browser-safe Supabase values use `NEXT_PUBLIC_`. Never put AI, service-role, database-admin, or storage-secret credentials in public variables.

README documents: install dependencies → configure env → run migration → run seed → start dev server. A development admin account may be created from `ADMIN_EMAIL` / `ADMIN_PASSWORD`; never hardcode production credentials.

---

# 28. TESTING STRATEGY

## Unit

Projectile calculations, trigonometry calculations, expression evaluator (including injection attempts), quiz scoring and evaluation breakdown, progress merge, content block validation, interactive config validation, publish-readiness rules (including source requirement), recommendation rules, slug utilities, authz permission checks.

## Integration

Lesson retrieval (inactive level excluded), quiz check/submit, attempt persistence, progress persistence, favorites, admin authorization, lesson publishing (blocked without source), source linking.

## E2E — mandatory flows

```text
Learner A:  Homepage → Fisika → Gerak → Gerak Parabola → use simulator
            → view Sumber → open AI → ask → close AI → start Practice
            → finish Quiz → evaluation review

Learner B:  Homepage → Matematika → Trigonometri → visualizer
            → change angle → quiz

Learner C:  Homepage → Biologi → Cell lesson → Cell Explorer → nucleus → mitochondria

Learner D:  Homepage → Lab → open experiment → change parameters → fullscreen

Admin 1:    Login admin → dashboard → lessons → create → content blocks
            → add interactive + config + preview → add sources → questions
            → draft → preview → publish → public verification

Admin 2:    Attempt to publish lesson without source → blocked with clear message
```

---

# 29. OBSERVABILITY AND ANALYTICS

Minimum: server error logging, request error context, client error monitoring, no secret values in logs. Recommended: Sentry, structured server logs. Track route, request ID, user ID where appropriate, error code, latency.

Never log: passwords, API keys, auth tokens, full private AI conversations unless explicitly required and protected.

Analytics goes through an adapter (`analytics.track({ event, userId, properties })`); analytics failure MUST NOT break the user experience.

---

# 30. ERROR / LOADING UX

- Loading: skeletons for lesson/subject/search cards, AI typing indicator, quiz button loading state.
- Error: “Ups, ada sedikit gangguan.” with “Coba lagi”.
- Search empty: “Belum menemukan materi yang cocok.”
- AI: “Edu AI sedang tidak tersedia. Coba lagi sebentar.”
- Interactive unavailable: “Simulasi ini belum tersedia.” plus the textual explanation.
- Never show raw stack traces.

---

# 31. IMPLEMENTATION ORDER

Agents MUST implement in this order unless a dependency requires otherwise. CMS authoring comes earlier than in v1.0 because materials are provided through the CMS.

1. **Bootstrap** — Next.js App Router, TypeScript, Tailwind, shadcn/ui, lint, format, test setup
2. **Database** — Prisma, schema, migration, indexes, seed skeleton (levels with `isActive`)
3. **Auth** — Supabase Auth, user profile, admin role, `authz` module, middleware/server authorization
4. **Core domain** — levels, subjects, topics, lessons (with `kind`)
5. **Content engine + sources** — block schemas, renderer, formula, video, illustration, real-world block, Source/LessonSource
6. **Interactive engine** — registry, definition contract, config schemas, five components
7. **Student UI + navigation** — homepage, subject, topic, lesson, mega menu, outline tree, breadcrumbs, lab
8. **Admin CMS — authoring track** — CRUD, block editor, source editor, preview, publish rules
9. **Admin CMS — interaction track** — interactive library, config forms, live preview
10. **Quiz** — question bank editor, question sets, practice/quiz, check/submit, evaluation, history
11. **Progress** — localStorage, authenticated persistence, merge
12. **AI** — provider adapter, context builder, streaming, persistence, rate limiting
13. **Search / Favorites**
14. **P1 items** — Formula Sandbox, shareable state, AI interactive context
15. **SEO / performance / accessibility**
16. **Tests**
17. **End-to-end polish**

---

# 32. DEFINITION OF DONE

A feature is DONE only when: UI works; API/service works; validation exists; authorization exists where needed; loading and error states exist; mobile behavior works; tests cover important business logic; no dead buttons; no placeholder primary content; no avoidable console/runtime errors.

---

# 33. AGENT RULES

All coding agents MUST follow these rules.

1. Do not rewrite working modules unnecessarily.
2. Do not place business logic inside UI components.
3. Do not put database queries directly in reusable UI components.
4. Do not expose secrets to the client.
5. Do not trust client-side quiz scoring.
6. Do not trust a client-provided admin role.
7. Do not allow arbitrary CMS code execution.
8. Do not create fake locked lessons.
9. Do not introduce microservices unless explicitly approved.
10. Do not introduce new infrastructure dependencies without documenting why.
11. Prefer existing dependencies before adding a new package.
12. Every new package must have a clear reason.
13. Every public route must have a meaningful loading and error state.
14. All public educational content must come from database/content data, not hardcoded page components.
15. Use the same content renderer for admin preview and public lesson.
16. **Do not publish or seed a lesson without at least one linked source.**
17. **Do not build Phase 2/3 features** (teacher role, classrooms, access codes, active SD/SMP/SMA content). Keep only the extension points in Section 34.
18. **Do not hardcode "umum" in business logic;** read the active level(s) from the database so Phase 3 needs no refactor.
19. **Every interactive component must register a `configSchema` and a `textFallback`.**
20. **Modular UI & DRY component composition:** Never write ad-hoc repetitive card or section markup inline. Always compose views using foundational primitives in `src/components/ui/` (`ModularCard`, `SectionHeader`, `TabSwitcher`). Decouple repetitive display data into strongly-typed datasets in `src/data/<domain>/` with a mandatory unique `id: string` on every item for list keys.

---

# 34. PHASE 2 AND PHASE 3 EXTENSION POINTS

## Prepared now (cheap, non-breaking)

| Future need | Preparation in Phase 1 |
|---|---|
| Phase 2: teachers author content | `createdById`/`updatedById` on content tables; central `authz.can()`; `Role` enum extensible with `TEACHER` |
| Phase 2: teacher-owned or class-scoped content | Content ownership recorded; a `visibility` field is NOT added now |
| Phase 2: question bank shared via access code | Questions already belong to a topic and are served through a question-set service, so an access-code-scoped set can be added later |
| Phase 2: two-way teacher ↔ student results | `QuizAttempt` and `QuizAttemptAnswer` already store per-question results |
| Phase 3: SD / SMP / SMA / UMUM | `EducationLevel` with `isActive`, level segment in URLs and queries |

## Deferred (design only when the phase starts)

- Phase 2: `Classroom`, `ClassroomMember`, `AccessCode`, teacher dashboard, teacher-authored question sets, result visibility rules, privacy rules for student data.
- Phase 3: curriculum mapping per level, level-specific content import, level selection UI.

---

# 35. FUTURE EXTRACTION, SCALE PATH, PRIORITIES

Extractable later: AI Service, Search Service, Quiz Service, Analytics Pipeline, Recommendation Service. Extract only for independent scaling, deployment cadence, ownership boundary, or an infrastructure bottleneck; not merely because a module exists.

Scale path:

- **Stage A — MVP:** Next.js + PostgreSQL + Redis + Object Storage, single deployable.
- **Stage B — Growing traffic:** CDN, multiple Next.js instances, managed PostgreSQL, Redis, background worker.
- **Stage C — Large platform:** extract only high-load/high-change domains.

Trade-off priority: 1) Correctness, 2) Student learning experience, 3) Data integrity, 4) Security, 5) Maintainability, 6) Performance, 7) Scalability, 8) Infrastructure sophistication.

---

# 36. FINAL TECHNICAL CHECKLIST

## Architecture
- [ ] Modular monolith, clear domain boundaries, thin API handlers
- [ ] Services contain business logic; repositories where useful
- [ ] External providers behind adapters
- [ ] Central `authz` module

## Database
- [ ] PostgreSQL, Prisma schema, migration, seed, indexes, constraints
- [ ] `EducationLevel.isActive` enforced in public queries
- [ ] Source / LessonSource, Question (topic-based), QuizAttempt(+Answer)
- [ ] Transactions where needed

## Learner
- [ ] Homepage subject catalog, subject, topic, lesson
- [ ] Mega menu, outline tree, breadcrumbs, prev/next
- [ ] Content blocks (text, illustration, formula, video, real-world, interactive)
- [ ] Sources shown on lessons
- [ ] Interactive components + fullscreen + text fallback
- [ ] Lab
- [ ] Practice mode, Quiz mode, evaluation review, attempt history
- [ ] AI assistant
- [ ] Progress (guest + authenticated + merge), Search, Favorites

## Admin
- [ ] Auth and server-side authorization
- [ ] CRUD (subject, topic, lesson, question, source)
- [ ] Block editor
- [ ] Interactive library, config form, live preview
- [ ] Preview via public renderer
- [ ] Publish blocked without source

## Security
- [ ] Secrets server-side; Zod validation; admin checks server-side
- [ ] Quiz scoring server-side; no answer keys leaked
- [ ] Sanitization; rate limiting; no arbitrary code execution

## UX
- [ ] Mobile, tablet, desktop; classroom/fullscreen
- [ ] Loading, error, empty states
- [ ] Accessibility; SEO

## Testing
- [ ] Unit, integration, E2E learner flows, E2E admin flows

---

# 37. ASSUMPTIONS AND OPEN DECISIONS

These choices were made while converting the 5W1H into architecture. Confirm or change them before implementation.

| # | Decision made in this TAD | Alternative |
|---|---|---|
| 1 | The teacher-issued access code question bank is **Phase 2** (it requires teacher accounts) | Pull a simplified version into Phase 1 (would add Classroom/AccessCode and a TEACHER role) |
| 2 | Keep `/learn/umum/...` URLs and hide the level picker | Drop the level segment now and migrate URLs in Phase 3 |
| 3 | Guests may use AI with a stricter limit | Require login for AI |
| 4 | `EXPERIMENT` is a lesson `kind`, listed in `/lab` | Separate Experiment table |
| 5 | Formula Sandbox is P1 (should-have), coded components are P0 | Make Formula Sandbox P0 |
| 6 | Sources are mandatory to publish (presence, not truth-checking) | Soft warning only |
| 7 | Suggested Umum subjects: Fisika, Matematika, Biologi, Kimia, Sejarah Indonesia | Different subject list |
| 8 | Rich-text editor library (for example Tiptap) and expression parser need a Rule 12 justification; none is chosen here | Pre-select libraries |
| 9 | Questions belong to a topic and may be pinned to a lesson | Lesson-only questions as in v1.0 |

---

# 38. AGENT EXECUTION BRIEF

Interpret this document as an implementation contract for **Phase 1 only**.

Do not build a static prototype. Build a functional application.

Do not stop when the UI looks correct. Verify:

```text
database → API → UI → state → interactions → authentication
→ authorization → error handling → tests
```

The core demo must work end-to-end: a learner picks a subject, studies a lesson with real content and visible sources, plays with an interactive component, asks the AI, practices, takes a quiz, and reviews the evaluation; an admin authors the lesson, composes its interaction, attaches sources, previews, and publishes it.

The resulting codebase must be understandable by another engineering team and must support Phase 2 (teacher CMS) and Phase 3 (education levels) without an immediate rewrite.