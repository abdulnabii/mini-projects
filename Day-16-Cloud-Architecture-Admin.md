# Day 16 — Cloud Architecture Admin Dashboard

## 🗓️ Day: 16 of 30
## 🏷️ Category: Cloud / DevOps / Admin Tools
## ⚡ Difficulty: Intermediate-Advanced
## 🕐 Estimated Build Time: 6–8 hours

---

## 📌 Project Overview

A full-featured **Cloud Infrastructure Admin Dashboard** that gives developers and DevOps engineers a single-pane-of-glass view of their cloud architecture. Connect to AWS, GCP, or Azure and instantly visualize all running services, resource health, cost breakdowns, and deployment topology — rendered as an interactive architecture diagram.

The dashboard goes beyond simple monitoring: it lets you **draw and design cloud architecture diagrams** from scratch using a drag-and-drop canvas (like Lucidchart, but in your browser), export them as PNG/PDF, and share them with your team. Every resource node shows live status pulled from the cloud provider APIs.

Built as a production-grade Next.js admin site with role-based access, dark mode, and real-time polling — the kind of internal tooling that actually gets used at real companies.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Interactive Architecture Canvas | Drag-and-drop cloud resource nodes (EC2, Lambda, S3, RDS, VPC, etc.) onto a canvas |
| Live Resource Sync | Connects to AWS/GCP via API keys and auto-imports running resources |
| Real-Time Health Monitor | Color-coded health status (green/yellow/red) for each resource with live polling |
| Cost Breakdown Panel | Monthly cost per service with trend graphs and budget alerts |
| Topology View | Auto-generated network topology showing connections between services |
| Multi-Environment Support | Switch between dev / staging / production environments |
| Export & Share | Export architecture diagram as PNG, PDF, or shareable link |
| Incident Log | Timeline of infrastructure events, alerts, and deployments |
| Role-Based Access | Admin, Viewer, Editor roles with Supabase Auth |
| AI Architecture Advisor | AI reviews your architecture and flags anti-patterns, security gaps, and cost savings |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion
- **Diagram Canvas**: React Flow (`@xyflow/react`) for interactive node-edge diagrams
- **Charts**: Recharts for cost and performance graphs
- **Backend**: Next.js API Routes (Edge-compatible)
- **Auth & DB**: Supabase (Auth + PostgreSQL for saved diagrams)
- **Cloud SDKs**: `@aws-sdk/client-ec2`, `@aws-sdk/client-cloudwatch` (mocked in demo)
- **AI Advisor**: Google Gemini 1.5 Pro for architecture review
- **Export**: `html-to-image` for PNG/PDF export
- **Deployment**: Vercel

---

## 🔧 Key Functions

### `syncCloudResources(provider: 'aws' | 'gcp' | 'azure', credentials: CloudCredentials): Promise<ResourceNode[]>`
Calls the cloud provider's API to fetch all running resources (instances, databases, storage buckets, functions, load balancers). Returns a normalized `ResourceNode[]` array regardless of provider, enabling multi-cloud support from a single interface.

### `buildTopologyGraph(resources: ResourceNode[]): DiagramGraph`
Analyzes resource relationships (e.g., EC2 in same VPC, Lambda connected to RDS, ALB pointing to ECS tasks) and constructs a `DiagramGraph` with nodes and edges ready to render in React Flow. Groups resources into swimlanes by VPC/region.

### `calculateCostBreakdown(resources: ResourceNode[], billingData: BillingRecord[]): CostSummary`
Aggregates cloud billing records by service type and maps costs to the diagram nodes. Returns monthly spend per service, daily trend, projected month-end cost, and top 5 cost drivers. Triggers budget alerts when projected spend exceeds threshold.

### `analyzeArchitectureWithAI(diagram: DiagramGraph): Promise<ArchitectureReview>`
Sends the full resource topology as a structured JSON prompt to Gemini. The AI identifies: single points of failure, missing redundancy, open security groups, over-provisioned resources, and estimated cost savings. Returns an actionable review with severity ratings.

### `exportDiagramAsImage(canvasRef: RefObject<HTMLElement>, format: 'png' | 'pdf'): Promise<Blob>`
Uses `html-to-image` to capture the React Flow canvas at 2x resolution. Handles transparent backgrounds, custom fonts, and node icons. Packages the result as a downloadable Blob with proper MIME type.

---

## 📁 File Structure

```
cloud-architecture-admin/
├── app/
│   ├── layout.tsx                    # Admin shell with sidebar nav
│   ├── page.tsx                      # Overview / landing redirect
│   ├── (admin)/
│   │   ├── dashboard/page.tsx        # Main overview with stats cards
│   │   ├── topology/page.tsx         # Interactive architecture canvas
│   │   ├── resources/page.tsx        # Resource table with filters
│   │   ├── costs/page.tsx            # Cost breakdown & budget tracker
│   │   ├── incidents/page.tsx        # Incident & deployment log
│   │   └── settings/page.tsx         # Cloud credentials & team settings
│   └── api/
│       ├── resources/route.ts        # Fetch + sync cloud resources
│       ├── topology/route.ts         # Build diagram graph
│       ├── costs/route.ts            # Billing data aggregation
│       └── ai-review/route.ts        # Gemini architecture advisor
├── components/
│   ├── admin/
│   │   ├── sidebar.tsx               # Collapsible nav sidebar
│   │   ├── topbar.tsx                # Environment switcher + user menu
│   │   └── stats-card.tsx           # Summary metric cards
│   ├── topology/
│   │   ├── ArchitectureCanvas.tsx    # React Flow canvas wrapper
│   │   ├── ResourceNode.tsx          # Custom node with icon + status
│   │   ├── ConnectionEdge.tsx        # Animated edge for traffic flow
│   │   └── Toolbar.tsx               # Add nodes, export, zoom controls
│   ├── costs/
│   │   ├── CostChart.tsx             # Recharts bar + line chart
│   │   └── BudgetAlert.tsx           # Alert banner when over budget
│   └── ai/
│       └── ArchitectureReview.tsx    # Slide-in AI review panel
├── lib/
│   ├── aws-client.ts                 # AWS SDK wrapper (mock-friendly)
│   ├── topology-builder.ts           # Graph construction logic
│   ├── cost-calculator.ts            # Billing aggregation
│   └── gemini-advisor.ts             # AI architecture review
├── types/
│   └── cloud.ts                      # ResourceNode, DiagramGraph, etc.
└── data/
    └── mock-resources.json           # Demo data for no-credentials mode
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are a senior cloud architect with 15 years of experience designing 
production infrastructure on AWS, GCP, and Azure. Your job is to review 
a cloud architecture topology and provide a structured assessment.

Be specific, reference actual AWS/GCP service names, and prioritize findings 
by business impact. Always include estimated cost savings where relevant.

Return your review as valid JSON in this exact format:
{
  "overallScore": 72,
  "summary": "One sentence summary of architecture health",
  "findings": [
    {
      "severity": "critical | warning | info",
      "category": "security | reliability | performance | cost | scalability",
      "title": "Short issue title",
      "description": "Detailed explanation of the problem",
      "recommendation": "Specific fix with service names",
      "estimatedSavings": "$120/month (optional)"
    }
  ],
  "strengths": ["Well-architected strength 1", "Strength 2"],
  "topPriority": "The single most important thing to fix first"
}

USER:
Review this cloud architecture:
{topology_json}

Current monthly spend: ${monthly_cost}
Environment: {environment}
```

---

## 📤 Expected Output (Result)

```json
{
  "overallScore": 68,
  "summary": "Functional architecture with critical reliability gaps and 40% cost optimization potential.",
  "findings": [
    {
      "severity": "critical",
      "category": "reliability",
      "title": "Single AZ Database — No Failover",
      "description": "RDS instance running in us-east-1a only. Any AZ outage causes full database downtime.",
      "recommendation": "Enable Multi-AZ deployment on RDS. Adds ~$45/month but provides automatic failover in 60-120 seconds.",
      "estimatedSavings": null
    },
    {
      "severity": "critical",
      "category": "security",
      "title": "Security Group 0.0.0.0/0 on Port 22",
      "description": "EC2 instance sg-0abc123 has SSH open to the entire internet. This is actively scanned by bots.",
      "recommendation": "Restrict port 22 to your office IP range or replace SSH with AWS Systems Manager Session Manager.",
      "estimatedSavings": null
    },
    {
      "severity": "warning",
      "category": "cost",
      "title": "Over-provisioned EC2 Instances",
      "description": "3x t3.xlarge running at average 12% CPU utilization. You are paying for 88% unused compute.",
      "recommendation": "Downsize to t3.medium or switch to t4g.medium (ARM) instances.",
      "estimatedSavings": "$180/month"
    },
    {
      "severity": "info",
      "category": "scalability",
      "title": "No Auto Scaling Group",
      "description": "EC2 instances are static. Traffic spikes will cause degraded performance.",
      "recommendation": "Wrap instances in an Auto Scaling Group behind an Application Load Balancer.",
      "estimatedSavings": null
    }
  ],
  "strengths": [
    "CloudFront CDN correctly placed in front of S3 static assets",
    "VPC with public/private subnet separation is properly configured"
  ],
  "topPriority": "Enable RDS Multi-AZ immediately — a single AZ failure will take down your entire application."
}
```

**Admin Dashboard UI:**
```
┌─────────────────────────────────────────────────────────┐
│  ☁️  CloudArch Admin          [Production ▼]  [Abdul ▼] │
├───────────┬─────────────────────────────────────────────┤
│ Dashboard │  📊 Overview                                 │
│ Topology  │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ Resources │  │ 14 Resources│ $847/mo │ 2 Critical│    │
│ Costs     │  │ ✅ 11 Healthy│ ↑12% MoM│ ⚠ 3 Warns │    │
│ Incidents │  └──────────┘ └──────────┘ └──────────┘    │
│ Settings  │                                              │
│           │  🗺️ Architecture Topology                   │
│           │  [Interactive React Flow Canvas]             │
│           │  EC2 ──→ RDS    Lambda ──→ S3               │
│           │   ↓              ↑                           │
│           │  ALB          API GW                         │
│           │                                              │
│           │  [🤖 AI Review] [Export PNG] [+ Add Node]   │
└───────────┴─────────────────────────────────────────────┘
```

---

## 🚀 Stretch Goals

- [ ] Terraform/CDK import — paste IaC code and auto-generate diagram
- [ ] Cost anomaly detection with email alerts
- [ ] Multi-cloud comparison view (same workload cost on AWS vs GCP vs Azure)
- [ ] CI/CD pipeline visualization (GitHub Actions → ECR → ECS deploy flow)
- [ ] Diagram version history with diff view (what changed between deploys)
- [ ] Public sharing with read-only link and expiry
