# AGENTS.md
# Visedin — Visual Education Interactive
# AI Agent Engineering & Development Constitution

> **Purpose:** This file is the persistent engineering contract for every AI coding agent working on Visedin.
>
> **Product name:** Visedin — Visual Education Interactive
>
> **Primary reference:** `EduSpark_TAD_Phase_1.md` and the original product requirements supplied with this project.
>
> **Important:** The product name has changed from EduSpark to Visedin. Existing architecture and requirements remain the baseline unless a newer project decision explicitly supersedes them.

---

# 0. READ THIS FIRST

Before modifying any code, every agent MUST:

1. Read this `AGENTS.md`.
2. Read `EduSpark_TAD_Phase_1.md` if present.
3. Inspect the existing repository structure.
4. Inspect the relevant implementation before creating new files.
5. Search for existing components, services, hooks, utilities, schemas, routes, and database models that solve the same problem.
6. Determine whether the requested feature already exists partially.
7. Make the smallest coherent change that satisfies the task.
8. Run relevant validation/tests before reporting completion.

Never assume the repository is empty or matches the initial architecture exactly.

**The current codebase is the source of truth for implementation state.**

The TAD is the architectural baseline.

This file is the agent behavior contract.

If they conflict because the codebase has intentionally evolved, preserve the current working architecture unless the task explicitly requests architectural migration.

---

# 1. PROJECT IDENTITY

## 1.1 Product

**Visedin — Visual Education Interactive**

Visedin is an Indonesian interactive education platform designed to make learning:

- visual
- interactive
- modern
- understandable
- engaging
- progress-oriented

The product is not intended to be a traditional school administration website.

The core experience is:

```text
DISCOVER
   ↓
LEARN
   ↓
INTERACT
   ↓
PRACTICE
   ↓
ASK AI
   ↓
COMPLETE
   ↓
CONTINUE
```

---

# 2. PRODUCT PRINCIPLES

Every engineering decision should support these principles.

## 2.1 Learning first

Student learning experience has higher priority than CMS complexity.

## 2.2 Interactive by design

Where a concept benefits from visualization or simulation, prefer an interactive learning experience over a static presentation.

## 2.3 Content is data

Educational content MUST NOT be tightly hardcoded into page components.

Content should be represented by structured data and rendered through reusable systems.

## 2.4 Components are reusable

If two pages need substantially the same UI or behavior, create/reuse a component instead of duplicating code.

## 2.5 Progressive complexity

Do not build advanced infrastructure before the product needs it.

Prefer:

```text
Modular Monolith
        ↓
Horizontal Scaling
        ↓
Targeted Service Extraction
```

over:

```text
Microservices everywhere from day one
```

## 2.6 Original product identity

Do not copy another education platform's:

- branding
- logo
- illustrations
- proprietary visual identity
- exact UI
- proprietary content

Learn from general UX principles only.

---

# 3. ARCHITECTURAL NORTH STAR

The default architecture is:

```text
                    Visedin
                       │
                  Next.js App
                       │
       ┌───────────────┼────────────────┐
       │               │                │
   Student UI       Admin UI        API / Actions
       │               │                │
       └───────────────┼────────────────┘
                       │
                Application Layer
                       │
       ┌───────────────┼────────────────────┐
       │               │                    │
    Learning         Quiz                  AI
       │               │                    │
   Progress        Favorites             Search
       │               │                    │
       └───────────────┼────────────────────┘
                       │
                 Repository Layer
                       │
       ┌───────────────┼────────────────────┐
       │               │                    │
 PostgreSQL          Redis            Object Storage
       │
    pgvector
```

---

# 4. TECHNOLOGY BASELINE

Unless the repository contains an intentional, documented alternative, prefer:

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

## Backend

- Next.js Route Handlers
- Server Actions where appropriate
- domain/application services

## Database

- PostgreSQL
- Prisma

## Authentication

- Supabase Auth

## Validation

- Zod

## Cache / rate limiting

- Redis

## Background jobs

- BullMQ when actually needed

## Storage

- S3-compatible object storage / Cloudflare R2 / Supabase Storage

## AI

- provider-agnostic OpenAI-compatible adapter
- server-side only

## Math

- KaTeX

## Testing

- Vitest
- React Testing Library
- Playwright

## Observability

- Sentry-compatible error monitoring
- structured logs

Do not add a new framework merely because it is fashionable.

---

# 5. CODEBASE OWNERSHIP MODEL

The codebase is organized around domains, not around individual agents.

Recommended structure:

```text
src/
├── app/
├── components/
├── modules/
├── lib/
├── server/
├── prisma/
└── tests/
```

Domain modules may include:

```text
modules/
├── levels/
├── subjects/
├── topics/
├── lessons/
├── content/
├── quiz/
├── progress/
├── favorites/
├── search/
├── ai/
├── recommendations/
└── analytics/
```

Agents may add modules when a real domain boundary exists.

Do not create modules for trivial UI-only concerns.

---

# 6. GOLDEN RULE: SEARCH BEFORE CREATE

Before creating:

- component
- hook
- utility
- API endpoint
- service
- repository
- database model
- validation schema
- CSS utility
- modal
- card
- form

SEARCH THE CODEBASE FIRST.

Examples:

```bash
rg "LessonCard" src
rg "ProgressBar" src
rg "useProgress" src
rg "getLesson" src
rg "ContentBlock" src
rg "favorite" src
```

If an existing implementation is reusable:

**reuse it.**

If it is almost reusable:

**generalize it carefully.**

If it is genuinely different:

**create a new implementation.**

Do not duplicate existing functionality.

---

# 7. BEFORE CODING CHECKLIST

Every agent should answer internally:

```text
1. What exactly is being requested?
2. Which existing files implement related behavior?
3. Which domain owns this feature?
4. Is there an existing component/service/schema?
5. Does this require a DB migration?
6. Does this require an API change?
7. Does this require authorization?
8. Does this affect guest and authenticated users?
9. Does this affect mobile?
10. What tests need to change/add?
11. What existing behavior could regress?
```

Only then begin implementation.

---

# 8. MINIMAL CHANGE PRINCIPLE

Agents should make the smallest coherent change.

Prefer:

```text
3 well-designed files changed
```

over:

```text
25 unrelated files refactored
```

Do not perform opportunistic refactoring unless:

- required for the task
- fixes a clear defect
- prevents duplication introduced by the task
- is explicitly requested

If a larger refactor is necessary, explain it in the final report.

---

# 9. DO NOT REWRITE WORKING CODE

Never replace working architecture simply because you prefer another style.

Examples:

Do NOT:

- replace Prisma with another ORM without explicit approval
- replace Next.js with another framework
- replace the authentication system casually
- introduce Redux when React state already works
- replace the design system because another library looks nicer
- rewrite a complete module to add one feature

Preserve compatibility unless migration is the actual task.

---

# 10. DOMAIN BOUNDARIES

Business logic belongs in domain/application services.

Preferred:

```text
Route Handler
   ↓
Validation
   ↓
Authorization
   ↓
Service
   ↓
Repository
   ↓
Database
```

Avoid:

```text
Route Handler
   ├── 200 lines of business logic
   ├── Prisma queries
   ├── scoring
   ├── authorization
   └── formatting
```

Avoid:

```text
React Component
   └── direct Prisma/database logic
```

---

# 11. UI ARCHITECTURE

Use three conceptual layers.

## UI primitives

Examples:

```text
Button
Card
Dialog
Input
Badge
Progress
Tabs
```

## Product components

Examples:

```text
LessonCard
SubjectCard
QuizOption
AIChatDrawer
LearningPath
FavoriteButton
```

## Domain pages

Examples:

```text
LessonPage
SubjectPage
TopicPage
QuizPage
AdminLessonPage
```

Do not turn every small visual element into a component.

Componentize when it provides:

- reuse
- clear domain meaning
- isolated behavior
- testability
- readability

---

# 12. HOW TO CREATE A NEW MENU

When asked to create a new navigation menu, DO NOT immediately create a link.

First determine:

```text
What does the menu represent?
Who can access it?
Does it have a dedicated route?
What data does it show?
Is it public/authenticated/admin?
Does it require mobile navigation?
Does it need SEO?
Does it need analytics?
```

## 12.1 Standard procedure

### Step 1 — Define route

Example:

```text
/new-feature
```

or:

```text
/learn/sma/new-feature
```

Use existing routing conventions.

### Step 2 — Define authorization

Possible:

```text
PUBLIC
AUTHENTICATED
ADMIN
```

### Step 3 — Add page

Create page using existing layout.

### Step 4 — Add navigation item

Update:

- desktop navigation
- mobile menu
- mobile bottom navigation if relevant
- breadcrumbs if relevant

### Step 5 — Add active state

The current route must be visually identifiable.

### Step 6 — Add loading/error states

Do not create a menu pointing to a page that has no usable state handling.

### Step 7 — Add SEO if public

### Step 8 — Add analytics if the menu represents a meaningful product action

### Step 9 — Test

Verify:

- desktop
- mobile
- keyboard
- direct URL
- refresh
- unauthorized access
- authenticated access where relevant

---

# 13. HOW TO ADD A NEW PAGE

Follow:

```text
Requirement
   ↓
Route
   ↓
Data contract
   ↓
Service
   ↓
UI components
   ↓
Loading/error/empty
   ↓
Responsive
   ↓
Tests
```

Do not build the UI first and invent the backend later if the page depends on persistent data.

---

# 14. HOW TO ADD A NEW DATABASE ENTITY

Before adding a Prisma model:

1. Search whether the concept already exists.
2. Determine ownership.
3. Define relationships.
4. Define uniqueness constraints.
5. Define indexes.
6. Determine lifecycle/status.
7. Determine whether soft deletion/archive is needed.
8. Determine authorization.
9. Define migration.
10. Update seed data if necessary.
11. Update repository/service.
12. Add tests.

Every persistent entity should have a clear reason to exist.

---

# 15. DATABASE RULES

## Always

- use Prisma
- use transactions for multi-record atomic operations
- use indexes for common queries
- use database constraints for invariants
- select only necessary fields where practical
- avoid N+1 queries

## Never

- expose Prisma errors directly to users
- trust client-side role
- trust client-side quiz scoring
- store secrets in the database unless explicitly designed for secret storage
- create unbounded relational queries

---

# 16. CONTENT ARCHITECTURE

Educational content is a core product asset.

Content hierarchy:

```text
Education Level
    ↓
Subject
    ↓
Topic
    ↓
Lesson
    ↓
Content Blocks
    ↓
Questions
```

Content blocks should remain structured.

Supported types:

```text
heading
text
image
video
formula
callout
example
interactive
quiz
divider
```

Unknown block types must fail gracefully.

---

# 17. CONTENT BLOCK RULES

When adding a new content block:

1. Define a stable block type.
2. Define its Zod schema.
3. Define its TypeScript type.
4. Add renderer.
5. Add editor UI if admin-editable.
6. Add preview behavior.
7. Add fallback behavior.
8. Add tests.
9. Document the block configuration.

Do not put arbitrary executable code inside content JSON.

---

# 18. INTERACTIVE ENGINE RULES

Interactive experiences are a core differentiator.

Use a registry.

Example:

```text
InteractiveRegistry
├── projectile-simulator
├── trigonometry-visualizer
├── cell-explorer
├── atom-explorer
└── history-timeline
```

CMS stores:

```text
component key
+
validated config
```

CMS MUST NOT execute arbitrary JavaScript supplied by an administrator.

New interactive component procedure:

```text
1. Define component contract
2. Define config schema
3. Add registry entry
4. Implement component
5. Add mobile behavior
6. Add textual fallback
7. Add accessibility
8. Add tests
9. Add CMS selector/configuration
10. Add seed/demo content
```

---

# 19. QUIZ RULES

Quiz correctness is server-authoritative.

Never trust:

```text
client score
client correct answer
client total score
```

Server must derive correctness from database truth.

When adding a new question type:

1. Define type contract.
2. Define validation.
3. Define answer submission format.
4. Define server scoring.
5. Define feedback.
6. Define result calculation.
7. Add UI.
8. Add tests.
9. Verify accessibility.

Do not expand quiz complexity unless the product needs it.

---

# 20. PROGRESS RULES

Guest:

```text
localStorage
```

Authenticated:

```text
PostgreSQL
```

Guest-to-user migration must be safe and idempotent.

Never overwrite better server progress with worse local progress.

Completion:

```text
completed = true
progress = 100
```

unless explicit product configuration changes that rule.

---

# 21. AUTHENTICATION RULES

Browsing lessons should remain possible without login where product requirements allow.

Login is useful for:

- cloud progress
- history
- favorites
- persistent AI conversations

Authorization must be checked server-side.

Never do:

```typescript
if (user.role === "admin") {
  // client-only protection
}
```

and consider that sufficient.

Use server-side authorization for every admin mutation.

---

# 22. ADMIN RULES

Admin functionality is secondary to student learning.

CMS should remain simple.

Admin actions:

- create
- edit
- archive/delete where appropriate
- preview
- publish
- unpublish

Destructive actions require confirmation.

Published educational content should generally prefer archive over destructive deletion.

---

# 23. API RULES

Route handlers should be thin.

Preferred:

```text
parse
→ validate
→ authenticate
→ authorize
→ service
→ response
```

Do not place business logic directly in handlers.

API errors should use stable codes.

Example:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data yang dikirim belum valid."
  }
}
```

Never return stack traces.

---

# 24. API NAMING

Prefer resource-oriented routes.

Examples:

```text
GET /api/levels
GET /api/subjects
GET /api/topics/:slug
GET /api/lessons/:slug
GET /api/search

GET /api/progress
POST /api/progress

POST /api/favorites
DELETE /api/favorites/:lessonId

POST /api/quiz/submit
POST /api/ai/chat
```

Admin mutations stay under:

```text
/api/admin/*
```

unless the existing architecture intentionally uses another convention.

---

# 25. AI DEVELOPMENT RULES

AI calls MUST happen server-side.

Never expose:

```text
AI_API_KEY
provider secret
system prompt
private internal context
```

The AI module should have:

```text
AI Service
   ↓
Context Builder
   ↓
Provider Adapter
```

Do not couple UI directly to a vendor SDK.

Use an interface:

```typescript
interface AIProvider {
  streamChat(input: AIChatInput): AsyncIterable<AIChunk>;
}
```

This enables future provider changes.

---

# 26. AI CONTEXT RULES

AI context should be bounded.

Include relevant:

- education level
- subject
- topic
- lesson title
- lesson description
- lesson content
- relevant conversation history

Do not dump the entire database into the prompt.

AI should prioritize current lesson context.

AI errors must not break lesson pages.

---

# 27. SEARCH RULES

Start with PostgreSQL search.

Do not add Elasticsearch/OpenSearch merely because search exists.

Upgrade search only when actual:

- scale
- relevance
- latency
- filtering
- indexing

requirements justify it.

---

# 28. REDIS RULES

Use Redis for:

- cache
- rate limiting
- temporary state
- queues

Do not use Redis as the source of truth for durable educational progress.

PostgreSQL remains authoritative for durable data.

---

# 29. CACHING RULES

Good cache candidates:

- public lesson content
- subjects
- topics
- education levels
- published metadata

Do not accidentally cache private/user-specific responses globally.

After content mutation:

```text
create/update/publish
→ invalidate relevant cache
```

---

# 30. PERFORMANCE RULES

Before optimizing:

1. Measure.
2. Identify bottleneck.
3. Fix bottleneck.
4. Verify improvement.

Do not add random caching or memoization everywhere.

Important practices:

- lazy-load interactive components
- optimize images
- avoid unnecessary client components
- avoid N+1 queries
- select necessary database fields
- use server rendering for content where appropriate
- lazy-load video embeds

---

# 31. RESPONSIVE RULES

Every new student-facing feature MUST be checked at:

```text
mobile
tablet
desktop
```

Minimum expectations:

- no horizontal overflow
- touch-friendly controls
- readable typography
- accessible tap targets
- usable keyboard navigation
- responsive interactive simulations

Do not treat mobile as a later task.

---

# 32. ACCESSIBILITY RULES

Use:

- semantic HTML
- proper labels
- heading hierarchy
- keyboard navigation
- visible focus
- accessible buttons
- alt text
- sufficient contrast

Interactive visualizations need a textual explanation/fallback.

Do not communicate important information through color alone.

---

# 33. ERROR / LOADING / EMPTY STATES

Every asynchronous feature needs all applicable states:

```text
loading
success
empty
error
```

Examples:

Loading:

```text
skeleton
```

Error:

```text
Ups, ada sedikit gangguan.
Coba lagi.
```

Search empty:

```text
Belum menemukan materi yang cocok.
```

AI:

```text
Edu AI sedang tidak tersedia.
Coba lagi sebentar.
```

Never show raw exceptions to users.

---

# 34. NO DEAD UI

Every visible action must work.

A button must:

- navigate
- submit
- open a real interaction
- update state
- trigger a real operation

Do not ship:

```text
Coming soon
TODO button
fake progress
fake lock
fake AI
```

unless clearly marked as a non-functional product placeholder and explicitly approved.

---

# 35. NO FAKE DATA IN PRODUCT FLOWS

Seed data is expected.

Fake UI statistics are not.

For example, do not display:

```text
1,240 students
98% satisfaction
50,000 learners
```

unless backed by real data or explicitly labeled demo data.

---

# 36. DESIGN SYSTEM RULES

Use existing design tokens/components before creating new styles.

Avoid:

- random colors
- random spacing
- random border radii
- arbitrary typography
- excessive shadows
- inconsistent buttons

If a new visual pattern repeats, add it to the design system.

Do not modify global design tokens for a local feature unless the change is intentional.

---

# 37. ANIMATION RULES

Use Framer Motion where useful.

Good:

- card hover
- button feedback
- progress animation
- quiz feedback
- AI typing
- subtle transitions

Avoid:

- excessive page animation
- distracting loops
- animation that blocks learning
- animation that causes accessibility problems

Respect reduced-motion preferences where practical.

---

# 38. PACKAGE MANAGEMENT

Before installing a package:

1. Search existing dependencies.
2. Determine whether native code can solve it.
3. Determine whether an existing package already solves it.
4. Add the smallest dependency that meets the requirement.

Every new dependency should have a clear reason.

Do not install libraries simply because an agent "usually uses" them.

---

# 39. ENVIRONMENT VARIABLES

Secrets MUST remain server-side.

Public values may use:

```text
NEXT_PUBLIC_*
```

Never expose:

```text
AI_API_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_ADMIN_SECRET
STORAGE_SECRET
```

Do not commit `.env`.

Maintain:

```text
.env.example
```

with safe placeholders.

---

# 40. GIT / CHANGE DISCIPLINE

Agents should produce focused changes.

Prefer:

```text
feat: add lesson progress persistence
fix: prevent quiz answer leakage
refactor: extract lesson repository
test: add progress merge coverage
```

Avoid giant commits mixing:

```text
feature
+ unrelated redesign
+ dependency upgrade
+ formatting entire repository
```

Do not reformat unrelated files.

Do not overwrite another agent's work.

---

# 41. MULTI-AGENT COORDINATION

When multiple agents work simultaneously:

## Before starting

Inspect:

```bash
git status
git diff
git log -n 10
```

Understand current work.

## Claim a scope

Examples:

```text
Agent A → database
Agent B → student lesson UI
Agent C → quiz
Agent D → interactive component
```

Do not modify another agent's domain unless necessary.

## Avoid conflicts

Do not concurrently edit the same central files unnecessarily:

- global layout
- Prisma schema
- package.json
- navigation
- global CSS

If a central file must change, keep the change minimal and coordinate with the task owner.

---

# 42. AGENT TASK SIZE

A good task should produce a coherent increment.

Good:

```text
Implement lesson progress API and repository.
```

Good:

```text
Implement Projectile Simulator component and unit tests.
```

Bad:

```text
Improve the whole application.
```

Bad:

```text
Make everything better.
```

If a task is too large, split it.

---

# 43. AGENT WORK LOOP

Every agent should follow:

```text
READ
 ↓
INSPECT
 ↓
PLAN
 ↓
SEARCH
 ↓
IMPLEMENT
 ↓
TEST
 ↓
REVIEW DIFF
 ↓
FIX
 ↓
REPORT
```

Do not jump directly from prompt to code.

---

# 44. PLAN BEFORE LARGE CHANGES

For changes involving more than approximately 5–10 files or crossing domains:

Write a short implementation plan first.

Example:

```text
Plan:
1. Add schema
2. Add migration
3. Add repository
4. Add service
5. Add API
6. Add UI
7. Add tests
8. Run E2E
```

Then implement.

---

# 45. WHEN TO ASK FOR CLARIFICATION

Ask only when ambiguity blocks safe implementation.

Do NOT ask about things that can be reasonably inferred from:

- AGENTS.md
- TAD
- existing code
- existing design system
- existing conventions

Ask when:

- two requirements conflict
- destructive migration is required
- product behavior cannot be safely inferred
- a decision changes architecture substantially
- credentials/external infrastructure are required but absent

Otherwise make the smallest reasonable decision and document it.

---

# 46. HANDLING EXISTING CODE THAT DIFFERS FROM TAD

The TAD describes intended architecture.

The repository describes current implementation.

When they differ:

```text
1. Determine whether difference is intentional.
2. Preserve working behavior.
3. Avoid unnecessary migration.
4. If migration is required, make it incremental.
5. Update documentation after architectural change.
```

Never blindly force old architecture onto evolved code.

---

# 47. PHASE MODEL

Visedin should evolve in phases.

## Phase 1 — Foundation

Focus:

- core learning hierarchy
- database
- authentication
- lesson engine
- content blocks
- interactive engine
- quiz
- progress
- AI
- search
- favorites
- simple CMS

## Phase 2 — Product Depth

Potential:

- richer content editor
- adaptive quiz behavior
- stronger recommendations
- improved AI tutor
- content analytics
- richer interactive experiences
- teacher/content-author workflows

## Phase 3 — Scale

Potential:

- horizontal scaling
- background workers
- stronger caching
- dedicated search infrastructure
- AI service extraction
- analytics pipeline
- CDN/media optimization

## Phase 4 — Platform

Potential:

- teacher accounts
- personalized learning
- adaptive learning
- achievements
- certificates
- mobile applications
- advanced AI learning orchestration

Features are NOT automatically approved merely because they appear in this roadmap.

---

# 48. SCALING PRINCIPLE

Do not introduce microservices until there is a real reason.

Good reasons:

- independent scaling
- independent deployment
- independent ownership
- infrastructure bottleneck
- clear domain boundary

Bad reasons:

- "microservices are more scalable"
- "large companies use them"
- "we may have millions of users someday"

Start:

```text
Modular Monolith
```

Then extract only what needs extraction.

---

# 49. SERVICE EXTRACTION RULE

When extracting a service:

```text
Existing module
      ↓
Stable domain interface
      ↓
Adapter / API boundary
      ↓
Independent service
```

Do not duplicate business logic between old and new services.

Migration should be incremental.

---

# 50. CONTENT SCALABILITY

The product should be able to grow from:

```text
40 lessons
```

to:

```text
hundreds
→ thousands
→ tens of thousands
```

without requiring page component rewrites.

Therefore:

- content comes from DB
- lesson renderer is reusable
- block types are extensible
- interactive registry is extensible
- taxonomy is data-driven
- CMS creates content through structured blocks

---

# 51. FEATURE DEVELOPMENT TEMPLATE

When implementing a new feature, follow:

## Requirement

Describe user-visible behavior.

## Domain

Identify owning module.

## Data

Determine whether new persistence is needed.

## API

Determine endpoint/service contract.

## UI

Reuse existing components.

## State

Determine server/client state.

## Authorization

Determine access level.

## Loading/Error/Empty

Implement applicable states.

## Accessibility

Verify keyboard/labels/focus.

## Analytics

Track only meaningful product events.

## Tests

Add unit/integration/E2E as appropriate.

## Documentation

Update relevant docs if architecture changes.

---

# 52. NEW FEATURE CHECKLIST

```text
[ ] Requirement understood
[ ] Existing implementation searched
[ ] Correct domain identified
[ ] Reusable components searched
[ ] Data model reviewed
[ ] API contract reviewed
[ ] Auth requirements reviewed
[ ] Mobile behavior planned
[ ] Loading state
[ ] Error state
[ ] Empty state
[ ] Accessibility
[ ] Analytics if meaningful
[ ] Unit tests
[ ] Integration tests if needed
[ ] E2E if user-critical
[ ] Diff reviewed
[ ] No unrelated changes
```

---

# 53. NEW MENU CHECKLIST

```text
[ ] Route defined
[ ] Access level defined
[ ] Desktop navigation updated
[ ] Mobile navigation updated
[ ] Active state
[ ] Page implemented
[ ] Loading state
[ ] Error state
[ ] Empty state
[ ] SEO if public
[ ] Analytics if appropriate
[ ] Direct URL works
[ ] Refresh works
[ ] Mobile tested
[ ] Unauthorized access tested
```

---

# 54. NEW INTERACTIVE CHECKLIST

```text
[ ] Component contract
[ ] Config schema
[ ] Registry entry
[ ] Responsive layout
[ ] Touch interaction
[ ] Keyboard/accessibility
[ ] Text fallback
[ ] Loading state if async
[ ] Error state if async
[ ] Unit tests
[ ] Visual/manual test
[ ] CMS integration
[ ] Seed/example usage
```

---

# 55. NEW API CHECKLIST

```text
[ ] Route naming follows convention
[ ] Request schema
[ ] Response type
[ ] Authentication
[ ] Authorization
[ ] Service layer
[ ] Repository if needed
[ ] Error mapping
[ ] Rate limiting if sensitive
[ ] Tests
[ ] No secrets exposed
```

---

# 56. NEW DATABASE MODEL CHECKLIST

```text
[ ] Existing model searched
[ ] Domain ownership
[ ] Fields
[ ] Relationships
[ ] Unique constraints
[ ] Indexes
[ ] Status/lifecycle
[ ] Migration
[ ] Seed if applicable
[ ] Repository
[ ] Service
[ ] Tests
```

---

# 57. TESTING PRIORITY

Not every line needs a test.

Prioritize tests around:

- scoring
- progress merge
- permissions
- publishing
- content validation
- physics/math calculations
- AI request boundaries
- data transformations
- critical user flows

For pure presentational markup, use pragmatic testing rather than exhaustive snapshots.

---

# 58. END-TO-END CRITICAL FLOWS

The following flows are product-critical.

## Student learning

```text
Home
→ Level
→ Subject
→ Topic
→ Lesson
→ Interactive
→ AI
→ Quiz
→ Result
→ Continue
```

## Mathematics

```text
Home
→ SMA
→ Mathematics
→ Trigonometry
→ Visualizer
→ Change angle
→ Quiz
→ Result
```

## Biology

```text
Home
→ Biology
→ Cell lesson
→ Cell Explorer
→ Nucleus
→ Mitochondria
```

## Admin

```text
Admin Login
→ Dashboard
→ Lessons
→ Create
→ Add Blocks
→ Add Questions
→ Save Draft
→ Preview
→ Publish
→ Verify Public Lesson
```

---

# 59. QUALITY BAR

Before declaring a feature complete, verify:

```text
Does it work?
Does it work after refresh?
Does it work on mobile?
Does it work for an unauthenticated user if applicable?
Does authorization hold?
Does the database state remain correct?
Does an error fail gracefully?
Does loading look intentional?
Are there dead buttons?
Are there console errors?
Are there duplicated components?
Did I accidentally change unrelated code?
```

---

# 60. PERFORMANCE REVIEW QUESTIONS

Before declaring a data-heavy feature complete:

```text
How many DB queries does this make?
Could this produce N+1 queries?
Is the result cacheable?
Is it user-specific?
Is pagination needed?
Are indexes present?
Are we fetching unnecessary fields?
Does the browser download unnecessary JavaScript?
Can expensive UI be lazy-loaded?
```

---

# 61. SECURITY REVIEW QUESTIONS

For every feature touching data:

```text
Can an unauthorized user access this?
Can a user change another user's data?
Can the client manipulate role?
Can the client manipulate score?
Can the client inject HTML?
Can a CMS user execute arbitrary code?
Can an API request become unbounded?
Are secrets exposed?
Can this endpoint be abused repeatedly?
```

---

# 62. DATA PRIVACY

Do not collect data simply because it is technically possible.

Avoid storing sensitive information unless required.

Never log:

- passwords
- API keys
- authentication tokens
- unnecessary private conversation content
- sensitive user attributes

Analytics should be purposeful.

---

# 63. EDUCATIONAL CONTENT QUALITY

Content must be:

- Indonesian by default
- accurate
- concise
- age appropriate
- structured
- understandable

Avoid:

- lorem ipsum
- fake facts
- unsupported claims
- unnecessarily complex explanations
- shame-based quiz feedback

When content is uncertain or historical facts are disputed, the content authoring process should reflect appropriate factual nuance.

---

# 64. AI EDUCATIONAL QUALITY

The AI tutor should:

- adapt to education level
- explain step-by-step
- use examples
- clarify confusion
- prioritize current lesson
- avoid unnecessary information
- guide students toward understanding
- avoid fabricating facts
- state uncertainty when appropriate

The AI is a tutor, not merely a generic chatbot.

---

# 65. ERROR HANDLING PRINCIPLE

Errors should be:

```text
safe
actionable
human-readable
observable internally
```

Example:

User:

```text
Ups, ada sedikit gangguan.
Coba lagi.
```

Developer logs:

```text
requestId
route
errorCode
stack trace
latency
```

Do not expose developer diagnostics to users.

---

# 66. LOGGING

Logs should help diagnose problems without leaking secrets.

Good:

```text
quiz submission failed
lessonId=...
userId=...
requestId=...
errorCode=...
```

Bad:

```text
AI_API_KEY=...
password=...
full auth token=...
```

---

# 67. OBSERVABILITY

Important production signals:

- error rate
- request latency
- API failures
- AI failures
- database failures
- queue failures
- client errors

If monitoring is configured, new critical server flows should produce useful error context.

---

# 68. DOCUMENTATION RULE

If an agent changes:

- architecture
- database model
- API contract
- environment variables
- deployment
- security model
- major dependency

the agent should update the relevant documentation.

Do not let implementation silently diverge from architecture documentation.

---

# 69. DECISION RECORDS

For important architectural changes, add a short ADR when the repository supports ADRs.

Suggested:

```text
docs/adr/
├── 0001-modular-monolith.md
├── 0002-content-block-engine.md
└── 0003-ai-provider-adapter.md
```

An ADR should state:

```text
Context
Decision
Alternatives
Consequences
```

Do not create an ADR for trivial implementation choices.

---

# 70. WHEN AGENT DISCOVERS A BETTER APPROACH

Do not silently replace architecture.

If the agent discovers:

```text
TAD says A
but implementation would be substantially better with B
```

then:

1. determine whether B is a local implementation improvement or architectural change
2. if local, implement safely
3. if architectural, document the deviation
4. update TAD/ADR if appropriate

---

# 71. GENERATED CODE RULES

Agents may generate repetitive code, but generated code must still:

- follow project conventions
- be typed
- be validated
- be readable
- avoid duplication
- pass lint/test
- not include placeholder secrets

Never generate thousands of lines just because an agent can.

---

# 72. DO NOT OVER-ENGINEER

Avoid premature:

- abstraction layers
- generic factories
- dependency injection frameworks
- event buses
- service meshes
- microservices
- distributed transactions
- complex state machines

Use the simplest architecture that preserves future extension.

---

# 73. DO NOT UNDER-ENGINEER

Do not simplify away:

- server-side authorization
- validation
- database constraints
- error handling
- testing of critical business logic
- secure secret handling
- content sanitization

"Just MVP" is not an excuse for insecure foundations.

---

# 74. DEPENDENCY DIRECTION

Preferred:

```text
UI
 ↓
Application Service
 ↓
Repository / Adapter
 ↓
Infrastructure
```

Avoid:

```text
UI
 ↓
Prisma
```

Avoid:

```text
UI
 ↓
OpenAI SDK directly
```

Avoid:

```text
Database
 ↓
UI-specific formatting
```

---

# 75. CLIENT VS SERVER

Keep server-only code server-only.

Examples:

Server:

- database
- Prisma
- service-role credentials
- AI API
- secret storage
- admin authorization

Client:

- interactive visualization state
- form state
- animation
- temporary UI state

Do not import server-only modules into client components.

---

# 76. URL / ROUTING CONVENTIONS

Public content uses stable slugs.

Examples:

```text
/learn/sma
/learn/sma/fisika
/learn/sma/fisika/gerak
/learn/sma/fisika/gerak/gerak-parabola
```

Avoid exposing internal database IDs in public URLs unless necessary.

Admin may use IDs where practical.

---

# 77. CONTENT STATUS

Lessons support:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Public queries must not expose drafts.

Admin preview may access drafts with authorization.

---

# 78. FUTURE-PROOFING RULE

Future-proofing means:

```text
clear interfaces
stable data model
modular domains
extensible content blocks
provider adapters
```

It does NOT mean:

```text
build every future feature now
```

Build extension points, not unused systems.

---

# 79. AGENT HANDOFF FORMAT

When finishing work, report:

## Summary

What was implemented.

## Files changed

Important files only.

## Architecture

Any architectural decision.

## Database

Migration/schema changes.

## API

Endpoints added/changed.

## Tests

What was run.

## Validation

Lint/typecheck/test/build result.

## Known limitations

Anything intentionally incomplete.

## Next recommended step

Only if useful.

Example:

```text
Summary:
Implemented authenticated lesson progress persistence.

Changed:
- src/modules/progress/*
- src/app/api/progress/*
- prisma/schema.prisma

Database:
- Added UserProgress unique constraint.

Tests:
- Unit: pass
- Integration: pass
- E2E: not run

Known limitation:
- Guest-to-cloud merge is implemented but conflict telemetry is not.

Next:
- Add E2E coverage for login → lesson → refresh.
```

---

# 80. FINAL AGENT SELF-REVIEW

Before saying "done", the agent MUST verify:

```text
[ ] I read the project instructions.
[ ] I inspected existing code.
[ ] I searched for reusable code.
[ ] I did not duplicate an existing feature unnecessarily.
[ ] I respected domain boundaries.
[ ] I protected secrets.
[ ] I added validation.
[ ] I handled authorization.
[ ] I handled loading/error/empty states.
[ ] I considered mobile.
[ ] I considered accessibility.
[ ] I added appropriate tests.
[ ] I ran relevant tests.
[ ] I reviewed my diff.
[ ] I did not modify unrelated files.
[ ] I documented meaningful architectural changes.
```

---

# 81. THE MOST IMPORTANT RULE

**Do not optimize for generating code. Optimize for improving the Visedin codebase.**

An agent is successful when its changes:

```text
make the product better
+
make the architecture clearer
+
preserve existing behavior
+
reduce future maintenance
+
remain understandable to the next agent
```

A smaller, correct change is better than a larger, impressive-looking change.

---

# 82. Visedin Engineering Mantra

```text
Understand before changing.
Search before creating.
Reuse before duplicating.
Validate before trusting.
Measure before optimizing.
Test before declaring done.
Document before architectural drift.
Scale when needed, not when imagined.
```

# END OF AGENTS.md
