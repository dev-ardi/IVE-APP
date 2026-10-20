# AGENTS.md
# IVE-APP — Interactive Visual Education Application
# AI Agent Engineering & Development Constitution

> **Version:** 2.0 — aligned with `IVE-APP-PRD.md` v2.0, `IVE_TAD_Phase_1.md` v2.0, `design-cms.md` and `design-frontend.md` v1.0
> **Last revised:** 2026-10-19
>
> **Purpose:** This file is the persistent engineering contract for every AI coding agent working on IVE-APP. It defines *how agents behave*. It does **not** duplicate the architecture, product, or design specifications — it tells you **which document to open for which decision** and what rules always apply.
>
> **Product name:** **IVE-APP** (Interactive Visual Education Application).
> Retired names: *IVE — Visual Education Interactive* and *EduSpark*. Do not let retired names appear in UI, AI prompts, seed data, metadata, or active documentation. Old names may appear only in migration notes or decision history. Renaming internal identifiers (package, database, folders) is optional and must be planned, never done opportunistically.
>
> **Language convention:** user-facing UI and educational content are **Bahasa Indonesia**. Code, identifiers, comments, commit messages, and this file are English.

---

# PART A — SOURCES OF TRUTH

## 1. READ THIS FIRST

Before modifying anything, every agent MUST:

1. Read this `AGENTS.md`.
2. Identify the **task mode** (Section 3) and read the documents that mode requires. Read the relevant sections, not just the headings.
3. Inspect the repository: structure, `git status`, `git log -n 10`, and the code that already relates to the task.
4. Search for existing components, hooks, services, repositories, schemas, routes, and Prisma models that solve the same problem (Section 33).
5. Check whether the feature already exists partially.
6. Check the **Known Discrepancies** table (Section 4) for the topic you are touching.
7. Make the smallest coherent change that satisfies the task.
8. Run relevant validation before reporting completion.

Never assume the repository is empty or matches the documented architecture exactly. Locate the documents with:

```bash
rg --files -g 'AGENTS.md' -g 'IVE*TAD*' -g 'IVE-APP-PRD*' -g 'design-frontend*' -g 'design-cms*' -g '!node_modules'
```

**The running codebase is the source of truth for implementation state.** The documents below are the intended baseline. If they conflict because the codebase intentionally evolved, preserve the working architecture unless the task explicitly requests migration (Section 49).

## 2. DOCUMENT HIERARCHY

Each document is authoritative for a different kind of question. When two documents disagree, the owner of that *kind of question* wins.

| Question type | Authority | Typical sections |
|---|---|---|
| What is implemented right now | The codebase | — |
| How an agent behaves, process, quality gates | `AGENTS.md` (this file) | all |
| Architecture, data model, API, security, module boundaries, implementation order, hard agent rules | `IVE_TAD_Phase_1.md` v2.0 | §4–§24, §31–§34 |
| Product behavior, requirement IDs (FR-xx), priorities (P0/P1/P2), acceptance criteria, metrics, open decisions (D-xx) | `IVE-APP-PRD.md` v2.0 | §7–§8, §14–§17 |
| Student-facing visual design, layout, page composition, UI states, motion, accessibility details | `design-frontend.md` v1.0 |design-cms.md (otoritas desain CMS, jembatan RBAC, Sandbox Studio, integrasi data)| §2–§11 |

Rules of use:

- **PRD** says *what and why* → **TAD** says *how it is built* → **design brief** says *how the student UI looks and feels*.
- Use stable IDs when you cite requirements in code comments, PR text, and handoff reports: `FR-07.2` (PRD), `TAD §15.2`, `Design §6`.
- Do not silently override any document. If you must deviate, follow Section 4 and Section 51.

## 3. TASK MODES — WHICH DOCUMENTS ARE MANDATORY

Classify every task first. A task may mix modes; if so, split it (Section 40) or handle each part under its own mode.

| Mode | Applies when | Must read | Hard scope limits |
|---|---|---|---|
| **S — Student frontend / design** | Layout, visual design, student pages, quiz UI, AI drawer UI, navigation UI, content-block presentation | `design-frontend.md` (all), PRD FRs for the page, TAD §10, §11, §14, §15, §18, §23, §24, §30 | **Never touch `/admin` routes or admin components.** Do not add backend features just for visuals. Do not break working features. |
| **B — Backend / domain / data** | Prisma models, services, API, quiz scoring, progress merge, AI orchestration, search, auth | TAD §4–§9, §15–§22, PRD FR for the feature | No UI redesign beyond what the contract needs. |
| **C — Admin CMS** | `/admin/*`, block editor, interactive library, source editor,require to read design-cms.md publish rules | TAD §11, §12, §13, PRD FR-16, FR-19 | The student design brief does **not** apply to admin. Do not restyle student pages. |
| **I — Interactive component** | New or changed registry component, Formula Sandbox |Sandbox Studio Mode 1 | TAD §11, PRD FR-07.x, design brief §6 | Registry contract is mandatory (Section 17). |

The student design brief has its own scope fence (Design §0): it covers learner-facing frontend only. Admin CMS is separate work,design-cms.md is the frontend brief.

## 4. CONFLICT RESOLUTION AND KNOWN DISCREPANCIES

The three documents were revised at slightly different times and disagree in a few places. PRD §13 requires that conflicts be recorded and agreed, not silently resolved. Procedure:

1. Look the topic up in the table below. If a default is given, follow it.
2. If the topic is not listed and the conflict is material (schema, route, priority, security, data model), **ask** (Section 42) or choose the lowest-risk reading and record it under *Discrepancies* in your handoff.
3. Never "fix" a document silently. Propose the document change in the handoff.

### Known discrepancies and defaults

| # | Topic | Documents disagree | Default until the owner confirms |
|---|---|---|---|
| 1 | Formula Sandbox priority | PRD: P0 (FR-07.2, MVP acceptance). TAD: P1, "cut first" | Sequence it after P0 flows are stable (TAD §31 step 14), but build the registry/config contract so it plugs in without refactor, and do **not** mark Phase 1 MVP accepted without it unless the owner says otherwise. |
| 2 | Atom Explorer, History Timeline | TAD: P0. PRD: P1 (D-03 proposal) | Keep both in the registry per TAD. If capacity is limited, Formula Sandbox goes before them. |
| 3 | Search, Favorites, My Learning | TAD: P0 list. PRD: P1 | Follow TAD §31 order (step 13, after the core loop). Never block the core learning loop on them. |
| 4 | Analytics | PRD: minimal events are P0 (metrics need them). TAD: optional/P1 | Build the `analytics.track` adapter and the five minimal events: `lesson_viewed`, `lesson_completed`, `interactive_used` (debounced, never per slider tick), `quiz_completed`, `ai_question_asked`. Analytics failure must never break UX. |
| 5 | `IN_REVIEW` status | PRD: DRAFT/IN_REVIEW/PUBLISHED/ARCHIVED. TAD: DRAFT/PUBLISHED/ARCHIVED | Use the TAD enum. Do not add `IN_REVIEW` until decision D-05 is made. |
| 6 | Publish gates | PRD adds learning objectives and review state. TAD gates: valid blocks/config, ≥1 source, image `alt`, taxonomy active | TAD gates are always enforced. Do not add a learning-objectives column or reviewer fields without confirmation (schema change). Interactive `textFallback` is already mandatory via the registry contract — enforce it. |
| 7 | Source fields | PRD FR-19 wants accessed date, license status, usage note. TAD §8.7 `Source` has `licenseNote`, `year`, no `accessedAt` | Follow the TAD schema. Propose an `accessedAt` migration + TAD update in the handoff; do not add it silently. |
| 8 | Experiments route | TAD: `/lab`, `/lab/:slug`. PRD: `/experiments` | Use `/lab`. A standalone `/practice` question-bank page (PRD FR-20, P1, D-16) is not in the TAD routes: do not build it without approval. |
| 9 | Seed volume | TAD: ≥20 lessons/experiments (target 30+), ≥3 experiments. PRD: ≥15 Umum lessons, ≥3 per core subject, ≥8 interactive | Satisfy both: ≥20 published, ≥3 experiments, ≥3 per core subject, ≥8 with interactive blocks. |
| 10 | Level selector & inactive levels | Design §4.1 lists. TAD §14.1 hides the picker; inactive levels are not listed/routable. PRD allows hidden or "Segera hadir" | Hide the level picker while one level is active (show it automatically once ≥2 active levels have published content). Never render inactive levels. "Segera hadir" labels only with explicit owner approval (also see Section 36). |
| 11 | Navigation labels | Design §3.1: Beranda · Jelajahi · Pembelajaran Saya · Lab Simulasi. TAD §14.2:. PRD §9: Home · Explore · Latihan · My Learning | Structure/behavior from TAD §14 and PRD FR-18 (mega menu Subject → Topics, Lab, search, outline tree, breadcrumbs). Visible labels from the design brief; use **"Pembelajaran Saya"** for `/my-learning`. Keep all nav labels in one constants file. "Latihan" nav only if `/practice` is approved. |
| 12 | Topic-scope practice entry | TAD requires topic-scope practice (§14.2, §15.1) but lists only `/quiz/:lesson` | Extend the existing quiz runner with an explicit, documented scope parameter. Record the decision. |
| 13 | SEO title brand | TAD §23 example: `… \| ive`. PRD Appendix B: user-visible name is IVE-APP | Pattern: `<Judul> — <Mata Pelajaran> \| IVE-APP`. |
| 14 | SUPER_ADMIN enum vs. TAD.
| 15 | Local videos (design §6.1) vs. YouTube-only (TAD).
| 16 | fallback dummy-data.ts (design §7.2) vs. “no fake data”.
| 17 | mock AI chat on the homepage (design §5.1) vs. “no fake AI”.



---

# PART B — PRODUCT IDENTITY AND SCOPE

## 5. PRODUCT IDENTITY

IVE-APP is an Indonesian interactive education web application whose differentiator is the **interactive sandbox**: learners change values in a formula or model and immediately see a visual result. It exists to support Indonesia Emas 2045 by making learning more immersive and understanding deeper. It is **not** a school administration portal, an LMS, or a generic card catalog (PRD §3, Design §0).

Core learning loop (PRD §1, TAD §2):

```text
DISCOVER → LEARN → INTERACT → PRACTICE → ASK AI → EVALUATE/COMPLETE → CONTINUE
```

Four product pillars (TAD §1 HOW):

1. Learner picks learning material.
2. Material is multi-format: text, illustration, formula (when needed), explanation video, real-world practice example, interactive components.
3. Practice questions, quizzes, and evaluation.
4. "Tanya AI" lesson-aware tutor.

Audience in Phase 1: general learners ("Umum"), self-study, curious users, tutoring centers. Teachers and school levels come later (Section 7).

## 6. PRODUCT PRINCIPLES

Every engineering decision must support these.

1. **Learning first.** Learner experience outranks CMS complexity.
2. **Interactive by design.** Where a concept benefits from visualization, prefer an interactive experience over a static one — and the interaction must be *meaningful*, not decoration.
3. **Content is data.** Educational content is never hardcoded into page components; it lives in the database and is rendered by reusable systems.
4. **Components are reusable.** One renderer, one registry, many lessons.
5. **Sources must be valid and visible.** A lesson without a linked source cannot be published or seeded.
6. **Easy entry.** Public content is learnable without login.
7. **Feedback that teaches.** Wrong answers are explained constructively; never shame-based.
8. **Security from day one.** Authorization and validation on the server; hiding UI is not security.
9. **Progressive complexity.** Do not build infrastructure before the product needs it.
10. **Accessible and mobile-first for low bandwidth.** Mid-range phones and weak connections are first-class targets (TAD §1 WHERE, PRD §6). Every interactive component has a textual fallback.
11. **No fake UI.** A control that looks active must work.
12. **Original identity.** Do not copy another platform's branding, logo, illustrations, exact UI, copywriting, or proprietary content. The design brief cites Brilliant.org only for *learning-method* principles (learn by doing, one concept at a time, visual intuition, guided progression, feedback that teaches). Learn from the method; build an original IVE-APP identity.

## 7. PHASE MODEL

Aligned with PRD §5.2 and TAD §1. This replaces the older four-phase roadmap.

| Phase | Definition | Status |
|---|---|---|
| **Phase 1** | App + Admin CMS for **general-purpose (Umum)** material with interactive components | **Implement now** |
| Phase 2 | CMS usable by teachers/educators; classroom use; teacher-issued access-code question sets | Extension points only |
| Phase 3 | General material for SD, SMP, SMA, alongside Umum | Schema-ready, no content |

**Features are not approved merely because they appear in a roadmap.**

### Phase 1 non-goals (do NOT build — TAD §3)

- Teacher role, teacher CMS access, classrooms, access codes, two-way teacher↔student question bank.
- Active SD/SMP/SMA content or curriculum mapping.
- Leaderboards, XP, coins, rewards, certificates, streak/badge systems.
- Marketplace, ML recommendations, adaptive quizzes, real-time collaborative classes.
- Video hosting (YouTube embeds only).
- Arbitrary code authored in the CMS (no HTML/JS injection, no user-defined components).
- Microservices, Kubernetes, Kafka, service mesh, dedicated vector DB.

Leave **extension points only** (TAD §34): `createdById`/`updatedById` on content tables, central `authz.can()`, extensible `Role` enum (do not add `TEACHER` now), topic-based question service, per-question attempt storage, `EducationLevel.isActive`. Build extension points, not unused systems.

---

# PART C — ARCHITECTURE

Details live in TAD §5–§9. This part is the rule summary.

## 8. ARCHITECTURAL NORTH STAR

Start as a **modular monolith**; scale only when measured need exists.

```text
                          IVE-APP
                             │
                        Next.js App
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   Student UI            Admin UI           API / Actions
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    Application Modules
    ┌──────┬─────────┬───────┴──┬──────┬──────────┬────┬───────┐
 Learning Content Interactive  Quiz  Progress  AI  Search  (authz, navigation,
                                                           sources, favorites…)
                             │
                   Repository / Adapters
                             │
           ┌─────────────────┼─────────────────┐
       PostgreSQL          Redis         Object Storage
           │
       pgvector (later)
```

- The Next.js process stays stateless. Durable state → PostgreSQL. Cache/temporary coordination → Redis. Files → object storage.
- Preferred progression: Modular Monolith → Horizontal Scaling → Targeted Service Extraction. Never "microservices everywhere from day one".

## 9. TECHNOLOGY BASELINE

Unless the repository contains an intentional, documented alternative (TAD §0):

| Area | Choice |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript (strict), Tailwind CSS, shadcn/ui |
| Animation | Framer Motion (see Section 30 for restraint rules) |
| Backend | Next.js Route Handlers, Server Actions where appropriate, domain/application services |
| Database | PostgreSQL + Prisma |
| Auth | Supabase Auth (profile in PostgreSQL) |
| Validation | Zod |
| Cache / rate limiting | Redis (never mandatory for local dev) |
| Jobs | BullMQ — only when async work is genuinely needed |
| Storage | S3-compatible / Cloudflare R2 / Supabase Storage |
| AI | Provider-agnostic OpenAI-compatible adapter, server-side only |
| Vector search | pgvector, only when RAG is introduced |
| Math | KaTeX |
| Testing | Vitest, React Testing Library, Playwright |
| Observability | Sentry-compatible monitoring, structured logs |
| Analytics | PostHog-compatible adapter, optional |

Do not add a framework because it is fashionable. Any new package (for example a rich-text editor such as Tiptap, or an expression-parser library) needs a **written justification** (Section 38; TAD Rules 10–12).

## 10. CODEBASE STRUCTURE AND OWNERSHIP

Organize by domain, not by agent. Recommended layout (TAD §6; adjust folders but preserve module boundaries):

```text
src/
├── app/
│   ├── (public)/        # /, explore, lab, search, my-learning, login, learn/[level]/[subject]/[topic]/[lesson]
│   ├── quiz/[lesson]/
│   ├── admin/           # Mode C only
│   └── api/
├── components/          # ui, layout, navigation, learning, lesson, quiz, ai, search, interactive/
├── modules/             # domain modules
├── lib/                 # db, auth, cache, storage, validation, rate-limit, utils
├── server/              # auth, services, adapters
├── prisma/              # schema.prisma, migrations/, seed.ts
├── styles/              # globals.css (design tokens)
└── tests/
```

Domain modules (TAD §7): `levels`, `subjects`, `topics`, `lessons`, `content`, `interactive`, `sources`, `quiz`, `progress`, `favorites`, `search`, `ai`, `navigation`, `recommendations`, `analytics`, `authz`.

Module pattern where useful: `<domain>.service.ts`, `.repository.ts`, `.schema.ts`, `.types.ts`, `.mapper.ts`. Do not create empty files to satisfy the pattern. Add a module only for a real domain boundary; do not create modules for trivial UI-only concerns.

## 11. LAYERING AND DEPENDENCY DIRECTION

```text
Route Handler → parse → validate (Zod) → authenticate → authorize (authz.can) → Service → Repository → Prisma → PostgreSQL
Service → Adapter interface → Provider (AI, storage, analytics)
```

Preferred dependency direction: `UI → Application Service → Repository/Adapter → Infrastructure`.

Avoid:

- UI → Prisma directly
- UI → vendor SDK (e.g. OpenAI) directly
- Route handler with business logic, scoring, authorization, or Prisma queries inline
- Database layer doing UI-specific formatting

Business logic does not live in React components or route handlers (TAD Rules 2–3).

## 12. CLIENT VS SERVER

Keep server-only code server-only. Never import server-only modules into client components.

- **Server:** database, Prisma, service-role credentials, AI API, secrets, admin authorization, quiz scoring.
- **Client:** interactive visualization state, form state, animation, temporary UI state.
- Server-render lesson content; use `"use client"` only where interaction needs it; lazy-load heavy interactive code.

---

# PART D — DOMAIN RULES

## 13. CONTENT HIERARCHY AND LEVELS

```text
EducationLevel (Phase 1: only "umum" active)
 → Subject → Topic → Lesson (kind: LESSON | EXPERIMENT)
                       ├─ Content Blocks (JSON)
                       └─ Sources (many-to-many)
Topic → Questions (question bank; optionally pinned to a lesson)
```

Key rules (TAD §4, §8):

- **Level stays in the model and the URL; only `umum` is active.** Public URLs are `/learn/umum/...`. `/learn` redirects to `/learn/umum`. `sd`, `smp`, `sma` exist in the schema with `isActive = false` and **no content**; they are not listed, routable (404), searchable, or indexed.
- **Do not hardcode `"umum"` in business logic** (TAD Rule 18). Read active levels from the database so Phase 3 needs no refactor.
- Public queries MUST filter `status = PUBLISHED` **and** an active level.
- **Experiments are lessons.** `Lesson.kind = EXPERIMENT` powers `/lab`; it reuses the same CMS, renderer, sources, search, and progress.
- **Questions belong to a Topic**, optionally pinned to a Lesson (if pinned, the lesson must belong to the topic).
- Slug uniqueness is scoped: `Subject(educationLevelId, slug)`, `Topic(subjectId, slug)`, `Lesson(topicId, slug)`. Public URLs use stable slugs; avoid exposing DB IDs publicly. Admin may use IDs.
- `Lesson.educationLevelId` and `subjectId` are denormalized from the topic; the service keeps them consistent **in a transaction**.
- Content status: `DRAFT | PUBLISHED | ARCHIVED` (see Section 4 #5). Public queries never expose drafts; admin preview may, with authorization. Prefer archive over hard delete for published content.
- The catalog must scale from tens to thousands of lessons **without page rewrites**: content from DB, reusable renderer, extensible block types, extensible registry, data-driven taxonomy.

## 14. CONTENT BLOCK ENGINE

One renderer, shared by public pages and admin preview (TAD §10, Rule 15):

```text
LessonContentRenderer({ blocks: ContentBlock[] }) → ContentBlockRenderer registry
```

Supported types (TAD §8.6):

```text
heading | text | image | video | formula | callout | example | realworld | interactive | quiz | divider
```

Rules:

- Zod **discriminated union on `type`**. Unknown block types render a safe fallback — never crash the lesson.
- Never use `dangerouslySetInnerHTML` with unsanitized content. Admin-authored rich text is sanitized before rendering; arbitrary iframe HTML is never stored.
- `image` requires `alt` (decorative images use empty alt). External illustrations carry `credit` and, when applicable, a `sourceId`.
- `video` stores a YouTube video ID only, rendered as a lazy privacy-friendly embed, with an accessible fallback.
- `formula` renders with KaTeX; invalid LaTeX falls back to readable raw text, never an error page. Formulas, tables, images, and diagrams must not break layout (wide tables scroll locally).
- `interactive` blocks are lazy-loaded.
- Do not put executable code inside content JSON.
- The recommended lesson template (*Pengantar → Konsep → Video → Eksplorasi interaktif → Contoh dunia nyata → Latihan → Sumber*) is **soft guidance**: the CMS may show a non-blocking checklist but must not force every block type. Formula blocks are expected only for formula-based material.

New block type procedure: stable type name → Zod schema → TS type → renderer → admin editor UI (if editable) → preview → fallback → tests → document the config.

## 15. SOURCES AND CONTENT VALIDITY (TAD §13, PRD FR-19)

"Valid sources" is a core product feature, not a note.

- **A lesson cannot be published or seeded without at least one linked `Source`** (TAD Rule 16). Factual/historical/scientific lessons should have two or more (CMS warns).
- Every published lesson shows a visible **"Sumber"** section: title, author/publisher, year, link when available, citation note.
- The system verifies **presence and structure**, not truthfulness. Truthfulness remains an editorial responsibility.
- Content is written or adapted **in the author's own words**. No verbatim copying of copyrighted text, images, or video. Record `licenseNote`; images need `credit`.
- Prefer authoritative sources (textbooks, government/education bodies, peer-reviewed or institution-published material).
- AI-generated content requires human review before publication.
- Seed rules: no lorem ipsum, no fake "coming soon" primary content, no copied copyrighted text, idempotent seed (deterministic slugs/IDs or upserts), `sd/smp/sma` seeded inactive and empty. The app must not start empty (volume: Section 4 #9). Priority polished lesson: **Umum → Fisika → Gerak → Gerak Parabola**.

## 16. EDUCATIONAL CONTENT QUALITY

Content must be Indonesian by default, accurate, concise, age-appropriate for a general audience, structured, and understandable. Avoid lorem ipsum, fake facts, unsupported claims, needlessly complex explanations, and shame-based quiz feedback. When facts are disputed (especially historical), the authoring process reflects factual nuance. Do not make unverifiable claims of effectiveness anywhere in the product.

## 17. INTERACTIVE ENGINE (TAD §11, PRD FR-07)

Interactive experiences are the core differentiator. The CMS stores **a component key plus validated config — never executable code**.

```json
{ "type": "interactive", "component": "projectile-simulator", "config": { "gravity": 9.8 } }
```

Every component registers an `InteractiveDefinition` (TAD §11.2): `key`, `title`, `description`, `subjectHints`, `configSchema` (Zod), `defaultConfig`, lazy `component`, and `textFallback(config)`.

Rules:

- **Every component MUST register a `configSchema` and a `textFallback`** (TAD Rule 19).
- Every component supports **fullscreen** (classroom/projector) and a **reset** control, with touch-friendly, labelled controls and a textual explanation.
- Config is validated on save **and** on publish. Unknown component key → friendly "Simulasi ini belum tersedia." message plus the textual explanation; never crash, never execute anything.
- The admin config form is generated from the registry (`title`, `description`, `configSchema`, `defaultConfig`) with a live preview using the **public** component.
- The component taxonomy (PRD FR-07.1): **A** Formula Sandbox (no-code config), **B** custom simulations (Projectile Simulator, Trigonometry Visualizer), **C** explorers/diagrams (Cell Explorer, Atom Explorer, History Timeline). B and C need developers; A does not.
- Phase 1 registry keys: `projectile-simulator`, `trigonometry-visualizer`, `cell-explorer`, `atom-explorer`, `history-timeline`, `formula-sandbox` (see Section 4 #1–2 for priority).
- Real physics/maths: Projectile defaults 20 m/s, 45°, 9.8 m/s² (ideal motion, assumptions stated in UI); Trigonometry shows "tak terdefinisi" instead of unstable `tan` values; Atom Explorer is clearly labelled as simplified.
- **Formula Sandbox** uses a **restricted expression evaluator** with an operator/function allowlist. `eval`, `new Function`, and user JavaScript are forbidden. Enforce limits (expression length, variable/output count, sweep points), guard against `NaN`/`Infinity`/division by zero with clear messages. Evaluator unit tests are mandatory, including injection attempts. A parser library choice needs a written justification.
- Interactive state sharing through URL query parameters (P1) must be validated by the component's `configSchema`. Deep links to a lesson and a block anchor must work.
- Performance: lazy-load, define a bundle/page-weight budget, verify text fallbacks work without the interactive bundle. Record `interactive_used` debounced.

New component procedure: contract → config schema → registry entry → implementation → mobile behavior → text fallback → accessibility → tests → CMS selector/config form → seed/demo content.

## 18. QUIZ, PRACTICE, AND EVALUATION (TAD §15, PRD FR-08)

**Scoring is server-authoritative.** Never trust client score, client correct answer, or client total.

- Two modes: **PRACTICE** (instant feedback per answer, unlimited retries) and **QUIZ** (no per-question feedback; scored and reviewed at the end). Scope: a **lesson** (its pinned questions) or a **topic** (all published questions, optionally N random).
- Flow: `GET questions` (no answer keys) → answer → PRACTICE: `POST /api/quiz/check` reveals only the just-answered question → `POST /api/quiz/submit` scores all answers against DB truth.
- `correctOptionId` is never sent before the learner answers that question. Only `PUBLISHED` questions are served. Submit rejects unknown or out-of-scope `questionId`s. Rate-limit `check` and `submit` against answer-key harvesting.
- Persist the attempt together with its answers in one transaction (authenticated). Guests are scored statelessly; attempts stay in `localStorage` (`ive_quiz_attempts`). Duplicate submits must not create duplicate records.
- Evaluation output: score %, correct/incorrect/total, encouraging message, **per-question review** (question, selected, correct, explanation, difficulty), difficulty breakdown, per-lesson breakdown for topic scope, and a deterministic **"Pelajari lagi"** list of lessons linked to wrong answers. Authenticated users get attempt history in `/my-learning`.
- Phase 1 supports `MULTIPLE_CHOICE` only. Question editor rules: ≥2 options, exactly one correct, explanation strongly recommended (warn if missing).
- Do not expand quiz complexity unless the product needs it. Numeric-answer-with-tolerance questions are a post-MVP proposal (PRD FR-08) — not approved.

New question type procedure: type contract → validation → submission format → server scoring → feedback → result calculation → UI → tests → accessibility.

## 19. PROGRESS AND FAVORITES

- Guest: `localStorage` keys `ive_progress`, `ive_favorites`, `ive_quiz_attempts` (nothing sensitive). Authenticated: PostgreSQL (`UserProgress`, `Favorite`).
- Guest-to-account merge runs in a **transaction**, is **idempotent**, keeps the higher progress, keeps `completed = true` once set, and **never overwrites better server progress with worse local progress**.
- Completion: `completed = true`, `progress = 100`. Reading completion is independent of quiz completion. **No fake prerequisite locks.**
- Favorites require login; guests see a clear explanation, never a silent failure.

## 20. AUTHENTICATION AND AUTHORIZATION

- Roles are USER, ADMIN, and SUPER_ADMIN. Add the following rule: no separate admin login; the cms:access capability is present; the canAccessCms flag is sent to the client (not the raw role).
- Browsing public lessons never requires login. Login is for cloud progress, history, favorites, and persisted AI conversations. Explain these benefits; never force login before public material.
- Roles in Phase 1: `USER`, `ADMIN` (default `USER`). Users never choose or raise their own role; admin accounts are provisioned by seed/ops.
- **All permission checks go through `modules/authz` — `can(user, action, resource)`.** No ad-hoc `role === "ADMIN"` in handlers or components (TAD §12.6).
- Authorization is enforced on the **server** for every admin route and mutation. Hiding Admin UI is not protection. Never trust a client-provided role. Never implement fake auth on the frontend.

## 21. ADMIN CMS (Mode C — TAD §12, PRD FR-16)

Admin functionality is secondary to student learning; keep the CMS simple. Two explicit tracks:

1. **Content authoring** — subject/topic/lesson CRUD, block editor, source linking, question bank editor, validated media upload.
2. **Interactive composition** — Interactive Library (`/admin/interactive`), registry-generated config forms, live preview. **No free-form code field exists anywhere in the CMS.**


Rules:

- Editor UX reference (PRD FR-16): three panels — Block Library (left), Content Canvas (center), Properties Inspector (right) — with a top bar for title, status, and Preview & Publish.
- Preview uses the **same `LessonContentRenderer`** as public pages. Autosave may save drafts but **never publishes**.
- **Publish gate (hard):** valid title/slug; level, subject, topic assigned and active; description; valid blocks (Zod); no invalid interactive reference/config; **≥1 linked source**; every image has `alt`. Publishing runs in a transaction and triggers cache invalidation.
- Destructive actions require confirmation. Published content is archived, not deleted.
- Media goes to object storage via validated upload (type, size, dimensions). Never store binaries in PostgreSQL. No video hosting.
- Dashboard cards include **lessons without sources**.
- Content tables record `createdById` / `updatedById`.

## 22. AI TUTOR ("TANYA AI") — TAD §18, PRD FR-09

AI calls happen **server-side only**. Never expose `AI_API_KEY`, provider secrets, system prompts, or private context. Never put secrets in `NEXT_PUBLIC_*`.

```text
UI → POST /api/ai/chat → rate limit (+ auth if present) → AI Service → Context Builder → Provider Adapter → stream
```

```typescript
interface AIProvider {
  streamChat(input: AIChatInput): AsyncIterable<AIChunk>;
}
```

- Do not couple the UI to a vendor SDK. Implementation: `OpenAICompatibleProvider` (`AI_API_KEY`, `AI_MODEL`, `AI_BASE_URL`).
- **Bounded context:** level, subject, topic, lesson title/description/relevant content, **lesson sources**, bounded conversation history, and (P1) current interactive parameter values. Never dump the database; cap context, message length, and history window.
- Behavior: tutor, not generic chatbot — adapt to apparent level, explain step by step, use examples/analogies, guide understanding instead of only final answers, **prioritize the current lesson, do not invent facts, state uncertainty, and never reveal answers to a quiz in progress**. Never expose internal prompts or private data.
- Guests may use AI with a stricter rate limit (conversation in `sessionStorage`); authenticated users get higher limits and persisted conversations. Rate limiting: Redis when configured, documented dev fallback otherwise; HTTP 429 with a friendly message.
- Provider failure never breaks the lesson page. Render responses as safe text, not active HTML.

## 23. SEARCH

Start with PostgreSQL search over subject, topic, lesson title/description/keywords (and experiments). Evaluate the `indonesian` text-search configuration; otherwise `simple` + `pg_trgm`. Public search returns only published content of active levels. Do not add Elasticsearch/OpenSearch until real scale, relevance, latency, or filtering needs justify it.

## 24. API RULES (TAD §20)

- Thin handlers: `parse → validate → authenticate → authorize → service → response`. Resource-oriented routes; admin mutations under `/api/admin/*`.
- Public: `GET /api/levels|subjects|topics/:slug|lessons|lessons/:slug|search`, `GET /api/quiz/questions`, `POST /api/quiz/check`, `POST /api/quiz/submit`, `POST /api/ai/chat`. Authenticated: `/api/progress`, `/api/favorites`, `/api/quiz/attempts[/:id]`. Admin: subjects, topics, lessons (+ `publish|unpublish|archive`, `PUT …/sources`), questions, sources, media.
- Response shapes: success `{ "data": {}, "meta": {} }`; error `{ "error": { "code": "VALIDATION_ERROR", "message": "Data yang dikirim belum valid." } }`. Stable error codes. **Never return stack traces, SQL, or ORM internals.**
- Zod-validate route params, query params, bodies, content blocks, interactive configs, quiz answers, admin mutations, and AI requests.
- Rate-limit sensitive endpoints (AI chat, quiz check/submit).

## 25. DATABASE RULES (TAD §8–§9)

Always: use Prisma; transactions for multi-record atomic operations; indexes for common queries; database constraints for invariants; select only needed fields; avoid N+1 queries.

Never: expose Prisma errors to users; trust client role or quiz score; store secrets in the DB; create unbounded relational queries.

Use transactions for: publishing a lesson, persisting a quiz attempt with answers, progress merge/migration, keeping denormalized lesson taxonomy consistent. Prefer database-level uniqueness (`EducationLevel.slug`, `User.email`, `Favorite`, `UserProgress`, `LessonSource`, `QuizAttemptAnswer`) and foreign keys for every relation.

New entity procedure: search first → ownership → relationships → unique constraints → indexes → lifecycle/status → soft-delete/archive need → authorization → migration → seed → repository/service → tests.

## 26. CACHING, REDIS, JOBS, STORAGE (TAD §22)

- Cache candidates: levels, subject/topic lists, published lesson metadata/content (Next.js caching/revalidation first; Redis if needed). Never cache user-specific responses globally. After create/update/publish/archive → invalidate relevant cache.
- Redis: cache, rate limiting, temporary state, future queues. **Not** the source of truth for durable progress; **not** mandatory for basic local development.
- BullMQ only for analytics aggregation, expensive recommendations, future AI indexing, notifications. Core lesson reading and quiz submission never depend on a worker.
- Storage: images, thumbnails, avatars, CMS media. YouTube embeds only for video.
- Recommendations (TAD §25) are deterministic rules in their own module — no ML, and never advertised as AI personalization.

## 27. SECURITY AND PRIVACY

Mandatory (TAD §21): server-side authorization on all admin routes/mutations; Zod validation; Prisma parameterized queries; rich-content sanitization; secure sessions; server-side AI secrets; rate limiting; validated uploads (type, size, content sniffing); **no arbitrary code execution through the CMS**; no production credentials in source.

Never expose: correct quiz answers before answering, draft/unpublished content, inactive-level content, internal prompts, AI keys, database errors.

Privacy (PRD NFR-06): collect the minimum; analytics must be purposeful; limit AI context; never log passwords, API keys, tokens, unnecessary private conversation content, or sensitive attributes. Learners include minors: Indonesian Personal Data Protection Law (UU No. 27/2022, Art. 25) requires special handling and parental/guardian consent for children's data. Do not add collection of student names, class membership, or per-student results without the privacy/consent decision (Phase 2 prerequisite). This is not legal advice — flag privacy-affecting changes in the handoff.

---

# PART E — STUDENT FRONTEND AND DESIGN BASE (Mode S)

The authority is `design-frontend.md`. This part states the rules that apply to **every** student-facing change, even if you did not open the full brief — but for Mode S tasks you must open the brief.

## 28. DESIGN BASE RULES

- **Direction:** light, optimistic, modern, content-first; smart but not stiff; friendly for a general audience (not childish-only, because later phases serve multiple levels). Not a corporate SaaS dashboard, dense enterprise tables, old-school school portal, or a page of identical white shadowed cards.
- **Light theme is the default.** Dark theme is not a target of this phase; new pages must not inherit a dark theme from references.
- **Tokens:** the design brief §2.2 gives the starting palette (background, surface, text, border, primary, accent, success, danger). **Audit and align existing tokens in `globals.css`/Tailwind config; never create a second token system.** Do not modify global tokens for a local feature unless intentional.
- **Color:** WCAG AA contrast where possible; never convey correct/wrong/progress by color alone; subject accent colors map to consistent tokens.
- **Typography:** reuse the project font if suitable; a consistent scale (display, page title, section title, card title, body, caption, label); limited weights; no pale gray; limit long-text line width — lesson pages favor readability over filling the screen.
- **Shape & elevation:** consistent radius (12–20 px for panels/cards, smaller for controls); subtle borders over heavy shadows; shadow only for truly floating layers (popover, drawer). One icon library, one style — no mixing outline/filled/emoji as UI icons. Use meaningful illustrations/mini diagrams; no random decorative images.
- **Spacing/layout:** a 4/8 spacing scale; centered max-width container; responsive grids (1 column phone, 2 tablet, 3+ desktop); no fixed widths that cause horizontal overflow; hierarchy *page intro → section → content → supporting action*.
- **Originality:** distinctive composition, visible interactive concept on the homepage (mini graph, geometry, science illustration), not stock photos.

If a new visual pattern repeats, add it to the design system instead of styling ad hoc. Avoid random colors, spacing, radii, typography, excessive shadows, and inconsistent buttons.

## 29. NAVIGATION AND PAGE COMPOSITION

Navigation behavior (TAD §14, PRD FR-18):

- Any subject reachable in **≤ 2 clicks** from the homepage; any lesson in **≤ 4**. From any lesson the learner can return to topic/subject in **≤ 2 actions**.
- Breadcrumbs on every learning page; search always reachable from the header; "Lanjutkan belajar" easy to find **only when real progress exists**.
- Desktop: light sticky-optional header with wordmark **IVE-APP**, subject mega menu (Subject → Topics), Lab, search (keyboard shortcut), Pembelajaran Saya, Masuk/avatar menu. Lesson page: collapsible outline tree (subject → topics → lessons), heading table of contents, prev/next within the topic.
- Mobile: compact header, full-screen menu for the mega menu, outline as a bottom drawer, optional bottom navigation (few items), filters in a sheet. Never merely squeeze the desktop nav into one row.
- Classroom-friendly (TAD §14.3): fullscreen interactive blocks, large readable type, no hover dependency, block-anchor deep links.

The page-to-spec map is in Section 34. Page-by-page composition (what each page contains, states, CTAs) is in **Design §4**; do not reinvent it.

## 30. LESSON, QUIZ, AND AI UI

**Lesson page (Design §4.6 — the most important page):**

- Two-column on wide screens (reading column + compact outline/progress panel), single column on mobile. Comfortable reading width; consistent block spacing; avoid walls of text — break into scannable sections with visuals only when they help understanding.
- Contents: title, summary, level/subject/topic, block renderer, **Sumber section**, "Tanya AI", mark-complete (per the existing progress model), prev/next, "Mulai latihan" when questions exist, informative fallback when a simulation fails to load.
- Interactive blocks look like integrated learning activities (not foreign embeds): title/context, instruction on what to try, proportionate visual area, labelled controls, result that reacts to input, reset, an explanation of the insight, fullscreen, mobile-adaptive layout, text fallback.

**Quiz UI (Design §4.7):** calm and focused, not a survey form. Question progress ("3 dari 8" when known), large tap targets, clear selected state, check/next per the existing flow, feedback with **text and explanation** (not color alone), result summary (score, correct count, review suggestion, per-question review), loading/error/retry on submit. `aria-live` for feedback. Never show a correct answer before the flow allows it.

**AI tutor UI (Design §7):** desktop right-side drawer or contextual panel that keeps the reading width intact; mobile full-height sheet with a clear close button and keyboard-safe input. Context label **"Sedang membahas: <judul materi>"**. Clearly distinguish user vs tutor messages; suggested prompts (e.g. "Jelaskan lebih sederhana", "Beri contoh lain", "Bantu saya memahami langkah ini"); empty, loading, error, retry, and rate-limit states; render formulas/lists when supported; never show keys or internal details; never promise instant answers.

**Content rendering (Design §11):** responsive images with caption/alt, accessible video with fallback, semantic callouts (info, hint, warning, key idea), locally scrollable wide tables, no active HTML from untrusted content.

**Motion (Design §8):** feedback only — hover/press, quiz answer state, drawer/dialog transitions, progress change, light reveals; 120–220 ms; no scroll-triggered animation of everything, parallax, neon/glow, or moving text. **Respect `prefers-reduced-motion`.** Framer Motion is the baseline library; use plain CSS for trivial feedback and do not add another animation library.

## 31. RESPONSIVE AND ACCESSIBILITY

Every new student-facing feature MUST be checked at: **320–375, 390–430, ~768, ~1280, ≥1440 px** (Design §9). Do not treat mobile as a later task.

Minimum: no unintended horizontal overflow; touch targets ≈ 44×44 CSS px for key controls; readable typography; modals/drawers scroll and size correctly; filters open/apply/close on mobile; keyboard-operable everything with visible focus; semantic HTML and logical heading hierarchy; every input labelled; alt text; dialog/drawer focus behavior and accessible names; `aria-live` used judiciously; **every interactive visualization has a textual explanation/fallback**; correct/wrong never by color alone.

Performance baseline for low-bandwidth targets (TAD §22): define and test a page-weight budget for lesson pages; lazy-load interactive components, images, and video embeds; verify text fallbacks without the interactive bundle.

## 32. STATES, NO DEAD UI, NO FAKE DATA

**Every data-driven page/feature needs all applicable states** (Design §10, TAD §30): loading (skeleton shaped like the final content, minimal layout shift), success, empty (explain + next step), error (retry), partial/missing metadata, guest vs authenticated.

Standard copy (centralize in one constants/i18n file):

| State | Copy |
|---|---|
| Error | "Ups, ada sedikit gangguan." + "Coba lagi" |
| Search empty | "Belum menemukan materi yang cocok." |
| AI unavailable | "Edu AI sedang tidak tersedia. Coba lagi sebentar." |
| Interactive unavailable | "Simulasi ini belum tersedia." + the textual explanation |

Never show raw exceptions, stack traces, `undefined`, `null`, or raw slugs.

**No dead UI.** Every visible control must navigate, submit, open a real interaction, update state, or trigger a real operation. Do not ship "Coming soon", TODO buttons, fake progress, fake locks, or fake AI, unless explicitly approved as a placeholder (Section 4 #10).

**No fake data in product flows.** Seed content is expected; fake UI facts are not. Do not display user counts, ratings, testimonials, satisfaction figures, effectiveness claims, "Populer" labels, 70% progress bars, or "10 menit" durations unless backed by real data or explicitly labelled demo data. Render metadata (duration, difficulty, level) only when it exists.

---

# PART F — PROCEDURES

## 33. GOLDEN RULE: SEARCH BEFORE CREATE

Before creating a component, hook, utility, API endpoint, service, repository, Prisma model, validation schema, CSS utility, modal, card, or form — **search the codebase first**:

```bash
rg "LessonCard" src
rg "ProgressBar" src
rg "useProgress" src
rg "getLesson" src
rg "ContentBlock" src
rg "InteractiveDefinition" src
rg "favorite" src
```

Reusable → **reuse**. Almost reusable → **generalize carefully**. Genuinely different → **create new**. Do not duplicate; do not keep two components with different names that do the same thing.

## 34. PAGE-TO-SPEC MAP

Use this table to find the contract for any student page. Read all three columns for the page you touch.

| Route | Access | TAD | PRD | Design brief |
|---|---|---|---|---|
| `/` | public | §14.2, §24 | FR-01 | §4.1 |
| `/explore` | public | §14, §17 | FR-14 | §4.2 |
| `/learn` → redirect `/learn/umum` · `/learn/umum` | public | §14.1, §24 | FR-02 | §4.3 |
| `/learn/:level/:subject` | public | §14.2 | FR-03 | §4.4 |
| `/learn/:level/:subject/:topic` | public | §14.2, §15.1 | FR-04 | §4.5 |
| `/learn/:level/:subject/:topic/:lesson` | public | §10, §11, §13, §14.3 | FR-05, FR-06, FR-07, FR-19 | §4.6, §6, §11 |
| `/quiz/:lesson` | public (persist if authed) | §15 | FR-08 | §4.7 |
| `/lab`, `/lab/:slug` | public | §4, §14.2 | FR-07.8 | §6 |
| `/search` | public | §17 | FR-14 | §4.8 |
| `/my-learning` | guest + authed | §15.3, §16 | FR-13 | §4.9 |
| `/login` (+ profile) | public | §19 | FR-10 | §4.10 |
| Tanya AI drawer/sheet | on lesson pages | §18 | FR-09 | §7 |
| `/admin/*` | ADMIN only | §12 | FR-16 | out of scope (Mode C) |

Inactive levels (`/learn/sd|smp|sma`) → 404 (TAD §24).

## 35. BEFORE CODING CHECKLIST

Answer internally before writing code:

```text
1. What exactly is requested, and which task mode (S/B/C/I)?
2. Which FR / TAD section / Design section governs it?
3. Which existing files implement related behavior?
4. Which domain module owns this feature?
5. Is there an existing component/service/schema to reuse?
6. Does it need a DB migration? An API change? Authorization?
7. Does it affect guest and authenticated users differently?
8. Does it affect level handling (active levels, 404 for inactive)?
9. Does it affect mobile and low-bandwidth use?
10. Which discrepancy-table rows apply?
11. Which tests change or get added?
12. What existing behavior could regress?
```

## 36. HOW TO ADD OR CHANGE A PAGE

Follow the page loop:

```text
Requirement → Route → Data contract → Service → UI components → Loading/error/empty → Responsive → Tests
```

Do not build the UI first and invent the backend later if the page depends on persistent data (but in Mode S, connect to existing data/functions; do not invent backend just for visuals).

Steps:

1. **Locate** the page in Section 34. If it is not there, it is a new route → treat it as a new menu item (Section 37).
2. **Read the three contracts**: TAD section, PRD FR, Design §4.x. Note acceptance criteria.
3. **Level handling:** the route includes `[level]`; read active levels from the DB; public queries filter `PUBLISHED` + active level; inactive level → 404; never hardcode `umum`.
4. **Data contract:** Zod schemas, service, repository. Compose the page from reusable components; render lesson content through `LessonContentRenderer` only.
5. **Design:** apply tokens/layout/container from Section 28; Indonesian copy; render metadata only when present; no invented stats.
6. **States:** loading skeleton, empty, error + retry, guest vs authenticated.
7. **Navigation integration:** breadcrumbs, outline/prev-next, click-depth rules (Section 29), nav labels from the constants file.
8. **SEO** for public pages: metadata, canonical URL, OpenGraph, title pattern from Section 4 #13; admin and inactive levels are not indexed.
9. **Analytics** only for meaningful product events, via the adapter.
10. **Responsive/accessibility** at all five viewport widths (Section 31).
11. **Tests:** unit for logic, integration for API/data, E2E if user-critical.
12. **Handoff** per Section 57, citing the FR/TAD/Design IDs.

Hidden "Segera hadir" tiles for inactive levels are **not** a default (Section 4 #10).

## 37. HOW TO CREATE A NEW MENU / ROUTE

Do not immediately add a link. First determine: what the menu represents; who can access it (PUBLIC / AUTHENTICATED / ADMIN); whether it has a dedicated route; what data it shows; mobile needs; SEO; analytics.

1. Define the route (existing slug conventions; TAD §24).
2. Define access level.
3. Add the page in the existing layout (Section 36).
4. Update desktop nav, mobile menu, bottom nav if relevant, breadcrumbs if relevant — labels from the constants file.
5. Add an **active state** (current route visually identifiable).
6. Add loading/error/empty states — never link to a page without usable state handling.
7. SEO if public; analytics if it is a meaningful action.
8. Test desktop, mobile, keyboard, direct URL, refresh, unauthorized access, authenticated access.

Routes outside the TAD list (e.g. `/practice`, `/experiments`) need explicit approval (Section 4 #8).

## 38. PACKAGE MANAGEMENT

Before installing a package: search existing dependencies → check whether native code solves it → check whether an existing package solves it → add the smallest dependency that works. Every new dependency has a **written reason** (in the PR/handoff; ADR if architectural). Do not install a library because an agent "usually uses it". A rich-text editor and an expression parser each require explicit justification (TAD §37 #8).

## 39. MINIMAL CHANGE AND NO REWRITES

Make the smallest coherent change: prefer 3 well-designed files changed over 25 unrelated files refactored. No opportunistic refactoring unless required for the task, it fixes a clear defect, it prevents duplication the task would introduce, or it is explicitly requested. Explain any larger refactor in the report.

Never replace working architecture because you prefer another style. Do **not**: replace Prisma, replace Next.js, replace the auth system casually, add Redux when React state works, replace the design system because another library looks nicer, or rewrite a whole module to add one feature. In Mode S specifically: audit first, reuse good components, change incrementally, and keep existing routes unless there is a clear reason.

## 40. TASK SIZE AND PLANNING

A good task produces a coherent increment ("Implement lesson progress API and repository", "Implement Projectile Simulator and unit tests"). Bad: "Improve the whole application." If a task is too large or crosses modes, split it. In Mode S, finish one page group until consistent and verified, then continue — never claim everything is done if it is not tested.

For changes touching ~5–10+ files or crossing domains, write a short plan first (schema → migration → repository → service → API → UI → tests → E2E), then implement.

## 41. WORK LOOP

```text
READ → INSPECT → PLAN → SEARCH → IMPLEMENT → TEST → REVIEW DIFF → FIX → REPORT
```

Do not jump from prompt to code. Implementation order for greenfield work (TAD §31): bootstrap → database → auth → core domain → content engine + sources → interactive engine → student UI + navigation → admin authoring track → admin interaction track → quiz → progress → AI → search/favorites → P1 items → SEO/performance/accessibility → tests → end-to-end polish.

Mode S workflow (Design §13): **A Audit** (read docs/repo, map existing routes, find design-system and reusable components, run the app, note what works and regresses) → **B Foundation** (light tokens, typography, layout wrapper, global nav) → **C Implement in order**: global shell + homepage → explore/search → level/subject/topic → lesson page + block presentation → interactive states → quiz flow/result → AI drawer → My Learning/login/profile → **D Polish** (responsive, all states, spacing/overflow, remove placeholders/dead links/fake data/duplicates) → **E Verify** (lint, typecheck, tests, build; E2E/smoke; console and network errors; five viewports; `git diff` stays in scope). P1 design work (profile depth, history details, transition polish) starts only after P0 is consistent and working.

## 42. WHEN TO ASK FOR CLARIFICATION

Ask only when ambiguity blocks safe implementation. Do **not** ask about anything reasonably inferable from AGENTS.md, the PRD/TAD/design brief, the existing code, the design system, or existing conventions.

Ask when: two requirements conflict and the discrepancy table has no default; a destructive migration is needed; product behavior cannot be safely inferred (see PRD §17 open decisions D-01…D-16 — never fill them with hidden assumptions); a decision changes architecture substantially; credentials/external infrastructure are required but absent. Otherwise make the smallest reasonable decision and document it.

## 43. MULTI-AGENT COORDINATION

Before starting, inspect `git status`, `git diff`, `git log -n 10`. Claim a scope (e.g. database / student lesson UI / quiz / interactive component) and do not modify another agent's domain unless necessary. Do not concurrently edit central files without need — global layout, Prisma schema, `package.json`, navigation, global CSS/tokens. When a central file must change, keep the change minimal and coordinate with the task owner. Do not overwrite another agent's work. Do not reformat unrelated files.

## 44. GIT AND CHANGE DISCIPLINE

Focused changes with conventional messages:

```text
feat: add lesson progress persistence
fix: prevent quiz answer leakage
refactor: extract lesson repository
test: add progress merge coverage
```

Avoid giant commits mixing a feature with unrelated redesign, dependency upgrades, or repository-wide formatting.

## 45. ENVIRONMENT VARIABLES

Secrets remain server-side. Only browser-safe values use `NEXT_PUBLIC_*`. Never expose `AI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, database-admin credentials, or storage secrets. Never commit `.env`. Maintain `.env.example` with safe placeholders (TAD §27):

```text
DATABASE_URL=  DIRECT_URL=  NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=  NEXT_PUBLIC_SUPABASE_ANON_KEY=  SUPABASE_SERVICE_ROLE_KEY=
AI_API_KEY=  AI_MODEL=  AI_BASE_URL=
REDIS_URL=
STORAGE_ENDPOINT=  STORAGE_BUCKET=  STORAGE_ACCESS_KEY=  STORAGE_SECRET_KEY=
ADMIN_EMAIL=  ADMIN_PASSWORD=
```

The README documents install → configure env → migrate → seed → run. Never hardcode production credentials.

## 46. OVER- AND UNDER-ENGINEERING

Avoid premature abstraction layers, generic factories, DI frameworks, event buses, service meshes, microservices, distributed transactions, and complex state machines. Use the simplest architecture that preserves future extension.

Do **not** simplify away: server-side authorization, validation, database constraints, error handling, tests of critical business logic, secure secret handling, content sanitization. "Just MVP" is no excuse for insecure foundations.

Future-proofing means clear interfaces, a stable data model, modular domains, extensible content blocks, and provider adapters. It does **not** mean building every future feature now.

Generated code must follow conventions, be typed, validated, readable, non-duplicative, lint/test-clean, and free of placeholder secrets. Never generate thousands of lines just because you can.

## 47. COMPONENT AND UI ARCHITECTURE

Three conceptual layers:

- **UI primitives:** Button, Card, Dialog, Input, Badge, Progress, Tabs…
- **Product components:** LessonCard, SubjectCard, QuizOption, AIChatDrawer, LearningPath, FavoriteButton, plus the educational components in Design §5.3 (learning path header, lesson progress state, content block wrapper, formula panel, figure panel, interactive activity frame, question card, answer option, feedback panel, quiz progress header, result summary, previous/next navigation).
- **Domain pages:** LessonPage, SubjectPage, TopicPage, QuizPage, AdminLessonPage…

Componentize only for reuse, clear domain meaning, isolated behavior, testability, or readability — not every small visual element. Avoid one giant component holding a whole page with many conditionals. All interaction states must be visible: default, hover, focus-visible, active, disabled, loading, error, success. Core functions must work by keyboard and touch, not hover alone. Props and variants have clear meaning.

## 48. PERFORMANCE RULES

Before optimizing: measure → identify bottleneck → fix → verify. No random caching or memoization. Practices: lazy-load interactive components and video embeds; optimize images; avoid unnecessary client components; avoid N+1; select only needed fields; server-render content where appropriate; keep client JavaScript minimal.

## 49. HANDLING CODE THAT DIFFERS FROM THE DOCUMENTS

The documents describe intended architecture; the repository describes current implementation. When they differ: (1) determine whether the difference is intentional; (2) preserve working behavior; (3) avoid unnecessary migration; (4) if migration is required, make it incremental; (5) update documentation after the architectural change. Never blindly force old architecture onto evolved code.

## 50. SCALING AND SERVICE EXTRACTION

Do not introduce microservices without a real reason (independent scaling, deployment, ownership, an infrastructure bottleneck, a clear domain boundary). Bad reasons: "more scalable", "large companies use them", "we may have millions of users someday". Extractable later (TAD §35): AI service, search service, quiz service, analytics pipeline, recommendation service. Extraction path: existing module → stable domain interface → adapter/API boundary → independent service; do not duplicate business logic between old and new; migrate incrementally. Scale stages: A MVP (single deployable) → B growing traffic (CDN, multiple instances, managed DB, Redis, worker) → C large platform (extract only high-load domains).

## 51. WHEN YOU DISCOVER A BETTER APPROACH

Do not silently replace architecture. If a document says A but B would be substantially better: decide whether B is a local implementation improvement (implement safely) or an architectural change (document the deviation, update the TAD/ADR if appropriate, flag it in the handoff).

## 52. DOCUMENTATION AND DECISION RECORDS

Update the relevant documentation when you change architecture, database model, API contract, environment variables, deployment, security model, or a major dependency. Implementation must not silently diverge from the documents. Add a short ADR for important architectural changes when the repo supports it (`docs/adr/NNNN-title.md`: Context · Decision · Alternatives · Consequences). No ADR for trivial choices.

---

# PART G — QUALITY GATES

## 53. TESTING PRIORITY

Not every line needs a test. Prioritize: quiz scoring and evaluation breakdown; progress merge; permissions (`authz`); publishing rules (including the **source requirement**); content-block and interactive-config validation; **expression evaluator including injection attempts**; physics/maths calculations; AI request boundaries; recommendation rules; slug utilities; critical user flows. Use pragmatic tests for presentational markup, not exhaustive snapshots.

Integration: lesson retrieval (inactive level excluded), quiz check/submit, attempt persistence, progress persistence, favorites, admin authorization, publish blocked without a source, source linking.

## 54. END-TO-END CRITICAL FLOWS (TAD §28, PRD §15)

```text
Learner A:  Homepage → Fisika → Gerak → Gerak Parabola → use simulator → view Sumber → open AI → ask → close AI
            → start Practice → finish Quiz → evaluation review → continue
Learner B:  Homepage → Matematika → Trigonometri → visualizer → change angle → quiz → result
Learner C:  Homepage → Biologi → Cell lesson → Cell Explorer → nucleus → mitochondria (explanation changes)
Learner D:  Homepage → Lab → open experiment → change parameters → fullscreen
Learner E:  Learn as guest → complete lessons → login → progress merges without lowering server progress → repeat merge, no duplicates
Learner F:  Formula Sandbox: change variables → chart/values update → trigger division by zero → clear message, page intact (when built)
Admin 1:    Login → dashboard → lessons → create → blocks → interactive + config + preview → sources → questions
            → draft → preview → publish → verify public lesson (drafts of others invisible)
Admin 2:    Attempt to publish without source → blocked with a clear message → add source → publish → Sumber visible
```

## 55. DEFINITION OF DONE AND QUALITY BAR

A feature is DONE only when: the UI works; the API/service works; validation exists; authorization exists where needed; loading, error, and empty states exist; mobile behavior works; tests cover important business logic; there are no dead buttons; no placeholder primary content; no avoidable console/runtime errors.

Verify before declaring completion:

```text
Does it work after refresh? On mobile? For an unauthenticated user if applicable?
Does authorization hold? Does the database state remain correct?
Does an error fail gracefully? Does loading look intentional?
Are there dead buttons, console errors, or duplicated components?
Is the level handled through data (inactive → 404), never hardcoded?
Did I accidentally change unrelated code (and for Mode S: did I leave /admin untouched)?
```

Performance review for data-heavy features: how many queries / any N+1 / cacheable or user-specific / pagination needed / indexes present / unnecessary fields or JavaScript / expensive UI lazy-loadable.

Security review for features touching data: can an unauthorized user access it; can a user change another user's data; can the client manipulate role or score; can the client inject HTML; can a CMS user execute code; can a request be unbounded; are secrets exposed; can the endpoint be abused repeatedly.

## 56. LOGGING, OBSERVABILITY, ERRORS

Errors must be safe, actionable, human-readable, and observable internally. Users see "Ups, ada sedikit gangguan. Coba lagi." Developer logs carry `requestId`, `route`, `errorCode`, stack, latency, and `userId`/`lessonId` where appropriate. Never log `AI_API_KEY`, passwords, auth tokens, or full private AI conversations. Watch error rate, latency, API/AI/database/queue failures, and client errors; new critical server flows produce useful error context when monitoring is configured. Analytics goes through the adapter and its failure never breaks the experience.

## 57. AGENT HANDOFF FORMAT

When finishing work, report factually (and show what a user can actually see and test, not just files changed):

```text
## Summary            What was implemented, citing IDs (e.g. FR-05, TAD §14, Design §4.6)
## Mode               S / B / C / I
## Files changed      Important files only
## Architecture       Any decision; any deviation from the documents
## Database           Migration/schema changes
## API                Endpoints added/changed
## Design system      Tokens/typography/layout/components changed (Mode S)
## Interactions       What works and which data source it uses
## Responsive & a11y  Viewports/keyboard/contrast actually verified
## Tests              What was run
## Validation         lint / typecheck / test / build result
## Discrepancies      Table rows (Section 4) applied; any new conflict found
## Known limitations  Anything intentionally incomplete; blockers needing backend/API/product decisions
## Scope              Mode S: confirm Admin CMS (/admin) was not touched
## Next step          Only if useful
```

Example:

```text
Summary: Implemented authenticated lesson progress persistence (FR-11, TAD §16).
Mode: B
Changed: src/modules/progress/*, src/app/api/progress/*, prisma/schema.prisma
Database: Added UserProgress unique constraint (userId, lessonId).
Tests: Unit pass · Integration pass · E2E not run
Discrepancies: none
Known limitation: Guest-to-cloud merge is implemented; conflict telemetry is not.
Next: Add E2E for login → lesson → refresh.
```

Do not hide issues that cannot be fixed because the API/data/backend is unavailable with mock data — document them.

## 58. FINAL AGENT SELF-REVIEW

Before saying "done", verify:

```text
[ ] I read AGENTS.md and the documents required by my task mode.
[ ] I inspected existing code and searched for reusable code.
[ ] I did not duplicate an existing feature.
[ ] I respected domain boundaries and the layering direction.
[ ] I protected secrets.
[ ] I added validation and handled authorization (server-side).
[ ] I handled loading/error/empty states.
[ ] I considered mobile (five viewports), low bandwidth, and accessibility.
[ ] I checked level handling (no hardcoded "umum"; inactive levels not exposed).
[ ] I kept sources mandatory (no publish/seed without a source).
[ ] I invented no fake data, no dead UI, no fake locks.
[ ] I used tokens/components from the design system (Mode S).
[ ] I added appropriate tests and ran them.
[ ] I reviewed my diff; I did not modify unrelated files (and did not touch /admin in Mode S).
[ ] I documented meaningful architectural changes and recorded discrepancies.
```

## 59. THE MOST IMPORTANT RULE

**Do not optimize for generating code. Optimize for improving the IVE-APP codebase and the learner's understanding.**

An agent succeeds when its changes make the product better, make the architecture clearer, preserve existing behavior, reduce future maintenance, and stay understandable to the next agent. When decisions compete, use the design brief's priority order (Design §16): 1) help the learner understand, 2) make interaction clear and easy to try, 3) readability and accessibility, 4) consistency with the IVE-APP design system, 5) small-screen responsiveness, 6) performance and stability, 7) decoration only when it supports the above. For architecture trade-offs use TAD §35: correctness → learning experience → data integrity → security → maintainability → performance → scalability → infrastructure sophistication.

A smaller, correct change is better than a larger, impressive-looking one.

## 60. IVE-APP ENGINEERING MANTRA

```text
Understand before changing.
Search before creating.
Reuse before duplicating.
Cite the spec before deciding.
Validate before trusting.
Source before publishing.
Measure before optimizing.
Test before declaring done.
Document before architectural drift.
Scale when needed, not when imagined.
```

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
## 13. ADDITIONAL AGENT RULES — GRAPHIFY, MINIMAL CODE, WORKLOOP, AND FINAL REPORT

Aturan berikut wajib dipatuhi selama seluruh proses pengerjaan task.

### 13.1 WORKLOOP — Read Existing Knowledge Before Coding

Sebelum mengubah atau menambahkan kode:

1. Baca `AGENTS.md` dan dokumen spesifikasi yang relevan.
2. Cari dan baca knowledge graph yang sudah dihasilkan menggunakan Graphify atau Graphify Out.
3. Periksa artefak Graphify yang benar-benar tersedia di working directory. Cari direktori, file indeks, graph output, ringkasan, dan referensi node/relasi yang relevan dengan task.
4. Gunakan knowledge graph untuk memahami hubungan antarfile, modul, fungsi, service, model, route, dan dependensi yang terkait.
5. Verifikasi informasi dari graph terhadap implementasi kode aktual. Knowledge graph membantu navigasi, tetapi tidak menggantikan pemeriksaan kode sumber.
6. Jika artefak Graphify tidak ditemukan, laporkan kondisi tersebut di kesimpulan. Jangan mengarang isi knowledge graph atau mengklaim sudah membacanya.

Jangan membuat ulang knowledge graph kecuali benar-benar diperlukan dan memang termasuk dalam ruang lingkup task.

Ikuti urutan kerja:

`READ DOCUMENTS → READ GRAPHIFY KNOWLEDGE → INSPECT CODE → IDENTIFY ROOT CAUSE → SEARCH EXISTING SOLUTIONS → PLAN MINIMAL CHANGE → IMPLEMENT → TEST → REVIEW DIFF → REPORT`

Jangan melewati tahap inspeksi hanya karena solusi terlihat sederhana.

### 13.2 No Assumptions and No Unrequested Features

- Jangan mengasumsikan arsitektur, struktur database, library, variabel environment, route, atau perilaku fitur yang belum diverifikasi.
- Jangan membuat fitur tambahan yang tidak diminta hanya karena dianggap berguna.
- Jangan mengubah struktur project, mengganti dependency, membuat abstraksi baru, atau melakukan refactor di luar kebutuhan task.
- Jangan mengganti implementasi yang sudah berfungsi tanpa bukti bahwa perubahan tersebut diperlukan.
- Gunakan PRD, TAD, `AGENTS.md`, design brief, knowledge graph, dan kode aktual sebagai dasar keputusan.
- Jika terdapat konflik, gunakan aturan resolusi konflik di `AGENTS.md`. Jangan mengambil keputusan arsitektural besar secara diam-diam.
- Jika suatu kebutuhan dapat dipenuhi dengan memperbaiki implementasi yang sudah ada, prioritaskan perbaikan tersebut daripada membuat implementasi baru.
- Jangan mengubah data atau status publikasi hanya untuk membuat UI terlihat benar. Verifikasi sumber masalahnya terlebih dahulu.

### 13.3 Minimal Code Generation and No Repeated Fixing

Setiap kode yang dibuat atau diubah harus memiliki alasan teknis yang jelas dan berhubungan langsung dengan task.

Sebelum menulis kode:
1. Cari implementasi, fungsi, komponen, schema, service, dan utility yang sudah tersedia.
2. Identifikasi akar masalah secara spesifik.
3. Tentukan perubahan minimum yang menyelesaikan masalah secara menyeluruh.
4. Periksa apakah perubahan yang direncanakan akan menduplikasi fungsi yang sudah ada.

Ketentuan implementasi:

- Jangan membuat file, komponen, fungsi, hook, service, schema, tipe, atau variabel baru jika tidak diperlukan.
- Jangan menghasilkan kode placeholder, dead code, fungsi kosong, atau fitur tambahan yang tidak diminta.
- Jangan meninggalkan variabel, import, parameter, state, fungsi, atau dependency yang tidak digunakan.
- Hindari `any`, type suppression, lint suppression, dan penghapusan validasi hanya untuk membuat build lolos. Gunakan hanya jika benar-benar beralasan dan sesuai konvensi project.
- Jangan menyalin business logic yang sama ke beberapa tempat.
- Gunakan service, repository, authorization helper, content renderer, dan komponen yang sudah tersedia jika sesuai.
- Pertahankan kompatibilitas dengan kontrak data, Prisma schema, API, dan desain yang sudah ada.
- Jangan mematikan test, mengabaikan error, atau menurunkan pemeriksaan TypeScript/ESLint untuk menyamarkan masalah.
- Jangan melakukan perubahan berulang pada file yang sama tanpa memahami penyebab kegagalan sebelumnya.

Jika implementasi pertama gagal:
1. Baca error lengkap dan identifikasi penyebabnya.
2. Periksa perubahan yang baru dilakukan dan dependensi terkait.
3. Tentukan apakah masalah berasal dari kode baru, implementasi lama, konfigurasi, atau environment.
4. Perbaiki akar masalah dengan perubahan sekecil mungkin.
5. Jalankan kembali pemeriksaan yang relevan untuk membuktikan hasilnya.

Jangan melakukan pola coba-coba, menambahkan workaround bertumpuk, atau mengulang perubahan yang sama tanpa diagnosis baru.

Sebelum menyelesaikan task, review seluruh diff dan hapus perubahan yang tidak diperlukan, import/variabel yang tidak terpakai, serta debugging code yang tidak seharusnya dipertahankan.

### 13.4 No Progress Narration

Selama proses pengerjaan, jangan mengirimkan laporan progres, narasi aktivitas, atau penjelasan berulang seperti:

- "Saya sedang memeriksa file."
- "Saya akan mulai memperbaiki."
- "Sekarang saya mengubah komponen."
- "Saya sedang menjalankan test."

Lakukan pekerjaan secara langsung menggunakan tool dan working directory yang tersedia.

Komunikasi berbentuk teks kepada pengguna diberikan **pada akhir pengerjaan dalam satu laporan kesimpulan**, bukan melalui pembaruan progres berkala.

Pengecualian hanya jika terdapat keputusan yang benar-benar menghalangi pengerjaan aman, misalnya membutuhkan persetujuan untuk operasi destruktif, perubahan arsitektur besar, atau akses environment yang tidak tersedia. Dalam kondisi tersebut, tanyakan hal yang diperlukan saja.

### 13.5 Final Report — Required Format

Setelah seluruh pekerjaan yang dapat dilakukan selesai, berikan satu laporan akhir yang ringkas, faktual, dan berdasarkan hasil verifikasi.

Gunakan format berikut:

#### 1. Kesimpulan
Ringkasan hasil akhir pengerjaan dan kondisi implementasi saat ini.

#### 2. Hasil Pengerjaan
Tuliskan perbaikan yang benar-benar berhasil dilakukan dan diverifikasi.

#### 3. File yang Diubah
Daftar file yang benar-benar dibuat, diubah, atau dihapus, beserta alasan singkat perubahannya.

Jika tidak ada file yang diubah, tulis `-`.

#### 4. Fitur dari Plan yang Berhasil Diimplementasikan
Daftar fitur atau acceptance criteria dari task yang sudah berhasil diimplementasikan dan diuji.

Jika tidak ada, tulis `-`.

#### 5. Fitur atau Pekerjaan yang Gagal / Belum Selesai
Tuliskan hanya item yang memang gagal atau belum selesai, disertai alasan spesifik, dampak, dan langkah lanjutan yang diperlukan.

Jika tidak ada, tulis `-`.

#### 6. Hasil Verifikasi
Cantumkan pemeriksaan yang benar-benar dijalankan beserta hasilnya, misalnya:
- Prisma schema validation.
- Status migration.
- Prisma Client generation.
- Seeder execution.
- Lint dan TypeScript.
- Unit/integration/E2E test yang relevan.
- Build.
- Pengujian autentikasi dan RBAC.
- Pengujian data materi CMS ke frontend.
- Review Git diff dan unused code.

Jangan mencantumkan pemeriksaan yang tidak dijalankan. Jika suatu pemeriksaan tidak dapat dilakukan, jelaskan alasannya pada bagian pekerjaan yang belum selesai.

#### 7. Graphify Knowledge
Sebutkan apakah knowledge graph ditemukan dan dibaca. Jika ditemukan, sebutkan artefak relevan yang benar-benar digunakan. Jika tidak ditemukan, tulis alasan singkat.

### 13.6 Reporting Integrity

- Jangan mengklaim fitur berhasil hanya karena kode sudah ditulis.
- Bedakan antara implementasi, test yang lulus, dan perilaku yang benar-benar diuji.
- Jangan menyatakan migration berhasil jika hanya schema validation atau Prisma Client generation yang berhasil.
- Jangan menyatakan integrasi CMS–frontend berhasil jika data belum diverifikasi dari database sampai ke tampilan publik.
- Jangan menyembunyikan error, test gagal, keterbatasan environment, atau task yang belum selesai.
- Jangan mencantumkan fitur yang tidak diminta sebagai keberhasilan task.
- Gunakan tanda `-` untuk bagian yang memang tidak memiliki item, bukan membuat pekerjaan atau masalah fiktif.

**Prioritas akhir: correctness, minimal changes, keamanan, konsistensi dengan arsitektur, dan hasil yang terverifikasi — bukan jumlah file atau banyaknya kode yang dihasilkan.**

# END OF AGENTS.md
