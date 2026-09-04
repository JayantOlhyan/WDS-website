# Web Development Society — MSIT (WDS MSIT)

> The official digital ecosystem and internal operating system for the Web Development Society at MSIT.

## Overview

The WDS MSIT ecosystem unifies the public society identity and an internal operating system into a single cohesive platform. It replaces fragmented WhatsApp chats, scattered spreadsheets, and verbal handoffs with structured, persistent workflows. It consists of a public-facing website and an internal authenticated "Hub" used by society operators to manage recruitment, tasks, and events.

## Why This Project Exists

Managing a college tech society typically involves scattered Google Forms, unorganized WhatsApp groups, and lost data during yearly leadership handovers. This project exists to solve the problem of organizational amnesia. By consolidating public recruitment, internal task management, and project tracking into a centralized "WDS Operating System" (WDS OS v2.1), the society maintains continuous operational records, automated workflows, and strict data privacy.

## Features

### Implemented
- **Public Society Identity:** Landing pages, projects portfolio, opportunities board, and team directory (`app/about`, `app/projects`, `app/team`).
- **Interactive Terminal UI:** A stylized interactive terminal component (`components/InteractiveTerminal.tsx`).
- **Recruitment Engine:** Public application forms (`app/recruitment`) ingested securely.
- **WDS Hub (Internal OS):** Authenticated dashboard for operators (`app/hub`) to manage operations.
- **Notion Operational Datastore:** Deep integration with 11 core Notion databases (Tasks, Projects, Candidates, Bugs, etc.) serving as a headless CMS and datastore.
- **Stateless Serverless Authentication:** HMAC-SHA256 signed session cookies supporting multi-region serverless deployments without Redis (`lib/sessionStore.ts`).
- **Webhook Ingestion:** Secure webhook endpoint for external bug hunt platforms (`lib/webhook.ts`).
- **Automated Health Checks:** Internal service health monitoring with SSRF protection (`lib/healthChecks.ts`).

### Planned / Not Yet Implemented
- **Docker/Containerized Deployments:** Currently tightly coupled to Vercel/Serverless paradigms.
- **Full-Text Global Search:** Planned for the Hub, currently relying on Notion's native search limits.

## Architecture

The system operates strictly within a Serverless environment, leveraging Next.js API routes, a bespoke repository abstraction layer, and Notion as the primary database.

```mermaid
flowchart TD
    User([Public Users / Students]) --> PublicUI[Public Routes (/, /recruitment)]
    User --> BugHunt[Bug Hunt App (External)]
    
    BugHunt -- HMAC SHA-256 Signature --> Webhook[POST /api/hub/bugs/webhook]
    PublicUI -- Zod Validation --> ApplyAPI[POST /api/recruitment/apply]
    
    Webhook --> ReqID[Request ID Tracing Layer]
    ApplyAPI --> ReqID
    
    ReqID --> Repos[Repository Abstraction Layer\nTaskRepo, BugRepo, etc.]
    
    Operators([WDS Hub Operators]) -- Stateless HMAC Session --> HubAPI[Internal /api/hub/*]
    HubAPI --> Repos
    
    Repos -- HTTP REST / Exponential Backoff --> Notion[(Notion Operational Backend\n11 Databases)]
```

## How It Works

1. **Ingestion:** Data flows into the system via public Next.js forms or external webhooks.
2. **Validation:** Zod schemas (`lib/validation.ts`) strictly validate the shape of incoming requests.
3. **Tracing & Error Handling:** Every mutation generates an `X-Request-ID` for traceability (`lib/errors.ts`).
4. **Repository Layer:** Abstract repository classes (e.g., `TasksRepository.ts`) map JSON payloads to Notion's complex property objects (`lib/notion/properties.ts`).
5. **Pagination & Retries:** The Notion client (`lib/notion/client.ts`) handles rate limits with exponential backoff and transparently manages `start_cursor` pagination up to 500 items.

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (`tailwind.config.ts`), `clsx`, `tailwind-merge`
- **UI & Animations:** React 18, Framer Motion, Lucide React
- **Icons:** Lucide React

### Backend
- **Framework:** Next.js Serverless API Routes
- **Validation:** Zod
- **Authentication:** Custom HMAC-SHA256 Stateless Sessions

### Database
- **Engine:** Notion API (`@notionhq/client`) used as an operational datastore / headless CMS.
- **Schemas:** Enforced via application-level schemas (`lib/notion/schemaValidator.ts`).

### Infrastructure
- **Testing:** Vitest
- **Deployment Platform:** Vercel (target architecture)

## Repository Structure

```text
WDS-website/
├── __tests__/             # 29 test suites (Auth, SSRF, Notion, Webhooks)
├── app/                   # Next.js App Router (Public & Hub UI)
│   ├── api/               # API Routes (20 distinct route domains)
│   ├── hub/               # Authenticated WDS Hub UI
│   └── recruitment/       # Public recruitment forms
├── components/            # Reusable React components (Navbar, Terminal, UI)
├── docs/                  # Runbooks, checklists, Notion schema definitions
├── lib/                   
│   ├── notion/            # Notion API client, pagination, mappers
│   └── repositories/      # 25 repository pattern classes for data access
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## Prerequisites

- **Node.js**: v20+ (recommended based on types)
- **npm**: v9+
- **Notion Account**: Workspace with integration credentials
- **Git**

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/JayantOlhyan/WDS-website.git
cd WDS-website
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure Environment:**
```bash
cp .env.example .env.local
```
*(Populate the `.env.local` file according to the Environment Variables section).*

## Environment Variables

| Variable | Required | Purpose | Example |
| -------- | -------- | ------- | ------- |
| `NOTION_API_KEY` | Yes | Bearer token for Notion API | `ntn_secret_...` |
| `NOTION_*_DATABASE_ID` | Yes | 11 IDs for respective Notion DBs | `abc123def456...` |
| `HUB_ADMIN_KEY` | Yes | Password for Admin Role | `wds-admin-2026` |
| `HUB_CORE_KEY` | Yes | Password for Core Role | `wds-core-2026` |
| `HUB_SESSION_SECRET` | Yes | 32-byte secret for signing JWTs/Cookies | `super_secret_string` |
| `BUG_HUNT_WEBHOOK_SECRET` | Yes | Shared secret for webhook payload validation | `hmac_secret_key` |
| `NEXT_PUBLIC_APP_URL` | Yes | Base URL for metadata/routing | `http://localhost:3000` |

## Local Development

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`. 
- Public Site: `/`
- Internal Hub: `/hub`

To run linting:
```bash
npm run lint
```

## Docker / Self-Hosting

**Not currently implemented.** The architecture relies heavily on Vercel's serverless environment, specifically relying on Next.js Edge and Node.js serverless functions. 

## Database

The project completely bypasses traditional SQL/NoSQL databases, utilizing **Notion** as the primary datastore via the `@notionhq/client`. 

Data integrity is maintained by the application layer (`lib/notion/schemaValidator.ts`).

### Core Tables (Notion Databases)
1. **Tasks**: Status, Assignee, Project relation, Due Date.
2. **Projects**: Name, Status, Wing, Tech Stack, URLs.
3. **Candidates**: Application data, Branch, Selected Wing, Evaluation status.
4. **Interviews**: Interviewer, Date, Rubric Scores.
5. **Bugs**: Bug reports from webhooks.
*(See `docs/NOTION-SETUP.md` for the complete 11 database schema).*

## API

Internal API routes serve the Hub and Webhooks.

### Webhook Endpoint: `POST /api/hub/bugs/webhook`
- **Purpose**: Ingest bug reports from external Netlify Bug Hunt platform.
- **Authentication**: Requires `X-Hub-Signature-256` matching `BUG_HUNT_WEBHOOK_SECRET`.
- **Behavior**: Idempotent processing. Drops duplicate replays.

*(Other REST endpoints correspond directly to the 20 folders inside `app/api/`)*

## Authentication

Authentication is fully custom and stateless (`lib/sessionStore.ts`).
- **Mechanism**: HMAC-SHA256 signed session cookies.
- **Payload Format**: `<base64url_json_payload>.<hmac_sha256_hex>`
- **Roles**: Built-in RBAC supporting `ADMIN`, `CORE_TEAM`, `TEAM_LEAD`, and `MEMBER`.
- **Revocation**: Supported via an in-memory `revokedSessionIds` Set (designed for single-instance or sticky environments, though documented as Serverless compatible).

## Security

Security is a primary focus of this codebase. Implemented mechanisms include:
- **SSRF Protection:** `lib/healthChecks.ts` enforces a strict domain allowlist (e.g., `msit.in`, `github.com`) and actively blocks private IP ranges (`10.x`, `192.168.x`, `127.0.0.1`).
- **CSV Injection Defense:** `lib/csv.ts` sanitizes data exports, prefixing cells starting with `=, +, -, @` with an apostrophe.
- **Webhook Idempotency:** Prevents replay attacks by dropping duplicate event IDs.
- **Request Tracing:** Opaque `X-Request-ID` generation to track errors without leaking stack traces.
- **Brute-Force Protection:** IP-based rate limiting on logins (documented).

## Testing

The project uses **Vitest**. The test suite is highly comprehensive.
- **Test Framework:** Vitest
- **Location:** `__tests__/` (29 test files)
- **Coverage:** Includes RBAC logic, SSRF advanced bypass attempts, CSV injection, webhook idempotency, and session integrity.

Run tests:
```bash
npm test
```

## Performance

- **Pagination:** Custom pagination engine handles up to 500 items per Notion query.
- **Resilience:** Implements a 3x exponential backoff retry mechanism for Notion API `429` (Rate Limited) and `5xx` errors.
- **Caching:** Next.js App Router caching is utilized for static marketing pages.

## Deployment

Designed for deployment on **Vercel**.
1. Connect GitHub repository to Vercel.
2. Ensure all 21+ environment variables are populated in the Vercel project settings.
3. Deploy `main` branch.

GitHub Actions (`.github/workflows/ci.yml`) automatically runs linting and the 60 Vitest tests on all PRs prior to deployment.

## Development Workflow

1. Fork/Clone the repository.
2. Create a feature branch.
3. Run `npm test` locally to ensure no security regressions (especially in `lib/healthChecks.ts` or `sessionStore.ts`).
4. Ensure ESLint passes (`npm run lint`).
5. Open a PR against `main`.

## Troubleshooting

### Notion Database Schema Mismatch
**Cause**: Someone manually renamed a column in Notion.
**Resolution**: Check `/hub` Admin console. Match the Notion column names exactly with the required schema defined in `docs/NOTION-SETUP.md` and `lib/notion/schemaValidator.ts`.

### Webhook Signatures Failing
**Cause**: Secret mismatch between Bug Hunt Netlify and Main Vercel.
**Resolution**: Ensure `BUG_HUNT_WEBHOOK_SECRET` matches exactly in both deployments. 

## Known Limitations

- **Notion Rate Limiting:** While the app has exponential backoff, extreme concurrent traffic to the Hub could exhaust Notion's API limits (3 requests per second).
- **In-Memory Revocation in Serverless:** The session revocation `Set` in `lib/sessionStore.ts` is in-memory. In a distributed serverless environment (Vercel), a revoked token might still be valid for a few minutes on a different cold-started lambda instance unless a persistent store (Redis) is introduced.
- **No Docker Support:** Not easily self-hostable outside of Next.js environments.

## Roadmap

### Completed
- Public recruitment ingestion.
- 11-database Notion integration.
- Cryptographic serverless sessions.
- Comprehensive security testing suite.

### Planned
- Dedicated PostgreSQL caching layer for Notion data to bypass API limits.
- Redis integration for global session revocation synchronization.

## Contributing

1. Clone repository and install dependencies.
2. Checkout a new branch (`feature/your-feature`).
3. Commit your changes.
4. Run `npm test` and `npm run lint`.
5. Open a Pull Request.

## License

*(License not explicitly found in repository; assume standard proprietary internal use until explicitly licensed).*

## Author

Maintained by the Web Development Society at MSIT.
