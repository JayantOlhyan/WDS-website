# Web Development Society — MSIT (WDS MSIT)
### Official Digital Ecosystem & WDS Operating System (WDS OS v2.1)

> **Live Production Platform**: [wds-msit.vercel.app](https://wds-msit.vercel.app)  
> **Official Bug Hunt Platform**: [wds-bug-hunt.netlify.app/bug-hunt](https://wds-bug-hunt.netlify.app/bug-hunt)  
> **GitHub Repository**: [github.com/JayantOlhyan/WDS-website](https://github.com/JayantOlhyan/WDS-website)

---

## 1. System Architecture & The "WDS Operating System"

The WDS MSIT ecosystem unifies the public society identity and an internal operating system into a single cohesive platform. It replaces fragmented WhatsApp chats, scattered spreadsheets, and verbal handoffs with structured, persistent workflows.

```
                   PUBLIC USERS / STUDENTS
                              │
              ┌───────────────┴───────────────┐
              │                               │
       Public Routes                     Bug Hunt App
     (/, /recruitment, etc.)         (External Netlify)
              │                               │
      Zod Application Form           HMAC SHA-256 Webhook
              │                      (Idempotent Ingestion)
              ▼                               ▼
    POST /api/recruitment/apply    POST /api/hub/bugs/webhook
              │                               │
              └───────────────┬───────────────┘
                              │
                  REQUEST ID TRACING LAYER
                      (X-Request-ID)
                              │
                    SERVER VALIDATION LAYER
                              │
                    REPOSITORY ABSTRACTION
    (TaskRepo, BugRepo, RecruitmentRepo, ProjectRepo,
     EventRepo, ContentRepo, MemberRepo, IncidentRepo, AuditRepo)
                              │
                              ▼
                   NOTION OPERATIONAL BACKEND
        (Recruitment DB, Tasks DB, Bugs DB, Audit DB)
                              ▲
                              │
                      WDS HUB OPERATORS
             (Admin, Core Team, Team Lead, Member)
                              │
                  Opaque Session Cookie Auth
              (/api/hub/auth + Server Session Store)
```

---

## 2. Core Operating Subsystems & Hardening Standards

### A. Observability, Errors & Request ID Tracing
- **Request Tracing (`lib/errors.ts`)**: Every mutation and API request generates a random opaque identifier (`req_...`) returned via `X-Request-ID` and structured error responses `{ error: { code, message, requestId } }`.
- **Standardized Error Codes**: `UNAUTHORIZED`, `FORBIDDEN`, `VALIDATION_ERROR`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `DATABASE_OFFLINE`, `DATABASE_SCHEMA_MISMATCH`, `WEBHOOK_INVALID`, `INTERNAL_ERROR`.

### B. Notion Schema Validation & Admin Diagnostic Center
- **Central Schema Validator (`lib/notion/schemaValidator.ts`)**: Validates connection and property bindings on all 4 Notion databases (Recruitment, Tasks, Bugs, Websites) without exposing secret credentials.
- **Admin Control Center (`components/hub/AdminView.tsx`, `/api/hub/config`)**: Restricted console for database bindings, credential status, and data exports.

### C. Security & Data Integrity
- **CSV Formula Injection Defense (`lib/csv.ts`)**: Sanitizes cells starting with `=, +, -, @` with a leading apostrophe to prevent spreadsheet code execution.
- **Webhook Idempotency (`lib/webhook.ts`)**: Enforces single-delivery processing on `POST /api/hub/bugs/webhook` preventing duplicate bug creation on webhook replays.
- **SSRF Defense**: Strict domain allowlist (`msit.in`, `wds-bug-hunt.netlify.app`, `github.com`), blocking private IPs (`10.x`, `192.168.x`, `169.254.x`), loopbacks, and redirects.

### D. People & Access Governance
- **Granular Permissions Matrix (`lib/permissions.ts`)**: 25+ fine-grained permissions mapped to `ADMIN`, `CORE_TEAM`, `TEAM_LEAD`, and `MEMBER`.
- **Single-Use Onboarding Tokens (`/api/hub/invitations`)**: Admin-controlled invitation generator issuing single-use, 7-day TTL tokens (`wds_inv_...`).
- **Member Directory (`/api/hub/members`)**: Contributor profiles, roles, assigned wings, and status (`ACTIVE`, `SUSPENDED`, `ALUMNI`).

### E. Task System & Operational Context
- **Task Comments (`/api/hub/tasks/[id]/comments`)**: Operational activity trail per task for blockers and handover updates.
- **Task Dependencies**: Badges indicating blocker tasks (`blockedBy`).
- **Multi-View Sprints**: Filter by `ALL`, `MY_TASKS`, `TODAY`, `UPCOMING`, `BLOCKED`, and `COMPLETED`.

### F. Recruitment 2026 Operations & Scorecards
- **Multi-Stage Lifecycle**: `RECEIVED` → `SCREENING` → `SHORTLISTED` → `INTERVIEW` → `SELECTED` / `REJECTED`.
- **Interview Scorecards**: Structured 1–5 scoring across:
  - Technical Competence
  - Communication & Clarity
  - Problem Solving
  - Team Fit & Culture
- **Data Export**: Authorized `CORE_TEAM` and `ADMIN` roles can export candidate CSVs (`/api/hub/export?type=recruitment`).

### G. Events & Editorial Content Workflows
- **Event Lifecycle**: `IDEA` → `PLANNING` → `ANNOUNCED` → `REGISTRATION` → `LIVE` → `COMPLETED` → `ARCHIVED`.
- **Content Kanban**: `IDEA` → `DRAFT` → `REVIEW` → `APPROVED` → `SCHEDULED` → `PUBLISHED`.

### H. Incidents & Live Website Health
- **Incident Lifecycle**: `DETECTED` → `INVESTIGATING` → `IDENTIFIED` → `RESOLVED`.
- **Automated Detection**: State transitions (`ONLINE` → `OFFLINE` creates Incident; `OFFLINE` → `ONLINE` resolves incident with recorded downtime duration).

### I. Yearly Leadership Handover Protocol
- Dedicated Handover Console (`/hub` → Handover) with an interactive transition checklist:
  - GitHub Organization Ownership Transfer
  - Notion Workspace Admin Rights
  - Master Passkey Rotation (`HUB_ADMIN_KEY`, `HUB_CORE_KEY`)
  - Candidate Records Archival
  - Domain & Vercel DNS Verification
  - Member Roster Review (`WDS 2026` → `WDS 2027`)

---

## 3. Environment Configuration

Copy `.env.example` to `.env.local` and populate values:

```bash
# Node Environment
NODE_ENV=development

# Notion API Integration Secrets
NOTION_API_KEY=secret_your_notion_integration_token
NOTION_DATABASE_ID=your_recruitment_db_id
NOTION_TASKS_DATABASE_ID=your_tasks_db_id
NOTION_BUGS_DATABASE_ID=your_bugs_db_id

# WDS Hub Role Access Keys
HUB_ADMIN_KEY=wds-admin-2026
HUB_CORE_KEY=wds-core-2026
HUB_LEAD_KEY=wds-tech-2026
HUB_MEMBER_KEY=wds-member-2026

# Bug Hunt Integration Webhook Secret
BUG_HUNT_WEBHOOK_SECRET=your_hmac_shared_secret
```

---

## 4. Local Development & Testing

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Run automated test suite (Vitest - 51 tests)
npm test

# Run development server
npm run dev

# Build production bundle
npm run build
```

---

## 5. Continuous Integration (GitHub Actions)

Every pull request and push to `main` triggers `.github/workflows/ci.yml`:
1. `npm ci`
2. `npm run lint` (ESLint Next.js validation)
3. `npm test` (51 automated unit & integration test suites)
4. `npm run build` (32 static & dynamic routes compiled)
