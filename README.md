# Web Development Society — MSIT (WDS MSIT)
### Official Digital Ecosystem & WDS Hub Operations Platform

> **Live Production Platform**: [wds-msit.vercel.app](https://wds-msit.vercel.app)  
> **Official Bug Hunt Platform**: [wds-bug-hunt.netlify.app/bug-hunt](https://wds-bug-hunt.netlify.app/bug-hunt)  
> **GitHub Repository**: [github.com/JayantOlhyan/WDS-website](https://github.com/JayantOlhyan/WDS-website)

---

## 1. System Architecture

The WDS MSIT platform consists of two unified surfaces:
1. **Public Website**: Modern retro-computing aesthetic featuring the society ecosystem, technical wings, project showcase, verified live opportunities, and the multi-step recruitment pipeline.
2. **WDS Hub**: Role-based operational management system managing active sprint tasks, triage queues for bug reports, candidate screening pipelines, asset distribution, and live uptime monitoring.

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
        (TaskRepo, BugRepo, RecruitmentRepo, AuditRepo)
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

## 2. Security Architecture

### A. Server-Side Cryptographic Session Management
- **Zero Base64 Cookies**: Base64 session encoding has been completely purged.
- **Opaque Tokens**: Session IDs are generated using `crypto.randomBytes(32).toString('hex')` (256 bits of entropy) stored in a secure server session store.
- **Cookie Security**:
  - `HttpOnly`: Prevents access via client-side JavaScript (XSS mitigation).
  - `Secure`: Transmitted only over HTTPS in production.
  - `SameSite=Lax`: Defends against Cross-Site Request Forgery (CSRF).
  - `MaxAge`: 7 days TTL with automatic background cleanup.

### B. Role-Based Access Control (RBAC) Matrix

| Role | Access Level | Permissions |
| :--- | :--- | :--- |
| **`ADMIN`** | Level 100 | Full access to all endpoints, task creation/updates, recruitment management, bug triage, override state transitions. |
| **`CORE_TEAM`** | Level 80 | Recruitment lifecycle management, candidate screening & status updates, sprint tasks, bug triage. |
| **`TEAM_LEAD`** | Level 60 | Sprint task creation & assignment, bug triage & resolution, live health check monitoring. |
| **`MEMBER`** | Level 40 | Read operations, sprint task completion toggles, bug logging. Restricted from candidate recruitment drawer. |

### C. Bug Hunt Webhook HMAC SHA-256 Ingestion
- Ingestion endpoint: `POST /api/hub/bugs/webhook`
- Verification: Validates `x-wds-signature-256` header against `process.env.BUG_HUNT_WEBHOOK_SECRET` using `crypto.timingSafeEqual` to defend against timing attacks.

### D. Server-Side Request Forgery (SSRF) Protection
- Health monitoring (`/api/hub/health`) is protected by `MEMBER`+ authentication.
- Strict allowlist: `msit.in`, `wds-bug-hunt.netlify.app`, `github.com`.
- Hard blocks: `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16` (cloud metadata IP), IPv6 loopback (`::1`), link-local ranges, and unpermitted redirects (`redirect: "error"`).

---

## 3. Environment Configuration

Copy `.env.example` to `.env.local` and populate the values:

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

## 4. Expected Notion Database Schemas

### 1. Recruitment Database (`NOTION_DATABASE_ID`)
- `Full Name` (Title)
- `Enrollment Number` (Rich Text)
- `Branch` (Select)
- `Section` (Rich Text)
- `College Email` (Email)
- `Phone` (Phone Number)
- `Preferred Team` (Select)
- `Experience Level` (Select)
- `Time Commitment` (Select)
- `Status` (Select: `RECEIVED`, `SCREENING`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`)
- `Notes` (Rich Text)
- `Interviewer` (Rich Text)

### 2. Tasks Database (`NOTION_TASKS_DATABASE_ID`)
- `Task` (Title)
- `Status` (Select: `PENDING`, `IN_PROGRESS`, `COMPLETED`)
- `Priority` (Select: `HIGH`, `MEDIUM`, `LOW`)
- `Project` (Select / Rich Text)
- `Assignee` (Rich Text)
- `Due Date` (Date)

### 3. Bugs Database (`NOTION_BUGS_DATABASE_ID`)
- `Title` (Title)
- `Website` (Rich Text / URL)
- `Severity` (Select: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`)
- `Status` (Select: `OPEN`, `IN_PROGRESS`, `RESOLVED`)
- `Reporter` (Rich Text)

---

## 5. Local Development & Testing

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

## 6. Continuous Integration (GitHub Actions)

Every pull request and push to `main` triggers `.github/workflows/ci.yml`:
1. `npm ci`
2. `npm run lint`
3. `npm test` (28 unit & integration test suites)
4. `npm run build`
