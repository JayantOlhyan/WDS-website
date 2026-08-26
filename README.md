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
              Serverless HMAC Signed Session Cookie
              (/api/hub/auth + Stateless Verification)
```

---

## 2. Production Security & Hardening Standards

### A. Serverless-Resilient Cryptographic Sessions (`lib/sessionStore.ts`)
- **HMAC-SHA256 Signed Tokens**: Session cookies contain tamper-proof signed payloads (`<payload_b64>.<hmac_signature>`).
- **Serverless Parity**: Works across multi-region serverless lambdas on Vercel without memory drift or requiring an external Redis.
- **Revocation Support**: Instant revocation on logout via server-side session registry.
- **Brute-Force Protection**: IP-based rate limiting (max 5 failed login attempts per 5 minutes).

### B. Notion Pagination, Retries & Schema Diagnostics
- **Cursor Pagination Engine (`lib/notion/client.ts`)**: Automatic `start_cursor` pagination loops handling up to 500 items per database query.
- **Transient Error Retries**: 3x exponential backoff retry mechanism for 429 rate limits and 5xx upstream outages.
- **Schema Validator (`lib/notion/schemaValidator.ts`)**: Validates property bindings on all 4 Notion databases (Recruitment, Tasks, Bugs, Websites) without exposing secrets.
- **Admin Configuration Center (`/hub` → Settings & Admin)**: Restricted console for database diagnostics and data backups.

### C. Observability, Errors & Request ID Tracing
- **Request Tracing (`lib/errors.ts`)**: Every mutation and API request generates a random opaque identifier (`req_...`) returned via `X-Request-ID` and structured error responses `{ error: { code, message, requestId } }`.
- **Standardized Error Codes**: `UNAUTHORIZED`, `FORBIDDEN`, `VALIDATION_ERROR`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `DATABASE_OFFLINE`, `DATABASE_SCHEMA_MISMATCH`, `WEBHOOK_INVALID`, `INTERNAL_ERROR`.

### D. Data Integrity & Security Protections
- **CSV Formula Injection Defense (`lib/csv.ts`)**: Sanitizes cells starting with `=, +, -, @` with a leading apostrophe to prevent spreadsheet code execution.
- **Webhook Idempotency (`lib/webhook.ts`)**: Enforces single-delivery processing on `POST /api/hub/bugs/webhook` preventing duplicate bug creation on webhook replays.
- **SSRF Defense (`lib/healthChecks.ts`)**: Strict domain allowlist (`msit.in`, `wds-bug-hunt.netlify.app`, `github.com`), blocking private IPs (`10.x`, `192.168.x`, `169.254.x`), loopbacks, and redirects.
- **Candidate Privacy**: Strict candidate data isolation restricting evaluation scorecards exclusively to `CORE_TEAM` and `ADMIN`. Disallowed in `robots.ts` and excluded from `sitemap.xml`.

---

## 3. Disaster Recovery & Backup Runbook

Because Notion is the primary operational datastore, follow this protocol for backups and recovery:

### Weekly / Sprint Backup SOP
1. Log in to `/hub` with `ADMIN` credentials.
2. Navigate to **Admin & Settings** → **Data Backup Console**.
3. Download all 4 CSV datasets:
   - `RECRUITMENT CSV`
   - `SPRINT TASKS CSV`
   - `BUG HUNT CSV`
   - `SYSTEM AUDIT CSV`
4. Store exported CSVs in the designated encrypted society drive folder.

### Database Restoration Procedure (In case of accidental Notion database deletion)
1. In the Notion workspace, create a new Database using the schema defined in `lib/notion/schemaValidator.ts`.
2. Import the latest CSV backup into the newly created database.
3. Obtain the new database ID from the Notion page URL (`notion.so/<workspace>/<DATABASE_ID>?v=...`).
4. Update the corresponding environment variable in Vercel project settings:
   - `NOTION_DATABASE_ID` (Recruitment)
   - `NOTION_TASKS_DATABASE_ID` (Tasks)
   - `NOTION_BUGS_DATABASE_ID` (Bugs)
5. Redeploy the production branch. Navigate to `/hub` → **Admin** and verify status shows `ONLINE`.

---

## 4. Yearly Leadership Handover Checklist (`WDS 2026` → `WDS 2027`)

1. **GitHub Transfer**: Grant Owner role to incoming President and Tech Lead on `JayantOlhyan/WDS-website`.
2. **Notion Admin Access**: Transfer workspace admin ownership for society databases.
3. **Secret Rotation**: Regenerate `HUB_ADMIN_KEY`, `HUB_CORE_KEY`, and `BUG_HUNT_WEBHOOK_SECRET` in Vercel.
4. **Candidate Archival**: Export final candidate CSVs and duplicate the Recruitment template for the new academic batch.
5. **DNS & Vercel Verification**: Ensure domain records on college subdomains are bound to the incoming coordinator's email.
6. **Member Review**: Transition graduating seniors to `ALUMNI` status in the Member directory.

---

## 5. Environment Configuration

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

# Hub Session Secret (for HMAC signing)
HUB_SESSION_SECRET=your_32_byte_cryptographic_secret

# Bug Hunt Integration Webhook Secret
BUG_HUNT_WEBHOOK_SECRET=your_hmac_shared_secret
```

---

## 6. Local Development & Testing

```bash
# Install dependencies
npm install

# Run linter (ESLint)
npm run lint

# Run automated test suite (Vitest - 60 tests across 18 suites)
npm test

# Run development server
npm run dev

# Build production bundle (32 static & dynamic routes)
npm run build
```

---

## 7. Continuous Integration (GitHub Actions)

Every pull request and push to `main` triggers `.github/workflows/ci.yml`:
1. `npm ci`
2. `npm run lint` (ESLint Next.js validation)
3. `npm test` (60 automated unit & integration test suites)
4. `npm run build` (32 static & dynamic routes compiled)
