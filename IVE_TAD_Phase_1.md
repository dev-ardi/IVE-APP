# TECHNICAL ARCHITECTURE DOCUMENT (TAD)
## IVE-APP — Phase 1 Foundation / Production-Ready MVP

**Document status:** Draft for implementation
**Version:** 1.0
**Date:** 2026-09-16
**Audience:** AI coding agents, full-stack engineers, technical leads
**Source basis:** ive Master Prompt / PRD supplied for this project

---

## 0. EXECUTIVE DECISION

Build IVE-APP as a **modular monolith** first.

Do NOT start with microservices, Kubernetes, Kafka, or a distributed event architecture.

### Phase 1 stack

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
- Vector search: pgvector when RAG is introduced
- Math rendering: KaTeX
- Testing: Vitest + React Testing Library + Playwright
- Observability: Sentry-compatible error monitoring
- Analytics: PostHog-compatible event analytics, optional in Phase 1

### Core architecture rule

Business logic MUST live in domain/application modules, not inside React components or route handlers.

Target dependency direction:

UI -> Application Service -> Repository -> Prisma -> PostgreSQL

External integrations MUST be behind adapters:

Application Service -> Adapter Interface -> Provider

This makes later service extraction possible without rewriting the product.

---

# 1. PRODUCT SCOPE

ive is an Indonesian interactive education platform supporting:

- Umum
- SD
- SMP
- SMA

Core hierarchy:

Education Level
-> Subject
-> Topic
-> Lesson
-> Content Blocks
-> Practice Questions

Core learning loop:

DISCOVER -> LEARN -> INTERACT -> PRACTICE -> ASK AI -> COMPLETE -> CONTINUE

Phase 1 must implement the functional MVP described by the PRD, with the student-facing learning experience prioritized over CMS complexity.

---

# 2. PHASE 1 ACCEPTANCE SCOPE

## P0 — MUST WORK

### Public

- Homepage
- Education-level selection
- Level dashboard
- Subject page
- Topic page
- Lesson page
- Content block renderer
- Formula rendering
- YouTube video block
- Projectile Simulator
- Trigonometry Visualizer
- Cell Explorer
- Atom Explorer
- History Timeline
- Quiz engine
- Quiz scoring and feedback
- AI Assistant when configured
- Guest local progress
- Authenticated progress
- Search
- Favorites
- Responsive mobile/tablet/desktop experience

### Admin

- Admin authentication
- Admin authorization
- Dashboard
- Subject CRUD
- Topic CRUD
- Lesson CRUD
- Question CRUD
- Block editor
- Interactive component selection
- Preview
- Draft/publish/unpublish

### Technical

- Prisma schema
- Migration
- Seed script
- .env.example
- Zod validation
- Server-side AI key handling
- Error/loading states
- No production secrets in source control
- Primary end-to-end journey tested

---

# 3. NON-GOALS

Do NOT implement in Phase 1:

- Global leaderboard
- XP economy
- Coins
- Rewards store
- Certificates
- Teacher marketplace
- Advanced teacher tools
- Machine-learning recommendations
- Full video hosting
- Real-time collaborative classrooms
- Complex analytics warehouse
- Microservices
- Kubernetes
- Kafka
- Service mesh
- Dedicated vector database unless PostgreSQL/pgvector proves insufficient

Architecture may leave extension points for these features, but they are not implementation requirements.

---

# 4. HIGH-LEVEL ARCHITECTURE

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
       +---------+-----------+-----------+---------+
       |         |           |           |         |
    Learning   Quiz       Progress      AI       Search
       |         |           |           |         |
       +---------+-----------+-----------+---------+
                             |
                    Repository / Adapters
                             |
          +------------------+------------------+
          |                  |                  |
      PostgreSQL           Redis          Object Storage
          |
       pgvector
```

### Important

The Next.js process should remain stateless.

Never rely on process memory for durable state.

Durable state belongs in PostgreSQL.

Cache/temporary coordination belongs in Redis.

Files belong in object storage.

---

# 5. REPOSITORY STRUCTURE

Recommended App Router structure:

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── explore/
│   │   ├── search/
│   │   ├── my-learning/
│   │   ├── login/
│   │   └── learn/
│   │       └── [level]/
│   │           └── [subject]/
│   │               └── [topic]/
│   │                   └── [lesson]/
│   │
│   ├── quiz/
│   │   └── [lesson]/
│   │
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   ├── subjects/
│   │   ├── topics/
│   │   ├── lessons/
│   │   ├── questions/
│   │   └── interactive/
│   │
│   └── api/
│       ├── levels/
│       ├── subjects/
│       ├── topics/
│       ├── lessons/
│       ├── quiz/
│       ├── progress/
│       ├── favorites/
│       ├── search/
│       ├── ai/
│       └── admin/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── learning/
│   ├── lesson/
│   ├── quiz/
│   ├── ai/
│   ├── search/
│   └── interactive/
│       ├── registry.ts
│       ├── projectile-simulator/
│       ├── trigonometry-visualizer/
│       ├── cell-explorer/
│       ├── atom-explorer/
│       └── history-timeline/
│
├── modules/
│   ├── levels/
│   ├── subjects/
│   ├── topics/
│   ├── lessons/
│   ├── content/
│   ├── quiz/
│   ├── progress/
│   ├── favorites/
│   ├── search/
│   ├── ai/
│   ├── recommendations/
│   └── analytics/
│
├── lib/
│   ├── db/
│   ├── auth/
│   ├── cache/
│   ├── storage/
│   ├── validation/
│   ├── rate-limit/
│   └── utils/
│
├── server/
│   ├── auth/
│   ├── services/
│   └── adapters/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── styles/
│   └── globals.css
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

Agents may adjust exact folders, but MUST preserve module boundaries.

---

# 6. DOMAIN MODULES

Each domain module should follow this pattern where useful:

```text
modules/<domain>/
├── <domain>.service.ts
├── <domain>.repository.ts
├── <domain>.schema.ts
├── <domain>.types.ts
└── <domain>.mapper.ts
```

Do not force empty files solely to satisfy the pattern.

### Responsibilities

#### levels
Education-level retrieval.

#### subjects
Subject listing, lookup, CRUD.

#### topics
Topic listing, lookup, CRUD.

#### lessons
Lesson retrieval, publishing, ordering, metadata.

#### content
Content block validation, rendering metadata, sanitization.

#### quiz
Question retrieval, attempt creation, scoring, feedback.

#### progress
Guest/server progress, merge logic, completion.

#### favorites
Favorite creation/removal.

#### search
Lesson/subject/topic search.

#### ai
AI context building, conversation orchestration, provider adapter.

#### recommendations
Simple rule-based recommendations only.

#### analytics
Event recording abstraction.

---

# 7. DATABASE DESIGN

Use PostgreSQL through Prisma.

## 7.1 User

```text
User
- id
- name
- email
- avatar
- role
- createdAt
- updatedAt
```

Role enum:

```text
USER
ADMIN
```

Default role: USER.

Users MUST NOT select their role during registration.

---

## 7.2 EducationLevel

```text
EducationLevel
- id
- name
- slug
- description
- createdAt
- updatedAt
```

Unique:

- slug

Seed:

- umum
- sd
- smp
- sma

---

## 7.3 Subject

```text
Subject
- id
- educationLevelId
- name
- slug
- description
- icon
- coverImage
- status
- createdAt
- updatedAt
```

Indexes:

- educationLevelId
- slug
- status

Slug uniqueness may be scoped by education level if product requirements need the same subject name across levels.

---

## 7.4 Topic

```text
Topic
- id
- subjectId
- name
- slug
- description
- order
- status
- createdAt
- updatedAt
```

Indexes:

- subjectId
- slug
- status
- subjectId + order

---

## 7.5 Lesson

```text
Lesson
- id
- educationLevelId
- subjectId
- topicId
- title
- slug
- description
- difficulty
- estimatedMinutes
- thumbnail
- keywords
- contentBlocks
- status
- order
- createdAt
- updatedAt
```

Enums:

```text
LessonStatus:
DRAFT
PUBLISHED
ARCHIVED

Difficulty:
BEGINNER
INTERMEDIATE
ADVANCED
```

Indexes:

- educationLevelId
- subjectId
- topicId
- status
- slug
- topicId + order
- subjectId + status

Important invariant:

Published lessons MUST reference valid published/active taxonomy entities.

Public queries MUST filter status = PUBLISHED.

---

## 7.6 Content Blocks

For Phase 1, store lesson content blocks as JSON on Lesson unless editor complexity or querying requires normalization.

Recommended JSON shape:

```json
[
  {
    "id": "stable-block-id",
    "type": "heading",
    "content": "Apa itu Gerak Parabola?"
  },
  {
    "id": "stable-block-id-2",
    "type": "text",
    "content": "..."
  },
  {
    "id": "stable-block-id-3",
    "type": "formula",
    "content": "x = v_0 cos(θ)t"
  },
  {
    "id": "stable-block-id-4",
    "type": "interactive",
    "component": "projectile-simulator",
    "config": {
      "gravity": 9.8
    }
  }
]
```

Supported types:

- heading
- text
- image
- video
- formula
- callout
- example
- interactive
- quiz
- divider

Unknown block types MUST render a safe fallback, not crash the lesson.

All admin-authored rich text must be sanitized before rendering.

---

## 7.7 Question

```text
Question
- id
- lessonId
- question
- options
- correctAnswer
- explanation
- difficulty
- order
- createdAt
- updatedAt
```

`options` can be JSON:

```json
[
  {"id":"A","text":"..."},
  {"id":"B","text":"..."},
  {"id":"C","text":"..."},
  {"id":"D","text":"..."}
]
```

Never trust the client-supplied correct answer.

Server calculates score from database truth.

Index:

- lessonId

---

## 7.8 UserProgress

```text
UserProgress
- id
- userId
- lessonId
- progress
- completed
- lastPosition
- updatedAt
- createdAt
```

Constraints:

- unique(userId, lessonId)

Indexes:

- userId
- lessonId
- userId + updatedAt

`progress` range: 0–100.

`lastPosition` may represent a block index or another documented stable position.

---

## 7.9 QuizAttempt

```text
QuizAttempt
- id
- userId
- lessonId
- score
- totalQuestions
- correctAnswers
- createdAt
```

Indexes:

- userId
- lessonId
- userId + createdAt

Guest attempts are local-only in Phase 1 unless an explicit anonymous-attempt table is added later.

---

## 7.10 Favorite

```text
Favorite
- id
- userId
- lessonId
- createdAt
```

Unique:

- userId + lessonId

Indexes:

- userId
- lessonId

---

## 7.11 AIConversation

```text
AIConversation
- id
- userId
- lessonId
- createdAt
- updatedAt
```

Index:

- userId + lessonId

---

## 7.12 AIMessage

```text
AIMessage
- id
- conversationId
- role
- content
- createdAt
```

Role:

```text
USER
ASSISTANT
```

Index:

- conversationId + createdAt

---

## 7.13 AnalyticsEvent

Optional but recommended:

```text
AnalyticsEvent
- id
- userId nullable
- eventName
- lessonId nullable
- metadata JSON nullable
- createdAt
```

Events:

- lesson_viewed
- lesson_started
- lesson_completed
- quiz_started
- quiz_completed
- ai_opened
- ai_question_asked
- search_performed

Do not build a complex dashboard around this in Phase 1.

---

# 8. DATA INTEGRITY

Implement database-level uniqueness where possible.

Examples:

- EducationLevel.slug unique
- User.email unique
- Favorite(userId, lessonId) unique
- UserProgress(userId, lessonId) unique
- AIMessage belongs to existing conversation
- Question belongs to existing lesson

Use transactions for:

- publishing lesson with required validation
- quiz attempt creation if additional derived records are created
- progress merge
- local-to-cloud migration where multiple rows are written

---

# 9. CONTENT BLOCK ENGINE

Create one renderer:

```text
LessonContentRenderer
```

It receives:

```typescript
{
  blocks: ContentBlock[]
}
```

Dispatch through a registry:

```text
ContentBlockRenderer
        |
        +-- heading
        +-- text
        +-- image
        +-- video
        +-- formula
        +-- callout
        +-- example
        +-- interactive
        +-- quiz
        +-- divider
```

Never use `dangerouslySetInnerHTML` for unsanitized content.

Interactive blocks MUST be lazy-loaded.

---

# 10. INTERACTIVE REGISTRY

Create a registry:

```text
InteractiveRegistry
```

Supported keys:

```text
projectile-simulator
trigonometry-visualizer
cell-explorer
atom-explorer
history-timeline
```

The CMS stores the key, not executable code.

Example:

```json
{
  "type": "interactive",
  "component": "projectile-simulator",
  "config": {
    "gravity": 9.8
  }
}
```

Unknown interactive component:

- show a friendly unavailable message
- do not crash
- do not execute arbitrary code

Admin MUST only be able to select predefined components.

---

# 11. INTERACTIVE COMPONENT REQUIREMENTS

## Projectile Simulator

Inputs:

- initial velocity
- angle
- gravity

Outputs:

- trajectory
- maximum height
- horizontal range
- flight time

Use real physics equations.

Default:

- velocity = 20 m/s
- angle = 45°
- gravity = 9.8 m/s²

Provide reset.

Mobile controls must be touch friendly.

Provide text values as fallback.

---

## Trigonometry Visualizer

Input:

- angle

Output:

- sin
- cos
- tan

Visualization:

- right triangle and/or unit circle

Avoid division instability around undefined tan values.

Display educational explanation.

---

## Cell Explorer

Clickable organelles:

- nucleus
- mitochondria
- ribosome
- cell membrane
- cytoplasm
- Golgi apparatus

Click shows:

- name
- function
- age-appropriate explanation

---

## Atom Explorer

Elements:

- Hydrogen
- Helium
- Carbon
- Oxygen
- Sodium

Show:

- atomic number
- proton count
- neutron count
- electron count

Clearly label the visualization as simplified.

---

## History Timeline

Seed:

- 1908 — Budi Utomo
- 1928 — Sumpah Pemuda
- 1945 — Proklamasi Kemerdekaan

Clicking an event shows:

- year
- event
- description
- historical significance

Present historical information carefully and factually.

---

# 12. QUIZ ENGINE

MVP supports multiple choice.

Flow:

```text
Load lesson questions
        ↓
User selects answer
        ↓
POST answer / submit
        ↓
Server validates against DB
        ↓
Feedback
        ↓
Next question
        ↓
Final result
```

Server-side scoring is authoritative.

Never send `correctAnswer` to the browser before the user submits that question.

If questions are preloaded client-side, the implementation must avoid exposing answer keys.

Recommended MVP flow: fetch question data without answer key, validate each answer server-side.

Result:

- score percentage
- correct count
- incorrect count
- total
- encouraging message

---

# 13. PROGRESS SYSTEM

## Guest

Use:

```text
localStorage
```

Keys:

```text
ive_progress
ive_favorites
ive_quiz_attempts
```

Do not store sensitive data.

## Authenticated

Use PostgreSQL.

When guest logs in:

```text
local progress
      ↓
merge
      ↓
server progress
```

Merge rule:

- preserve higher progress
- preserve completed = true once completed
- do not replace a more advanced cloud state with lower local progress

Perform merge idempotently.

---

# 14. LESSON COMPLETION

Reading progress may be marked completed independently of quiz completion.

At end of lesson:

```text
completed = true
progress = 100
```

unless a future configuration explicitly changes completion rules.

Do not create fake prerequisite locks.

---

# 15. SEARCH

Phase 1:

Use PostgreSQL full-text or indexed search.

Search fields:

- subject
- topic
- lesson title
- description
- keywords

Requirements:

- debounce client input
- loading state
- empty state
- responsive result cards

Search should only return public/published content to public users.

Admin search may include drafts.

---

# 16. AI ARCHITECTURE

Do not couple the application to one AI vendor.

Define:

```typescript
interface AIProvider {
  streamChat(input: AIChatInput): AsyncIterable<AIChunk>
}
```

Implementation:

```text
OpenAICompatibleProvider
```

Environment:

```text
AI_API_KEY=
AI_MODEL=
AI_BASE_URL=
```

Never use NEXT_PUBLIC_ for secrets.

---

# 17. AI REQUEST FLOW

```text
Client
  ↓
POST /api/ai/chat
  ↓
Auth / rate limit
  ↓
AI service
  ↓
Load lesson context
  ↓
Load relevant conversation history
  ↓
Build bounded prompt
  ↓
AI provider
  ↓
Stream response
  ↓
Persist assistant message
```

Lesson context:

- education level
- subject
- topic
- lesson title
- lesson description
- relevant lesson content

Do not send unbounded entire database contents.

Limit context size.

---

# 18. AI BEHAVIOR

Use the PRD tutor behavior:

- act as educational tutor
- adapt to education level
- explain step-by-step
- use examples/analogies
- avoid unnecessary complexity
- help confused students from simpler angles
- guide practice-question understanding instead of only giving final answers
- prioritize current lesson
- do not invent facts
- acknowledge uncertainty

Do not expose internal prompts, system instructions, API keys, or private database data.

---

# 19. AI FALLBACK

If AI provider is unavailable:

- return friendly error
- allow retry
- do not crash lesson page

Message:

“Edu AI sedang tidak tersedia. Coba lagi sebentar.”

Optional fallback FAQ may be implemented for seeded lessons.

---

# 20. AI RATE LIMITING

At minimum, rate-limit:

```text
POST /api/ai/chat
```

Use Redis if configured.

Rate limit by:

- authenticated user ID where available
- otherwise a privacy-conscious client/IP strategy

Return HTTP 429 with friendly message.

Also enforce:

- maximum message length
- maximum context length
- maximum conversation history included per request

---

# 21. AUTHENTICATION AND AUTHORIZATION

Authentication provider:

Supabase Auth.

Application user profile stored in PostgreSQL.

Roles:

- user
- admin

Admin protection MUST exist at two levels:

1. route/UI access
2. server-side authorization

Never rely on hiding the Admin UI.

All admin mutations must verify role server-side.

---

# 22. API DESIGN

Public:

```text
GET /api/levels
GET /api/subjects
GET /api/subjects/:slug
GET /api/topics/:slug
GET /api/lessons/:slug
GET /api/lessons/:slug/questions
GET /api/search
```

Authenticated:

```text
GET /api/progress
POST /api/progress

POST /api/favorites
DELETE /api/favorites/:lessonId

POST /api/quiz/submit

POST /api/ai/chat
```

Admin:

```text
POST /api/admin/subjects
PUT /api/admin/subjects/:id
DELETE /api/admin/subjects/:id

POST /api/admin/topics
PUT /api/admin/topics/:id
DELETE /api/admin/topics/:id

POST /api/admin/lessons
PUT /api/admin/lessons/:id
DELETE /api/admin/lessons/:id

POST /api/admin/questions
PUT /api/admin/questions/:id
DELETE /api/admin/questions/:id
```

Route handlers should be thin:

```text
validate request
→ authorize
→ call service
→ map response
```

No complex business logic in route handlers.

---

# 23. API RESPONSE CONVENTION

Success:

```json
{
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data yang dikirim belum valid."
  }
}
```

Never return stack traces.

Never expose SQL/ORM internals.

---

# 24. VALIDATION

Use Zod at API boundaries.

Validate:

- route params
- query params
- request body
- content block structure
- quiz answers
- admin mutations
- AI requests

Content blocks must have discriminated schemas by `type`.

---

# 25. ADMIN CMS

Admin is intentionally simple.

## Dashboard

Cards:

- total subjects
- total topics
- total lessons
- total questions
- published lessons
- draft lessons

Recent lessons and updates.

## Subject

Create/edit/archive.

Fields:

- name
- slug
- description
- education level
- icon
- cover image
- status

## Topic

Fields:

- name
- slug
- subject
- description
- order
- status

## Lesson

Fields:

- title
- slug
- education level
- subject
- topic
- description
- difficulty
- estimated time
- thumbnail
- keywords
- content blocks
- status

Actions:

- save draft
- preview
- publish
- unpublish
- archive

## Question

Multiple-choice editor.

Validation:

- at least 2 options
- exactly one correct answer
- explanation recommended

## Interactive

Only predefined interactive types.

No arbitrary code.

---

# 26. LESSON PREVIEW

Admin preview MUST use the same renderer as public lesson pages.

Architecture:

```text
CMS content
    ↓
ContentBlock validation
    ↓
LessonContentRenderer
```

Do not maintain separate preview rendering logic.

Preview unpublished lessons only for authorized admins.

---

# 27. PUBLISHING RULES

Publishing requires:

- valid title
- valid slug
- education level
- subject
- topic
- description
- valid content blocks
- no invalid interactive component references

Published content is publicly visible.

Unpublished content is not publicly visible.

Archive is preferred over hard deletion for published educational content when appropriate.

---

# 28. SECURITY

Mandatory:

- server-side authorization
- Zod validation
- Prisma parameterized queries
- rich-content sanitization
- secure authentication/session handling
- server-side AI secrets
- rate limiting
- safe file upload validation if uploads are implemented
- no arbitrary code execution through CMS
- no production credentials in source

Avoid exposing:

- correct quiz answers before submission
- admin-only lesson drafts
- internal prompts
- AI API keys
- database errors

---

# 29. PERFORMANCE

## Public lesson pages

Prefer:

- server rendering for content
- static/cached published content where practical
- lazy loading interactive components
- optimized images
- lazy YouTube embeds
- minimal client JavaScript

Do not initialize all interactive simulations immediately.

## Database

Avoid N+1 queries.

Use appropriate Prisma `select` / `include`.

Do not fetch unnecessary columns.

Use indexes defined above.

---

# 30. CACHING STRATEGY

Cache candidates:

- education levels
- subject lists
- topic lists
- published lesson metadata
- published lesson content

Do NOT cache user-specific progress without user-keyed invalidation.

Initial strategy:

```text
Public content
→ Next.js caching / revalidation

Hot shared data
→ Redis if needed

User-specific data
→ PostgreSQL
```

Use explicit cache invalidation after admin publish/update.

---

# 31. REDIS

Redis is an infrastructure dependency but should not become mandatory for every local development operation if avoidable.

Use Redis for:

- AI rate limiting
- hot content caching
- future background queues

If Redis is unavailable in local development, features that do not require it should continue working.

Rate limiting may use a documented development fallback.

---

# 32. BACKGROUND JOBS

Do not introduce asynchronous workers for normal CRUD.

Use BullMQ only for tasks such as:

- analytics aggregation
- expensive recommendation calculations
- future AI indexing
- notifications

Phase 1 can leave worker implementation minimal.

The application MUST NOT depend on a background worker for core lesson reading or quiz submission.

---

# 33. OBJECT STORAGE

Use object storage for:

- lesson images
- thumbnails
- user avatars
- CMS media

Never store large binary files in PostgreSQL.

Do not implement video hosting.

YouTube URLs should remain external embeds for MVP.

---

# 34. SEO

Implement metadata for:

- homepage
- level pages
- subject pages
- topic pages
- lesson pages

Lesson example:

Title:
Gerak Parabola — Fisika SMA | ive

Description:
Pelajari konsep gerak parabola melalui penjelasan, visualisasi interaktif, dan latihan soal.

Use canonical URLs and OpenGraph metadata.

Public published lessons should be crawlable.

Admin routes should not be indexed.

---

# 35. RESPONSIVE / ACCESSIBILITY

Required:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible labels
- alt text
- heading hierarchy
- contrast
- touch-friendly controls

Mobile:

- no horizontal overflow
- large quiz answer cards
- responsive interactive controls
- AI drawer becomes bottom sheet/full screen
- usable navigation

Interactive components must have textual fallback explanations.

---

# 36. UI PRINCIPLES

Student UI:

- friendly
- colorful
- playful
- visual
- spacious
- rounded
- progress-oriented

Avoid:

- corporate SaaS appearance
- dense enterprise tables
- tiny typography
- excessive gray
- old-fashioned school website patterns

Do not copy another product's branding or exact UI.

Primary user action must be obvious on each page.

---

# 37. ROUTING

Public:

```text
/
/explore
/search
/my-learning
/login

/learn/umum
/learn/sd
/learn/smp
/learn/sma

/learn/:level/:subject
/learn/:level/:subject/:topic
/learn/:level/:subject/:topic/:lesson

/quiz/:lesson
```

Admin:

```text
/admin
/admin/dashboard
/admin/subjects
/admin/topics
/admin/lessons
/admin/questions
/admin/interactive
```

Use stable slug-based public URLs.

---

# 38. RECOMMENDATIONS

Phase 1 uses deterministic rules:

1. If user completed a lesson, recommend next lesson in same topic.
2. If no progress, recommend beginner content.
3. If user frequently studies a subject, recommend additional content from that subject.

Do not use ML.

Keep recommendation logic in its own module so it can later be replaced.

---

# 39. SEED DATA

Application MUST not start empty.

Minimum:

- Umum: 5 lessons
- SD: 5 lessons
- SMP: 10 lessons
- SMA: 20 lessons

Target: 40+ lessons.

Each lesson should have:

- title
- description
- realistic Indonesian learning content
- at least one visual/content block
- at least 3 questions where appropriate

Priority polished lesson:

```text
SMA → Fisika → Gerak → Gerak Parabola
```

Also integrate:

- Trigonometry Visualizer
- Cell Explorer
- Atom Explorer
- History Timeline

Seed data must contain no lorem ipsum or fake “coming soon” primary content.

---

# 40. LOCAL DEVELOPMENT

Provide:

```text
.env.example
```

Variables:

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

Only public Supabase/browser-safe values may use `NEXT_PUBLIC_`.

Never put AI, service-role, database-admin, or storage-secret credentials in public variables.

---

# 41. DATABASE MIGRATION / SEED

Required commands should be documented in README:

```text
install dependencies
configure env
run migration
run seed
start development server
```

Seed must be idempotent where practical.

Use deterministic IDs/slugs or upsert logic so rerunning seed does not create duplicate content.

Development admin account may be created from:

```text
ADMIN_EMAIL
ADMIN_PASSWORD
```

Never hardcode production credentials.

---

# 42. TESTING STRATEGY

## Unit tests

Test:

- projectile calculations
- trigonometry calculations
- quiz scoring
- progress merge
- content block validation
- recommendation rules
- slug utilities

## Integration tests

Test:

- lesson retrieval
- quiz submission
- progress persistence
- favorites
- admin authorization
- lesson publishing

## E2E

Mandatory demo flow:

```text
Homepage
→ SMA
→ Fisika
→ Gerak
→ Gerak Parabola
→ interact simulator
→ open AI
→ ask question
→ close AI
→ start quiz
→ finish quiz
→ result
```

Second:

```text
Homepage
→ SMA
→ Matematika
→ Trigonometri
→ visualizer
→ change angle
→ quiz
```

Third:

```text
Homepage
→ Biologi
→ Cell lesson
→ Cell Explorer
→ nucleus
→ mitochondria
```

Admin:

```text
Login admin
→ dashboard
→ lessons
→ create
→ content blocks
→ questions
→ draft
→ preview
→ publish
→ public verification
```

---

# 43. OBSERVABILITY

At minimum:

- server error logging
- request error context
- client error monitoring
- no secret values in logs

Recommended:

- Sentry
- structured server logs

Track useful dimensions:

- route
- request ID
- user ID where appropriate
- error code
- latency

Never log:

- passwords
- API keys
- auth tokens
- full private AI conversations unless explicitly required and protected

---

# 44. ANALYTICS

Track:

```text
lesson_viewed
lesson_started
lesson_completed
quiz_started
quiz_completed
ai_opened
ai_question_asked
search_performed
```

Use an analytics adapter rather than directly coupling every component to a provider.

Example:

```typescript
analytics.track({
  event: "lesson_completed",
  userId,
  properties: {
    lessonId
  }
})
```

Analytics failure MUST NOT break the user experience.

---

# 45. ERROR / LOADING UX

Loading:

- skeletons for lesson/subject/search cards
- AI typing indicator
- quiz button loading state

Errors:

“Ups, ada sedikit gangguan.”

“Coba lagi”

Search empty:

“Belum menemukan materi yang cocok.”

AI:

“Edu AI sedang tidak tersedia. Coba lagi sebentar.”

Never show raw stack traces.

---

# 46. IMPLEMENTATION ORDER

Agents MUST implement in this order unless a dependency requires otherwise.

## Step 1 — Bootstrap

- Next.js App Router
- TypeScript
- Tailwind
- shadcn/ui
- linting
- formatting
- test setup

## Step 2 — Database

- Prisma
- PostgreSQL schema
- migration
- indexes
- seed

## Step 3 — Auth

- Supabase Auth
- user profile
- admin role
- middleware/server authorization

## Step 4 — Core domain

- levels
- subjects
- topics
- lessons

## Step 5 — Content engine

- content block schema
- renderer
- formula
- video
- callout
- example
- interactive registry

## Step 6 — Student UI

- homepage
- level
- subject
- topic
- lesson

## Step 7 — Interactive engine

Implement all five components.

## Step 8 — Quiz

- question loading
- answer submission
- scoring
- feedback
- result

## Step 9 — Progress

- local storage
- authenticated persistence
- merge

## Step 10 — AI

- provider adapter
- context builder
- streaming
- conversation persistence
- rate limiting

## Step 11 — Search / Favorites

## Step 12 — Admin CMS

## Step 13 — SEO / performance / accessibility

## Step 14 — Tests

## Step 15 — End-to-end polish

---

# 47. DEFINITION OF DONE

A feature is DONE only when:

- UI works
- API/service works
- validation exists
- authorization exists where needed
- loading state exists
- error state exists
- mobile behavior works
- tests cover important business logic
- no dead buttons
- no placeholder primary content
- no console/runtime errors reasonably avoidable

---

# 48. AGENT RULES

All coding agents MUST follow these rules.

### Rule 1
Do not rewrite working modules unnecessarily.

### Rule 2
Do not place business logic inside UI components.

### Rule 3
Do not put database queries directly in reusable UI components.

### Rule 4
Do not expose secrets to the client.

### Rule 5
Do not trust client-side quiz scoring.

### Rule 6
Do not trust client-provided admin role.

### Rule 7
Do not allow arbitrary CMS code execution.

### Rule 8
Do not create fake locked lessons.

### Rule 9
Do not introduce microservices unless explicitly approved.

### Rule 10
Do not introduce new infrastructure dependencies without documenting why they are needed.

### Rule 11
Prefer existing dependencies before adding a new package.

### Rule 12
Every new package must have a clear reason.

### Rule 13
Every public route must have a meaningful loading and error state.

### Rule 14
All public educational content must come from database/content data, not hardcoded page components.

### Rule 15
Use the same content renderer for admin preview and public lesson.

---

# 49. FUTURE EXTRACTION PLAN

The architecture should permit later extraction of:

```text
AI Service
Search Service
Quiz Service
Analytics Pipeline
Recommendation Service
```

Extraction trigger examples:

- independent scaling requirement
- independent deployment cadence
- clear ownership boundary
- infrastructure bottleneck
- team ownership

Do not extract merely because a module exists.

---

# 50. EXPECTED FUTURE SCALE PATH

## Stage A — MVP

```text
Next.js
PostgreSQL
Redis
Object Storage
```

Single deployable application.

## Stage B — Growing traffic

```text
CDN
multiple Next.js instances
managed PostgreSQL
Redis
background worker
```

## Stage C — Large platform

```text
Web App
  |
  +-- Learning
  +-- Quiz
  +-- AI
  +-- Search
  +-- Analytics
```

Extract only high-load/high-change domains.

---

# 51. ARCHITECTURAL PRIORITIES

When trade-offs occur, use this order:

1. Correctness
2. Student learning experience
3. Data integrity
4. Security
5. Maintainability
6. Performance
7. Scalability
8. Infrastructure sophistication

Do not sacrifice core learning quality merely to demonstrate complex infrastructure.

---

# 52. FINAL TECHNICAL CHECKLIST

Before Phase 1 is accepted:

## Architecture

- [ ] Modular monolith
- [ ] Clear domain boundaries
- [ ] Thin API handlers
- [ ] Services contain business logic
- [ ] Repository abstraction used where useful
- [ ] External providers behind adapters

## Database

- [ ] PostgreSQL
- [ ] Prisma schema
- [ ] Migration
- [ ] Seed
- [ ] Indexes
- [ ] Constraints
- [ ] Transactional operations where needed

## Student

- [ ] Homepage
- [ ] Level selection
- [ ] Subject
- [ ] Topic
- [ ] Lesson
- [ ] Interactive
- [ ] Quiz
- [ ] AI
- [ ] Progress
- [ ] Search
- [ ] Favorites

## Admin

- [ ] Auth
- [ ] Authorization
- [ ] CRUD
- [ ] Block editor
- [ ] Interactive selector
- [ ] Preview
- [ ] Publish

## Security

- [ ] Secrets server-side
- [ ] Zod validation
- [ ] Admin checks server-side
- [ ] Quiz score server-side
- [ ] Sanitization
- [ ] Rate limiting
- [ ] No arbitrary code execution

## UX

- [ ] Mobile
- [ ] Tablet
- [ ] Desktop
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Accessibility
- [ ] SEO

## Testing

- [ ] Unit
- [ ] Integration
- [ ] E2E primary flow
- [ ] E2E admin flow

---

# 53. AGENT EXECUTION BRIEF

The agents should interpret this document as an implementation contract.

Do not build a static prototype.

Build a functional application.

Do not stop when the UI looks correct.

Verify:

```text
database
→ API
→ UI
→ state
→ interactions
→ authentication
→ authorization
→ error handling
→ tests
```

The core demo must work end-to-end.

The resulting codebase must be understandable by another engineering team and must support future scaling without an immediate rewrite.

