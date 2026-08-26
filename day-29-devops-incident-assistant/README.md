# Day 29 — OpsPulse.AI (AI DevOps Incident Response & SRE Triage Assistant)

OpsPulse.AI is an intelligent SRE incident response command center that analyzes real-time server error logs, correlates failures with recent code deployments, diagnoses root causes with Gemini 1.5 Flash, generates executable remediation runbooks, drafts multi-audience stakeholder communications, and compiles post-mortems.

## 🚀 Features

- **🚨 Live Incident Command Center & Severity Triage (P1–P4)**: Real-time MTTR pulse timer, revenue burn rate ($/min), affected user metrics, and blast radius gauge.
- **📜 Real-Time Log Stream & Noise Reduction Terminal**: Streaming ANSI log viewer with filter by level (`FATAL`, `ERROR`, `WARN`, `INFO`), deduplication grouping, and custom log ingestion.
- **🤖 Gemini 1.5 Flash Root Cause Diagnosis**: Instantaneous technical root cause hypothesis with confidence score (`94%`), log citations, and failure mode classification.
- **🚀 Deployment Correlation Radar**: Traces git commit history and Kubernetes releases in the 4-hour pre-incident window.
- **📋 Executable Remediation Runbook**: Step-by-step checklist with CLI commands (`kubectl`, `systemctl`, `docker`, `SQL`) and 1-click copy triggers.
- **📣 Multi-Audience Stakeholder Comms Generator**: 1-Click generation for Slack/Teams war-room, Executive brief, and public StatusPage.io notices.
- **📑 1-Click Automated Post-Mortem Report**: Complete 5-Whys root cause analysis, event timeline, corrective action item tracking, and Markdown export.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack) & TypeScript
- **AI Engine**: Google Gemini 1.5 Flash API
- **Styling**: Tailwind CSS v4 (SRE Incident Command Center Dark Theme)
- **Deployment**: Vercel

## 👨‍💻 Author

Built by **Abdul Nabi** as part of the **30 Days 30 AI Projects** series.
