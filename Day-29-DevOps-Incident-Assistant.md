# Day 29 — AI DevOps Incident Response Assistant

## 🗓️ Day: 29 of 30
## 🏷️ Category: DevOps / Site Reliability Engineering / AI Automation
## ⚡ Difficulty: Advanced
## 🕐 Estimated Build Time: 8–10 hours

---

## 📌 Project Overview

An intelligent incident response dashboard for DevOps teams. When an alert fires, the AI analyzes error logs, metrics, and recent deployment history to diagnose the root cause, suggest remediation steps, draft an incident communication for stakeholders, and generate a post-mortem template — all within seconds. Integrates with PagerDuty, Datadog, GitHub, and Slack to create a fully automated incident response workflow.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Log Ingestion | Paste or stream error logs from any system |
| Root Cause Analysis | AI identifies probable root cause with confidence |
| Automated Runbook | Step-by-step remediation checklist |
| Incident Timeline | Visual timeline of events leading to incident |
| Stakeholder Comms | Auto-drafts status page update and Slack message |
| Severity Classification | P1-P4 classification with response SLA |
| Post-Mortem Generator | Full post-mortem document template populated |
| Similar Incident Lookup | Finds past similar incidents and their resolutions |
| Deployment Correlation | Links incidents to recent code deployments |
| Alert Noise Reduction | Deduplicates and groups related alerts |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion
- **AI**: Google Gemini 1.5 Pro (128K context for long logs)
- **Real-Time**: Server-Sent Events (live log streaming)
- **Integrations**: PagerDuty API, Datadog API, GitHub API, Slack Webhooks
- **Database**: Supabase (incident history)
- **Auth**: Clerk (SSO for teams)
- **Deployment**: Vercel + Render (for SSE streaming)

---

## 🔧 Key Functions

### `analyzeIncident(logs: string, metrics: MetricSnapshot, recentDeployments: Deployment[]): Promise<IncidentAnalysis>`
Sends error logs, performance metrics, and recent deployment list to Gemini 1.5 Pro with a Site Reliability Engineering system prompt. Returns root cause hypothesis, confidence score, affected service, blast radius, and ordered remediation steps.

### `classifyIncidentSeverity(analysis: IncidentAnalysis, affectedUsers: number, revenueImpact: number): Severity`
Applies PagerDuty-style P1-P4 severity matrix based on: user impact percentage, estimated revenue impact per minute, service criticality tier, and detection-to-analysis time.

### `generateStakeholderUpdate(incident: Incident, audience: 'technical' | 'executive' | 'customer'): Promise<string>`
Creates audience-appropriate status updates: technical for on-call engineers (root cause + remediation progress), executive (business impact + ETA), and customer-facing (plain language status page text).

### `correlateWithDeployments(incidentTime: Date, deployments: Deployment[]): DeploymentCorrelation`
Finds code deployments within the 4-hour window before the incident. Scores correlation based on temporal proximity, changed services matching the incident scope, and PR risk score (lines changed, test coverage).

### `generatePostMortem(incident: Incident, resolution: Resolution): Promise<PostMortem>`
Creates a structured post-mortem document: timeline, root cause, contributing factors, impact summary, action items with owners and due dates, and detection/response improvement recommendations.

---

## 📁 File Structure

```
incident-response/
├── app/
│   ├── page.tsx                  # Incident dashboard
│   ├── incident/[id]/page.tsx    # Incident detail view
│   ├── history/page.tsx          # Past incidents
│   └── api/
│       ├── analyze/route.ts      # AI log analysis
│       ├── comms/route.ts        # Stakeholder message gen
│       ├── postmortem/route.ts   # Post-mortem generator
│       └── stream/[id]/route.ts  # SSE log streaming
├── components/
│   ├── IncidentCard.tsx          # Active incident card
│   ├── LogViewer.tsx             # Streaming log display
│   ├── RootCausePanel.tsx        # AI diagnosis panel
│   ├── RunbookChecklist.tsx      # Step-by-step checklist
│   ├── TimelineChart.tsx         # Incident event timeline
│   └── PostMortemEditor.tsx      # Collaborative post-mortem
└── lib/
    ├── gemini.ts
    ├── pagerduty.ts
    ├── datadog.ts
    └── github.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are a senior Site Reliability Engineer (SRE) performing real-time incident triage.
Analyze the provided error logs, metrics, and recent deployment context.

Your analysis must:
1. Identify the most probable root cause (be specific — exact function/service/query)
2. Assess blast radius (what else is affected)
3. Provide ordered remediation steps (most impactful first)
4. Flag if a recent deployment likely caused this

Output JSON only:
{
  "rootCause": {
    "hypothesis": "Specific description of what caused the incident",
    "confidence": 0.87,
    "evidenceFromLogs": ["Log line 1 supporting this", "Log line 2 supporting this"],
    "affectedService": "service-name",
    "failureMode": "CONNECTION_POOL_EXHAUSTION|OOM|DEADLOCK|DEPENDENCY_FAILURE|etc"
  },
  "blastRadius": {
    "primaryImpact": "Users cannot complete checkout",
    "secondaryImpact": ["Order history API degraded", "Email notifications queued"],
    "estimatedUsersAffected": 12400
  },
  "remediationSteps": [
    { "step": 1, "action": "Restart payment-service pods", "command": "kubectl rollout restart deploy/payment-service -n production", "expectedOutcome": "Clears connection pool and restores DB connections within 30s", "risk": "LOW" }
  ],
  "deploymentCorrelation": { "likelyCause": true, "deployment": "v2.4.1 payment-service", "deployedAt": "2026-08-07T06:30:00Z", "riskSignal": "Added DB query in hot path without connection limit" }
}
```

---

## 📤 Expected Output (Result)

```json
{
  "rootCause": {
    "hypothesis": "PostgreSQL connection pool exhausted in payment-service due to unclosed connections in the new refund processing loop introduced in v2.4.1",
    "confidence": 0.92,
    "evidenceFromLogs": [
      "ERROR: remaining connection slots reserved (08:31:22.441)",
      "FATAL: sorry, too many clients already — repeated 847 times (08:31:22 - 08:45:00)",
      "payment-service: UnhandledPromiseRejection in processRefund() — connection not released in finally block"
    ],
    "affectedService": "payment-service",
    "failureMode": "CONNECTION_POOL_EXHAUSTION"
  },
  "blastRadius": {
    "primaryImpact": "All payment processing down — 100% checkout failure rate",
    "secondaryImpact": ["Order API returning 503", "Inventory updates queued and delayed"],
    "estimatedUsersAffected": 12400
  },
  "remediationSteps": [
    { "step": 1, "action": "Rollback payment-service to v2.4.0", "command": "kubectl rollout undo deploy/payment-service -n production", "expectedOutcome": "Service restored within 60 seconds", "risk": "LOW" },
    { "step": 2, "action": "Temporarily increase DB pool max_connections", "command": "ALTER SYSTEM SET max_connections = 200; SELECT pg_reload_conf();", "expectedOutcome": "Buys time if rollback takes longer", "risk": "LOW" }
  ],
  "deploymentCorrelation": { "likelyCause": true, "deployment": "v2.4.1 payment-service", "deployedAt": "2026-08-07T06:30:00Z" }
}
```

**UI Display:**
```
🚨 ACTIVE INCIDENT — P1 | payment-service DOWN

Duration: 00:14:32  |  12,400 users affected  |  $4,200/min impact

🤖 AI Root Cause Analysis (92% confidence):
"PostgreSQL connection pool exhausted in payment-service
 due to unclosed connections in processRefund() loop
 introduced in v2.4.1 deployment at 6:30 AM."

📋 Remediation Checklist:
  [  ] 1. kubectl rollout undo deploy/payment-service ← START HERE
  [  ] 2. Increase max_connections to 200 (if rollback slow)
  [  ] 3. Verify payment API health after rollback

📣 Slack Draft: "We're experiencing checkout issues affecting...
               Estimated resolution: 5-10 minutes"

[Execute Step 1] [Send Comms] [Generate Post-Mortem]
```

---

## 🚀 Stretch Goals

- [ ] Auto-remediation execution (with human approval gate)
- [ ] PagerDuty webhook integration for automatic alert ingestion
- [ ] Incident simulation/training mode for new SREs
- [ ] Cost of incident calculator (revenue impact reporting)
