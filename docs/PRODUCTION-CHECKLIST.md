# WDS OS v2.1 — Pre-Launch & Deployment Checklist

This document is the mandatory pre-flight verification checklist before promoting WDS OS to live production.

---

## 1. Environment & Secrets Configuration

| Item | Requirement | Verification Method | Status |
| :--- | :--- | :--- | :---: |
| `NOTION_API_KEY` | Valid Notion Internal Secret starting with `secret_` | Admin Diagnostic Center (`/hub` → Settings) | `REQUIRED` |
| `NOTION_DATABASE_ID` | Recruitment candidate database bound | Admin Diagnostic Center | `REQUIRED` |
| `NOTION_TASKS_DATABASE_ID` | Sprint tasks database bound | Admin Diagnostic Center | `REQUIRED` |
| `NOTION_BUGS_DATABASE_ID` | Bug Hunt queue database bound | Admin Diagnostic Center | `REQUIRED` |
| `HUB_SESSION_SECRET` | 32+ character high-entropy key for HMAC tokens | `lib/env.ts` test validator | `REQUIRED` |
| `HUB_ADMIN_KEY` | Master administrative access key | Admin login test | `REQUIRED` |
| `HUB_CORE_KEY` | Core team access key | Core login test | `REQUIRED` |
| `BUG_HUNT_WEBHOOK_SECRET` | Shared secret with Netlify platform | Webhook unit test (`__tests__/webhook.test.ts`) | `REQUIRED` |

---

## 2. Security & Boundaries

- [x] **HTTP Security Headers**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `HSTS` active in `next.config.mjs`.
- [x] **CSRF / Origin Validation**: `Origin` and `Referer` validation active on state-changing requests.
- [x] **SSRF Filters**: Loopbacks, private ranges, cloud metadata (`169.254.169.254`), and IPv6 Unique-Local (`fc00::/7`) blocked.
- [x] **Rate Limiting**: Brute-force throttling active on `/api/hub/auth` (max 5 failed attempts per 5 minutes).
- [x] **Candidate Privacy**: Zero applicant records exposed in `robots.txt` or `sitemap.xml`.
- [x] **CSV Formula Defense**: RFC 4180 sanitization prefixes formula characters (`=, +, -, @`) with `'`.

---

## 3. Deployment Smoke Test Sequence

1. **Public Site**: Navigate to `https://wds-msit.vercel.app/` and verify homepage hero, terminal, team, and projects.
2. **Hub Authentication**: Log in at `/hub` using `HUB_ADMIN_KEY`. Confirm HttpOnly session cookie is set.
3. **Admin Diagnostics**: Navigate to `/hub` → **Settings & Admin** and verify Notion database statuses report `ONLINE`.
4. **Task Mutation**: Toggle a task status and verify optimistic update + server persistence.
5. **Recruitment Pipeline**: View a candidate record as `ADMIN`, save interview scorecard, and export sanitized CSV.
6. **Handover Console**: Open `/hub` → **WDS Handover** and verify transition progress checklist.
7. **Logout**: Click `EXIT` in header and verify session cookie invalidation.
