# Day 21 — API Load Testing Dashboard

## 🗓️ Day: 21 of 30
## 🏷️ Category: Developer Tools / Performance Engineering
## ⚡ Difficulty: Advanced
## 🕐 Estimated Build Time: 8–10 hours

---

## 📌 Project Overview

A professional-grade web-based API load testing tool — think a lightweight Postman + k6 hybrid with a beautiful real-time dashboard. Users configure HTTP endpoints, set concurrency levels and request rates, and watch live performance metrics stream in: response times, error rates, percentile latency (P50/P95/P99), and throughput. AI analyzes results and identifies bottlenecks with specific optimization recommendations.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Test Configuration | URL, method, headers, body, auth config |
| Concurrency Control | Set virtual users (1–1000) and ramp-up profile |
| Live Metrics Stream | Real-time charts updating every 500ms |
| Percentile Latency | P50, P95, P99, P999 response time breakdown |
| Error Analysis | Error rate by status code with payload samples |
| Throughput Chart | Requests/second over time visualization |
| AI Bottleneck Finder | Analyzes results and identifies root causes |
| Test Scenarios | Sequential, spike, soak, stress test profiles |
| Report Export | PDF report with charts and recommendations |
| Test History | Compare results across multiple test runs |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Recharts (real-time charts), Tailwind CSS
- **Load Engine**: Node.js worker threads + `undici` HTTP client
- **Real-Time**: Server-Sent Events (SSE) for live metric streaming
- **AI Analysis**: Google Gemini 1.5 Pro
- **Storage**: SQLite (via Drizzle ORM) for test history
- **PDF Export**: `puppeteer` + custom HTML template
- **Deployment**: VPS/DigitalOcean (needs persistent server)

---

## 🔧 Key Functions

### `runLoadTest(config: TestConfig): AsyncGenerator<MetricSnapshot>`
Spawns N worker threads each simulating a virtual user. Each worker fires HTTP requests and reports response time, status code, and response size back to the coordinator. The generator yields real-time snapshots every 500ms.

### `calculatePercentiles(responseTimes: number[]): PercentileStats`
Sorts the response time array and calculates P50, P95, P99, P999 using direct array indexing. Returns full histogram data for chart rendering.

### `detectAnomalies(timeSeries: MetricSnapshot[]): Anomaly[]`
Applies sliding window analysis to detect sudden latency spikes, error rate increases, or throughput drops. Flags anomalies with timestamp and magnitude.

### `analyzeResultsWithAI(summary: TestSummary): Promise<PerformanceAnalysis>`
Sends test summary statistics to Gemini with a performance engineering system prompt. Returns identified bottlenecks, likely root causes, and specific optimization recommendations.

### `generatePDFReport(test: TestResult): Promise<Buffer>`
Uses Puppeteer to render a styled HTML report with embedded Chart.js charts and exports as a professional PDF suitable for sharing with stakeholders.

---

## 📁 File Structure

```
api-load-tester/
├── app/
│   ├── page.tsx                # Test configuration UI
│   ├── results/[id]/page.tsx   # Live results dashboard
│   ├── history/page.tsx        # Past test runs
│   └── api/
│       ├── test/route.ts       # Start test endpoint
│       ├── stream/[id]/route.ts# SSE metrics stream
│       └── analyze/route.ts    # AI analysis endpoint
├── components/
│   ├── TestConfigurator.tsx    # Config form
│   ├── LiveCharts.tsx          # Real-time Recharts
│   ├── PercentileTable.tsx     # P50/P95/P99 table
│   ├── AIInsights.tsx          # AI recommendations
│   └── ErrorBreakdown.tsx      # Error analysis
├── lib/
│   ├── load-engine.ts          # Worker thread orchestration
│   ├── metrics.ts              # Stats calculations
│   └── gemini.ts
└── workers/http-worker.ts      # Virtual user worker
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are a senior performance engineer analyzing API load test results. 
Identify bottlenecks and provide actionable optimization recommendations.

Test Results Summary:
- Endpoint: {url}
- Virtual Users: {vus}
- Duration: {duration}s
- Total Requests: {totalRequests}
- Error Rate: {errorRate}%
- P50 Latency: {p50}ms
- P95 Latency: {p95}ms  
- P99 Latency: {p99}ms
- Throughput: {rps} req/s
- Error Breakdown: {errors}

Analyze and return JSON:
{
  "overallVerdict": "PASS|WARN|FAIL",
  "performanceScore": 72,
  "bottlenecks": [
    {
      "type": "DATABASE_CONTENTION",
      "severity": "HIGH",
      "evidence": "P99 spikes at 3200ms above 50 VUs suggest connection pool exhaustion",
      "recommendation": "Increase pg pool max from 10 to 25. Add connection timeout of 5s.",
      "estimatedImprovement": "40-60% P99 reduction"
    }
  ],
  "summary": "Two-sentence verdict for stakeholders"
}
```

---

## 📤 Expected Output (Result)

```json
{
  "overallVerdict": "WARN",
  "performanceScore": 61,
  "bottlenecks": [
    {
      "type": "DATABASE_CONNECTION_POOL",
      "severity": "HIGH",
      "evidence": "P99 latency of 3,240ms is 8x higher than P50 (410ms), indicating connection wait times under high concurrency",
      "recommendation": "Increase PostgreSQL connection pool max_connections. Implement connection pooling via PgBouncer. Target pool size: VUs * 0.3",
      "estimatedImprovement": "50-70% P99 reduction expected"
    },
    {
      "type": "MISSING_CACHING",
      "severity": "MEDIUM",
      "evidence": "Response time variance suggests no cache layer — same queries recomputed on every request",
      "recommendation": "Add Redis cache for read-heavy endpoints. 5-minute TTL for user profile data.",
      "estimatedImprovement": "3x throughput improvement on cached endpoints"
    }
  ],
  "summary": "API handles light load well but degrades significantly above 50 concurrent users due to database bottlenecks. Implementing connection pooling and Redis caching should resolve both identified issues."
}
```

**UI Display:**
```
⚡ Load Test Results — POST /api/users/profile

Duration: 60s | Virtual Users: 100 | Total Requests: 4,821

📊 Latency Percentiles:
  P50:  410ms   ██░░░░░░░░
  P95:  1,820ms ████████░░
  P99:  3,240ms ██████████  ⚠️ HIGH

Throughput: 80.3 req/s  |  Error Rate: 2.1%  ⚠️

🤖 AI Analysis:
  ❗ HIGH: Database Connection Pool Exhaustion
    Evidence: P99 is 8x higher than P50 above 50 VUs
    Fix: Increase pool size + add PgBouncer
    Expected: 50-70% P99 improvement

[Export PDF Report] [Compare with Previous] [Apply Fixes Guide]
```

---

## 🚀 Stretch Goals

- [ ] CLI tool (`npm run load-test --url ...`) 
- [ ] Grafana-compatible metrics export
- [ ] GitHub Actions integration for CI performance gates
- [ ] Distributed load generation across multiple regions
