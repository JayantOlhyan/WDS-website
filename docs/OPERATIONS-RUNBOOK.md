# WDS OS v2.1 — Operations & Incident Resolution Runbook

This runbook guides technical leads and future society presidents through standard operating incidents, diagnoses, and recovery procedures.

---

## Incident 1: Notion Database Disconnected / Schema Mismatch

### Symptoms
- Hub displays banner: `"Notion Tasks Database Not Connected"` or `"DATABASE_SCHEMA_MISMATCH"`.

### Diagnosis
1. Log in to `/hub` with `ADMIN` credentials.
2. Navigate to **Admin & Settings** → **Notion Databases & Schema**.
3. Check which database is reporting `OFFLINE` or `UNCONFIGURED`.

### Action & Recovery
1. Open the Notion workspace and ensure the Integration Bot has been invited to the database (**Settings** → **Add Connections** → **WDS Integration**).
2. Verify database property names match standard names:
   - Tasks: `Task` (title), `Status` (select), `Priority` (select), `Project` (select), `Assignee` (rich_text).
   - Recruitment: `Full Name` (title), `Enrollment Number` (rich_text), `Branch` (select), `Status` (select).
3. If database was recreated, update `NOTION_DATABASE_ID` in Vercel settings and redeploy.

---

## Incident 2: Bug Hunt Webhook Rejection (`401 Unauthorized`)

### Symptoms
- Bug Hunt Netlify platform reports failed delivery with HTTP 401.

### Diagnosis
1. Check Vercel function logs for `/api/hub/bugs/webhook`.
2. Look for error message `"HMAC signature verification failed"`.

### Action & Recovery
1. Verify `BUG_HUNT_WEBHOOK_SECRET` matches exactly between Vercel and Netlify environment variables.
2. Ensure webhook request includes header `x-wds-signature-256: sha256=<hex_digest>`.
3. Test delivery using the reference script in `docs/WEBHOOK-CONTRACT.md`.

---

## Incident 3: Website Downtime Incident Escalation

### Symptoms
- Monitored college site (e.g. `msit.in` or `wds-bug-hunt.netlify.app`) transitions to `DOWN` (HTTP 5xx / timeout).

### Diagnosis
1. Hub automatically registers a new Incident (`/hub` → **Websites & Uptime**).
2. Inspect target URL directly to confirm whether outage is DNS, upstream web server, or CDN related.

### Action & Recovery
1. If college portal outage: Notify IT Computer Center (`admin@msit.in`).
2. If Bug Hunt outage: Check Netlify deployment logs for build or edge function crashes.
3. Once upstream service recovers, the Hub health check automatically resolves the incident and logs downtime duration.

---

## Incident 4: Annual Leadership Transition (`WDS 2026` → `WDS 2027`)

### Action
1. Open `/hub` → **WDS Handover**.
2. Complete all 6 checklist items sequentially:
   - [ ] Transfer GitHub Organization Ownership
   - [ ] Notion Workspace Admin Invite
   - [ ] Rotate Master Role Passkeys in Vercel
   - [ ] Archive Recruitment Candidate Records
   - [ ] Verify Domain DNS & Vercel Ownership
   - [ ] Review Active Member Roster
