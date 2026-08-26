"use client";

import React, { useState } from "react";
import { sound } from "@/lib/soundEffects";
import { BookOpen, FileCode, ShieldAlert, GitBranch, RefreshCw, Terminal, CheckCircle2 } from "lucide-react";

export function DocumentationView() {
  const [activeDoc, setActiveDoc] = useState<string>("deployment");

  const docs = [
    {
      id: "deployment",
      title: "Production Deployment & Next.js CI/CD",
      category: "OPERATIONS",
      content: `## Production Deployment Architecture

The WDS MSIT ecosystem is hosted on Vercel with automated GitHub Actions CI.

### Deployment Pipeline
1. Pull request submitted to \`main\`.
2. GitHub Actions executes:
   - \`npm ci\`
   - \`npm run lint\`
   - \`npm test\` (All 28+ unit & integration suites)
   - \`npm run build\`
3. Automatic preview deployment created.
4. Merge to \`main\` deploys live production at \`https://wds-msit.vercel.app\`.

### Environment Variables Checklist
- \`NOTION_API_KEY\`: Notion Internal Integration Secret.
- \`NOTION_DATABASE_ID\`: Recruitment candidate DB.
- \`NOTION_TASKS_DATABASE_ID\`: Sprint tasks DB.
- \`NOTION_BUGS_DATABASE_ID\`: Bug Hunt issues DB.
- \`BUG_HUNT_WEBHOOK_SECRET\`: HMAC SHA-256 secret.
- \`HUB_ADMIN_KEY\`, \`HUB_CORE_KEY\`, \`HUB_LEAD_KEY\`, \`HUB_MEMBER_KEY\`: Role credentials.`,
    },
    {
      id: "bughunt-ops",
      title: "Bug Hunt Operations & Webhook Triage",
      category: "TRIAGE",
      content: `## WDS Bug Hunt Portal Integration & Triage

The WDS Bug Hunt platform (\`wds-bug-hunt.netlify.app/bug-hunt\`) allows students across MSIT to hunt and submit vulnerability reports against college portals.

### Ingestion Contract (HMAC SHA-256)
- **Endpoint**: \`POST /api/hub/bugs/webhook\`
- **Header**: \`x-wds-signature-256: <hex_signature>\`
- **Verification**: Computed via \`crypto.createHmac('sha256', BUG_HUNT_WEBHOOK_SECRET)\`.
- **Triage Protocol**:
  1. High/Critical bugs immediately ping the technical lead.
  2. Bug status transitioned from \`OPEN\` → \`IN_PROGRESS\` upon assignment.
  3. Assigned developer creates fix on feature branch.
  4. Lead verifies and marks bug \`RESOLVED\`.`,
    },
    {
      id: "recruitment-ops",
      title: "Recruitment 2026 Evaluation SOP",
      category: "RECRUITMENT",
      content: `## Recruitment Pipeline Operations & Candidate Privacy

Student recruitment is managed strictly under CORE_TEAM and ADMIN clearance.

### Lifecycle Stages
1. **RECEIVED**: Student submits application via \`/recruitment/apply\`. Rate limit (5 submissions/10min per IP) and honeypot spam filter applied.
2. **SCREENING**: Core team screens portfolio and project links.
3. **SHORTLISTED**: Candidate marked for technical interview.
4. **INTERVIEW**: Interview evaluation scorecard recorded across 4 criteria:
   - Technical Competence (1-5)
   - Communication & Clarity (1-5)
   - Problem Solving (1-5)
   - Team Fit & Passion (1-5)
5. **SELECTED / REJECTED**: Final onboarding email dispatched.`,
    },
    {
      id: "incident-response",
      title: "Website Downtime & Incident Response SOP",
      category: "INCIDENTS",
      content: `## Disaster Recovery & Incident Protocol

### Portal Health Monitoring
- Health monitor queries registered endpoints with strict SSRF filtering (disallowing private IPs and internal redirect chains).
- Latency and HTTP status tracked continuously.

### Outage Escalation Steps
1. **Detection**: Health checker logs HTTP 5xx or timeout.
2. **Declaration**: Create Incident in Hub with \`CRITICAL\` or \`HIGH\` severity.
3. **Investigation**: Technical Lead inspects deployment logs and upstream DNS.
4. **Resolution**: Deploy rollback or fix, verify response code < 400, mark Incident \`RESOLVED\`.`,
    },
    {
      id: "handover",
      title: "Yearly Society Leadership Handover Guide",
      category: "GOVERNANCE",
      content: `## WDS Annual Leadership Transition (WDS 2026 → WDS 2027)

To ensure smooth multi-year continuity without dependency on single individuals:

### 1. Database Archival
- Export all candidate CSVs and sprint audit logs.
- Duplicate Notion database templates for the incoming batch year.
- Update \`NOTION_DATABASE_ID\` in Vercel to point to the new year.

### 2. Secret Rotation
- Regenerate \`HUB_ADMIN_KEY\` and \`HUB_CORE_KEY\`.
- Re-issue \`BUG_HUNT_WEBHOOK_SECRET\` and update Bug Hunt Netlify dashboard.

### 3. GitHub Team Ownership
- Transfer organization ownership to incoming President.
- Review and prune outdated branch permissions.`,
    },
  ];

  const currentDoc = docs.find((d) => d.id === activeDoc) || docs[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-wds-yellow/30">
        <div>
          <h1 className="font-pixel text-lg sm:text-xl text-wds-yellow">&gt;_ WDS STANDARD OPERATING PROCEDURES</h1>
          <p className="text-xs text-wds-muted mt-0.5">
            Official technical playbooks, incident response manuals, and yearly handover guidelines.
          </p>
        </div>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Index (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-[10px] font-pixel text-wds-yellow mb-2">&gt;_ HANDBOOK INDEX</div>
          {docs.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveDoc(doc.id);
              }}
              className={`w-full text-left p-3.5 border-2 transition-all text-xs ${
                activeDoc === doc.id
                  ? "border-wds-yellow bg-wds-card shadow-pixel-yellow"
                  : "border-wds-border-dim bg-wds-bg hover:border-wds-yellow/60 text-wds-muted hover:text-wds-white"
              }`}
            >
              <div className="text-[9px] font-pixel text-wds-yellow">{doc.category}</div>
              <div className="font-bold text-wds-white mt-1">{doc.title}</div>
            </button>
          ))}
        </div>

        {/* Document Content View (8 cols) */}
        <div className="lg:col-span-8 p-6 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow space-y-4">
          <div className="pb-3 border-b border-wds-yellow/30">
            <span className="font-pixel text-[9px] text-wds-yellow">{currentDoc.category}</span>
            <h2 className="font-pixel text-base sm:text-lg text-wds-white mt-1">{currentDoc.title}</h2>
          </div>

          <div className="text-xs text-wds-white space-y-4 font-mono leading-relaxed prose-invert">
            <pre className="p-4 bg-wds-bg border border-wds-yellow/20 text-wds-white text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {currentDoc.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
