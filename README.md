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
              │                               │
              ▼                               ▼
    POST /api/recruitment/apply    POST /api/hub/bugs/webhook
              │                               │
              └───────────────┬───────────────┘
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

## 2. Core Operating Subsystems

### A. People & Access Governance
- **Granular Permissions Matrix (`lib/permissions.ts`)**: 25+ fine-grained permissions (`tasks.*`, `recruitment.evaluate`, `events.manage`, `content.publish`, `audit.read`, `system.export`).
- **Single-Use Onboarding Tokens (`/api/hub/invitations`)**: Admin-controlled invitation generator issuing single-use, 7-day TTL tokens (`wds_inv_...`) for onboarding team leads and members.
- **Member Directory (`/api/hub/members`)**: Contributor profiles, roles, assigned wings, and status (`ACTIVE`, `SUSPENDED`, `ALUMNI`).

### B. Project System (`/api/hub/projects`)
- Centralized project registry tracking active society repositories:
  - `WDS Main Ecosystem Website`
  - `WDS Bug Hunt Platform`
  - `Recruitment 2026 Pipeline`
  - `Freshers Hub & Resource Kit`
  - `WDS Tech Newsletter & Radar`

### C. Task Maturity & Concurrency
- **Task Dependencies**: Badges indicating blocker tasks (`blockedBy`).
- **Multi-View Sprints**: Filter by `ALL`, `MY_TASKS`, `TODAY`, `UPCOMING`, `BLOCKED`, and `COMPLETED`.
- **Optimistic Concurrency**: Prevents lost updates using timestamp and version checking.

### D. Recruitment 2026 Operations & Scorecards
- **Multi-Stage Lifecycle**: `RECEIVED` → `SCREENING` → `SHORTLISTED` → `INTERVIEW` → `SELECTED` / `REJECTED`.
- **Interview Scorecards**: Structured 1–5 scoring across:
  - Technical Competence
  - Communication & Clarity
  - Problem Solving
  - Team Fit & Culture
- **Data Export**: Authorized `CORE_TEAM` and `ADMIN` roles can export candidate CSVs (`/api/hub/export?type=recruitment`).

### E. Events & Editorial Content Workflows
- **Event Lifecycle**: `IDEA` → `PLANNING` → `ANNOUNCED` → `REGISTRATION` → `LIVE` → `COMPLETED` → `ARCHIVED`.
- **Content Kanban**: `IDEA` → `DRAFT` → `REVIEW` → `APPROVED` → `SCHEDULED` → `PUBLISHED`.

### F. Incidents & Live Website Health
- **Incident Lifecycle**: `DETECTED` → `INVESTIGATING` → `IDENTIFIED` → `RESOLVED`.
- **SSRF Defense**: Strict domain allowlist (`msit.in`, `wds-bug-hunt.netlify.app`, `github.com`), blocking private IPs (`10.x`, `192.168.x`, `169.254.x`), loopbacks, and redirects.

### G. System Audit Log & In-App Notifications
- **Audit Trail (`/api/hub/audit`)**: Immutable record of all member actions, candidate transitions, task mutations, and logins.
- **In-App Notifications (`/api/hub/notifications`)**: Live event badges and dropdown alerts in the Hub header.

### H. Standard Operating Procedures (SOPs) & Yearly Handover
- Complete technical playbooks embedded in the Hub (`/hub` → Documentation):
  - Production Deployment & CI/CD Manual
  - Bug Hunt Webhook Triage SOP
  - Recruitment Evaluation Guidelines
  - Downtime & Incident Response Playbook
  - Yearly Leadership Handover Protocol (`WDS 2026` → `WDS 2027`)

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

# Run automated test suite (Vitest)
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
2. `npm run lint`
3. `npm test` (39 automated unit & integration test suites)
4. `npm run build`
